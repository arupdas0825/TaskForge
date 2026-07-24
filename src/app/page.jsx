'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );
}
