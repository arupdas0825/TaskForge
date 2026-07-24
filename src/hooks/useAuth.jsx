'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getCurrentUser } from '@/lib/auth';

export function useAuth() {
  const { user, isLoading, setUser, setIsLoading } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Auth initialization failed'));
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser, setIsLoading]);

  return { user, isLoading, error };
}
