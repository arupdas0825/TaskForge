import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import { getById, putItem, getAll } from './db/index';

export async function ensureProfileForFirebaseUser(firebaseUser) {
  if (!firebaseUser) return null;

  try {
    const existing = await getById('profiles', firebaseUser.uid);
    if (existing) {
      // Update name/avatar if updated from Google
      const updated = {
        ...existing,
        name: firebaseUser.displayName || existing.name || firebaseUser.email?.split('@')[0] || 'User',
        avatar_url: firebaseUser.photoURL || existing.avatar_url || '',
        updated_at: new Date().toISOString(),
      };
      await putItem('profiles', updated);
      return updated;
    }

    const newProfile = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      avatar_url: firebaseUser.photoURL || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      theme: 'dark',
      language: 'en',
      notifications_enabled: true,
      email_notifications: false,
      push_notifications: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await putItem('profiles', newProfile);
    return newProfile;
  } catch (err) {
    console.error('Error ensuring profile for user:', err);
    return {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'User',
      avatar_url: firebaseUser.photoURL || '',
    };
  }
}

export async function getCurrentUser() {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  return ensureProfileForFirebaseUser(firebaseUser);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const profile = await ensureProfileForFirebaseUser(result.user);
  return { user: profile, firebaseUser: result.user };
}

export async function signOutUser() {
  await firebaseSignOut(auth);
}

export const signOut = signOutUser;

export async function updateProfile(updates) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No authenticated user');

  const updatedProfile = {
    ...currentUser,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await putItem('profiles', updatedProfile);
  return updatedProfile;
}
