const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Configuration helper
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

// ----------------------------------------------------------------------
// 1. Send Phone OTP (Twilio Verify)
// ----------------------------------------------------------------------
exports.sendPhoneOtp = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

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
// 2. Verify Phone OTP (Twilio Verify)
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

    // Set phone verification status on user document
    await db.doc(`users/${uid}`).set(
      {
        phone_number: phone,
        phone_verified: true,
        whatsapp_opt_in: true,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Write reverse lookup index for inbound STOP webhooks
    await db.doc(`phone_index/${phone}`).set({ uid });

    return { verified: true };
  } catch (err) {
    console.error('verifyPhoneOtp error:', err);
    throw new functions.https.HttpsError('invalid-argument', err.message || 'Verification failed');
  }
});

// ----------------------------------------------------------------------
// 3. Send Scheduled Due Reminders (Runs every 10 minutes)
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
      if (dueMillis > windowEnd.toMillis()) continue; // Not due within 15 minutes yet

      // Send Email Reminder
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

      // Send WhatsApp Reminder
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

      // Mark reminder sent
      await taskDoc.ref.update({ reminder_sent: true });
    }
  }
});

// ----------------------------------------------------------------------
// 4. Twilio Inbound Webhook ("STOP" Opt-Out)
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
