import {
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

let googleAccessToken = null;

export function getGoogleAccessToken() {
  if (googleAccessToken) return googleAccessToken;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('google_access_token');
  }
  return null;
}

export function setGoogleAccessToken(token) {
  googleAccessToken = token;
  if (typeof window !== 'undefined' && token) {
    sessionStorage.setItem('google_access_token', token);
  }
}

export async function ensureProfileForFirebaseUser(firebaseUser, extra = {}) {
  if (!firebaseUser) return null;

  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const existingSnap = await getDoc(userRef);

    const baseData = {
      name: firebaseUser.displayName || extra.name || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      avatar_url: firebaseUser.photoURL || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      updated_at: new Date().toISOString(),
      ...extra,
    };

    if (!existingSnap.exists()) {
      const initialProfile = {
        ...baseData,
        phone_number: null,
        phone_verified: false,
        whatsapp_opt_in: false,
        email_reminders_enabled: true,
        theme: 'dark',
        created_at: new Date().toISOString(),
      };
      await setDoc(userRef, initialProfile, { merge: true });
      return { id: firebaseUser.uid, uid: firebaseUser.uid, ...initialProfile };
    }

    await setDoc(userRef, baseData, { merge: true });
    const updatedSnap = await getDoc(userRef);
    return { id: firebaseUser.uid, uid: firebaseUser.uid, ...updatedSnap.data() };
  } catch (err) {
    console.error('Error ensuring profile in Firestore:', err);
    return {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || extra.name || 'User',
      avatar_url: firebaseUser.photoURL || '',
      phone_verified: false,
      whatsapp_opt_in: false,
      email_reminders_enabled: true,
    };
  }
}

export async function getCurrentUser() {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  return ensureProfileForFirebaseUser(firebaseUser);
}

export async function signOutUser() {
  googleAccessToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('google_access_token');
  }
  await firebaseSignOut(auth);
}

export const signOut = signOutUser;

export async function updateProfile(updates) {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error('No authenticated user');

  const userRef = doc(db, 'users', firebaseUser.uid);
  // Prevent client from directly changing security-restricted fields
  const { phone_verified, whatsapp_opt_in, ...safeUpdates } = updates;

  const payload = {
    ...safeUpdates,
    updated_at: new Date().toISOString(),
  };

  await setDoc(userRef, payload, { merge: true });
  const updatedSnap = await getDoc(userRef);
  return { id: firebaseUser.uid, uid: firebaseUser.uid, ...updatedSnap.data() };
}
