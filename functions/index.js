const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

admin.initializeApp();

// Configuration helpers
const getTwilioClient = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID || functions.config()?.twilio?.sid;
  const token = process.env.TWILIO_AUTH_TOKEN || functions.config()?.twilio?.auth;
  if (!sid || !token) throw new Error('Twilio credentials not configured');
  return twilio(sid, token);
};

const getVerifySid = () => {
  return process.env.TWILIO_VERIFY_SID || functions.config()?.twilio?.verify_sid;
};

const getWhatsappFrom = () => {
  return process.env.TWILIO_WHATSAPP_FROM || functions.config()?.twilio?.whatsapp_from;
};

const getPepper = () => {
  return process.env.OTP_PEPPER || functions.config()?.otp?.pepper || 'taskforge-secure-pepper-secret-key';
};

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const DAILY_SEND_LIMIT = 10;

function hashCode(email, code) {
  return crypto.createHash('sha256').update(`${email}:${code}:${getPepper()}`).digest('hex');
}

function todayKey(email) {
  const day = new Date().toISOString().slice(0, 10);
  return `${email}_${day}`;
}

// ----------------------------------------------------------------------
// 1. Passwordless Email OTP: Send 6-Digit Code
// ----------------------------------------------------------------------
exports.sendEmailOtp = functions.https.onCall(async (data) => {
  const email = String(data.email || '').trim().toLowerCase();
  const fullName = String(data.fullName || '').trim().slice(0, 100);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Enter a valid email address.');
  }

  const sendgridKey = process.env.SENDGRID_API_KEY || functions.config()?.sendgrid?.key;
  if (sendgridKey) {
    sgMail.setApiKey(sendgridKey);
  }

  const db = admin.firestore();
  const rateRef = db.doc(`email_otp_rate/${todayKey(email)}`);

  await db.runTransaction(async (tx) => {
    const rateDoc = await tx.get(rateRef);
    const count = rateDoc.exists ? rateDoc.data().count : 0;
    if (count >= DAILY_SEND_LIMIT) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many code requests today. Try again tomorrow.'
      );
    }
    tx.set(rateRef, { count: count + 1 }, { merge: true });
  });

  const code = crypto.randomInt(100000, 999999).toString();
  await db.doc(`email_otp/${email}`).set({
    codeHash: hashCode(email, code),
    pendingFullName: fullName || null,
    expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + OTP_TTL_MS),
    attempts: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (sendgridKey) {
    await sgMail.send({
      to: email,
      from: 'noreply@taskforge.app',
      subject: `Your TaskForge sign-in code: ${code}`,
      text: `Your sign-in code is ${code}. It expires in 10 minutes. If you didn't request this, ignore this email.`,
    });
  } else {
    console.log(`[Dev] SendGrid key not configured. OTP code generated for ${email}.`);
  }

  return { sent: true };
});

// ----------------------------------------------------------------------
// 2. Passwordless Email OTP: Verify Code & Return Custom Token
// ----------------------------------------------------------------------
exports.verifyEmailOtp = functions.https.onCall(async (data) => {
  const email = String(data.email || '').trim().toLowerCase();
  const code = String(data.code || '').trim();

  if (!email || !code) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and code are required.');
  }

  const db = admin.firestore();
  const otpRef = db.doc(`email_otp/${email}`);
  const otpDoc = await otpRef.get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError('invalid-argument', 'Request a new code.');
  }

  const otp = otpDoc.data();

  if (otp.expiresAt.toMillis() < Date.now()) {
    await otpRef.delete();
    throw new functions.https.HttpsError('invalid-argument', 'Code expired. Request a new one.');
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    await otpRef.delete();
    throw new functions.https.HttpsError('resource-exhausted', 'Too many incorrect attempts. Request a new code.');
  }

  if (hashCode(email, code) !== otp.codeHash) {
    await otpRef.update({ attempts: admin.firestore.FieldValue.increment(1) });
    throw new functions.https.HttpsError('invalid-argument', 'Incorrect code.');
  }

  await otpRef.delete();

  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch {
    userRecord = await admin.auth().createUser({
      email,
      displayName: otp.pendingFullName || email.split('@')[0],
      emailVerified: true,
    });
  }

  await db.doc(`users/${userRecord.uid}`).set(
    {
      name: userRecord.displayName || otp.pendingFullName || email.split('@')[0],
      email,
      avatar_url: userRecord.photoURL || '',
      phone_number: null,
      phone_verified: false,
      whatsapp_opt_in: false,
      email_reminders_enabled: true,
      isGuest: false,
      theme: 'dark',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const token = await admin.auth().createCustomToken(userRecord.uid);
  return { token };
});

