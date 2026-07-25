'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (user) {
          router.replace('/dashboard');
        } else {
          router.replace('/auth');
        }
      } catch (e) {
        router.replace('/auth');
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4 space-y-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="TaskForge Logo" className="w-20 h-20 object-contain rounded-2xl shadow-lg animate-pulse" />
      <h1 className="text-xl font-bold tracking-tight">TaskForge</h1>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  );
}
