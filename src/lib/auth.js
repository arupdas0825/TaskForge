import { getAll, getById, putItem } from './db/index';
import { seedInitialData, DEFAULT_USER_ID, DEFAULT_PROFILE } from './db/seed';

const SESSION_KEY = 'taskforge_session';

export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  await seedInitialData();

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  try {
    const profile = await getById('profiles', session);
    if (profile) return profile;

    // Fallback to default profile if session matches default user id
    if (session === DEFAULT_USER_ID) {
      await putItem('profiles', DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }

    const allProfiles = await getAll('profiles');
    if (allProfiles.length > 0) {
      return allProfiles[0];
    }
  } catch (err) {
    console.error('Error fetching current user profile:', err);
  }

  return null;
}

export async function signUp(email, password, name) {
  await seedInitialData();

  const id = crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`;
  const newProfile = {
    id,
    email,
    name: name || email.split('@')[0],
    avatar_url: '',
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, id);
  }

  return { user: newProfile };
}

export async function signIn(email, password) {
  await seedInitialData();

  const profiles = await getAll('profiles');
  let profile = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

  if (!profile) {
    // If logging in for the first time, auto-create local profile for smooth UX
    profile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatar_url: '',
      timezone: 'UTC',
      theme: 'dark',
      language: 'en',
      notifications_enabled: true,
      email_notifications: false,
      push_notifications: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await putItem('profiles', profile);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, profile.id);
  }

  return { user: profile };
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

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