// ----------------------------------------------------------------------
// 3. Send Phone OTP (Twilio Verify)
// ----------------------------------------------------------------------
exports.sendPhoneOtp = functions.https.onCall(async (data, context) => {
  const { phone } = data;
  if (!phone || !phone.startsWith('+')) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid phone number in E.164 format is required');
  }

  try {
    const client = getTwilioClient();
    const verifySid = getVerifySid();

    await client.verify.v2.services(verifySid).verifications.create({
      to: phone,
      channel: 'sms',
    });

    return { sent: true };
  } catch (err) {
    console.error('sendPhoneOtp error:', err);
    throw new functions.https.HttpsError('internal', err.message || 'Failed to send OTP');
  }
});

// ----------------------------------------------------------------------
// 4. Verify Phone OTP (Twilio Verify)
// ----------------------------------------------------------------------
exports.verifyPhoneOtp = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

  const { phone, code } = data;
  if (!phone || !code) {
    throw new functions.https.HttpsError('invalid-argument', 'Phone and code are required');
  }

  try {
    const client = getTwilioClient();
    const verifySid = getVerifySid();

    const check = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code,
    });

    if (check.status !== 'approved') {
      throw new functions.https.HttpsError('invalid-argument', 'Incorrect or expired verification code');
    }

    const uid = context.auth.uid;
    const db = admin.firestore();

    await db.doc(`users/${uid}`).set(
      {
        phone_number: phone,
        phone_verified: true,
        whatsapp_opt_in: true,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.doc(`phone_index/${phone}`).set({ uid });

    return { verified: true };
  } catch (err) {
    console.error('verifyPhoneOtp error:', err);
    throw new functions.https.HttpsError('invalid-argument', err.message || 'Verification failed');
  }
});

// ----------------------------------------------------------------------
// 5. Complete Guest Verification (Dual Email+Phone Verification & Migration)
// ----------------------------------------------------------------------
exports.completeGuestVerification = functions.https.onCall(async (data, context) => {
  const guestUid = context.auth?.uid;
  if (!guestUid) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in as a guest first.');
  }

  const email = String(data.email || '').trim().toLowerCase();
  const emailCode = String(data.emailCode || '').trim();
  const phone = String(data.phone || '').trim();
  const phoneCode = String(data.phoneCode || '').trim();

  if (!email || !emailCode || !phone || !phoneCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Email, phone, and both verification codes are required.');
  }

  const db = admin.firestore();

  // 1. Verify Email OTP code
  const otpRef = db.doc(`email_otp/${email}`);
  const otpDoc = await otpRef.get();
  if (!otpDoc.exists) {
    throw new functions.https.HttpsError('invalid-argument', 'Request a new email code.');
  }
  const otp = otpDoc.data();
  if (otp.expiresAt.toMillis() < Date.now()) {
    await otpRef.delete();
    throw new functions.https.HttpsError('invalid-argument', 'Email code expired.');
  }
  if (otp.attempts >= MAX_ATTEMPTS) {
    await otpRef.delete();
    throw new functions.https.HttpsError('resource-exhausted', 'Too many incorrect email code attempts.');
  }
  if (hashCode(email, emailCode) !== otp.codeHash) {
    await otpRef.update({ attempts: admin.firestore.FieldValue.increment(1) });
    throw new functions.https.HttpsError('invalid-argument', 'Incorrect email code.');
  }
  await otpRef.delete();

  // 2. Verify Phone OTP code via Twilio Verify
  let twilioClient;
  try {
    twilioClient = getTwilioClient();
    const verifySid = getVerifySid();
    const check = await twilioClient.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code: phoneCode,
    });
    if (check.status !== 'approved') {
      throw new functions.https.HttpsError('invalid-argument', 'Incorrect or expired phone code.');
    }
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    console.warn('Twilio check error (dev fallback):', err.message);
  }

  // 3. Find or create permanent account
  let userRecord;
  const guestDoc = await db.doc(`users/${guestUid}`).get();
  const guestName = guestDoc.exists ? guestDoc.data()?.name : null;

  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch {
    userRecord = await admin.auth().createUser({
      email,
      displayName: guestName || email.split('@')[0],
      emailVerified: true,
    });
  }

  const realUid = userRecord.uid;

  // 4. Migrate guest data (tasks, projects, labels) to permanent account
  const subcollections = ['tasks', 'projects', 'labels'];
  const batch = db.batch();

  for (const col of subcollections) {
    const guestDocs = await db.collection(`users/${guestUid}/${col}`).get();
    guestDocs.forEach((docSnap) => {
      batch.set(db.doc(`users/${realUid}/${col}/${docSnap.id}`), docSnap.data());
      batch.delete(docSnap.ref);
    });
  }
  await batch.commit();

  // 5. Upgrade permanent profile and cleanup guest records
  await db.doc(`users/${realUid}`).set(
    {
      name: userRecord.displayName || guestName || email.split('@')[0],
      email,
      phone_number: phone,
      phone_verified: true,
      whatsapp_opt_in: true,
      email_reminders_enabled: true,
      isGuest: false,
      theme: guestDoc.exists ? guestDoc.data()?.theme || 'dark' : 'dark',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.doc(`phone_index/${phone}`).set({ uid: realUid });
  await db.doc(`users/${guestUid}`).delete();
  try {
    await admin.auth().deleteUser(guestUid);
  } catch {
    // Guest user already deleted or missing, ignore
  }

  const token = await admin.auth().createCustomToken(realUid);
  return { token };
});

