'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { ensureProfileForFirebaseUser } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const { user, isLoading, setUser, setIsLoading } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const profile = await ensureProfileForFirebaseUser(firebaseUser);
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Error in onAuthStateChanged:', err);
          setError(err instanceof Error ? err : new Error('Auth state change failed'));
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Auth state listener error:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  return { user, isLoading, error };
}