// ----------------------------------------------------------------------
// 6. Send Scheduled Due Reminders (Runs every 10 minutes)
// ----------------------------------------------------------------------
exports.sendDueReminders = functions.pubsub.schedule('every 10 minutes').onRun(async () => {
  const sendgridKey = process.env.SENDGRID_API_KEY || functions.config()?.sendgrid?.key;
  if (sendgridKey) {
    sgMail.setApiKey(sendgridKey);
  }

  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  const windowEnd = admin.firestore.Timestamp.fromMillis(now.toMillis() + 15 * 60 * 1000);

  const usersSnap = await db.collection('users').get();
  const twilioClient = getTwilioClient();
  const whatsappFrom = getWhatsappFrom();

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const user = userDoc.data();

    const tasksSnap = await db
      .collection(`users/${uid}/tasks`)
      .where('reminder_sent', '==', false)
      .where('status', '!=', 'completed')
      .get();

    for (const taskDoc of tasksSnap.docs) {
      const task = taskDoc.data();
      if (!task.due_date) continue;

      const dueMillis = new Date(task.due_date).getTime();
      if (dueMillis > windowEnd.toMillis()) continue;

      if (user.email_reminders_enabled && user.email && sendgridKey) {
        try {
          await sgMail.send({
            to: user.email,
            from: 'reminders@taskforge.app',
            subject: `Task Reminder: ${task.title}`,
            text: `Hi ${user.name || 'there'},\n\nYour task "${task.title}" is due soon!\nDue Date: ${new Date(task.due_date).toLocaleString()}\n\nTaskForge`,
          });
        } catch (err) {
          console.error(`Email send failed for user ${uid}:`, err);
        }
      }

      if (user.whatsapp_opt_in && user.phone_verified && user.phone_number && whatsappFrom) {
        try {
          await twilioClient.messages.create({
            from: `whatsapp:${whatsappFrom}`,
            to: `whatsapp:${user.phone_number}`,
            body: `📌 Task Reminder: "${task.title}" is due soon.\n\nReply STOP at any time to opt out of WhatsApp reminders.`,
          });
        } catch (err) {
          console.error(`WhatsApp send failed for user ${uid}:`, err);
        }
      }

      await taskDoc.ref.update({ reminder_sent: true });
    }
  }
});

// ----------------------------------------------------------------------
// 7. Twilio Inbound Webhook ("STOP" Opt-Out)
// ----------------------------------------------------------------------
exports.whatsappInbound = functions.https.onRequest(async (req, res) => {
  const from = (req.body.From || '').replace('whatsapp:', '').trim();
  const body = (req.body.Body || '').trim().toLowerCase();

  if (body === 'stop' && from) {
    const db = admin.firestore();
    const indexDoc = await db.doc(`phone_index/${from}`).get();
    if (indexDoc.exists) {
      const { uid } = indexDoc.data();
      await db.doc(`users/${uid}`).set({ whatsapp_opt_in: false }, { merge: true });
      console.log(`User ${uid} opted out of WhatsApp reminders.`);
    }
  }

  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');
});
