'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {!isOnline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs font-medium text-amber-400 flex items-center justify-center gap-2">
            <WifiOff size={14} />
            <span>You&apos;re offline — changes won&apos;t sync until you&apos;re back online</span>
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
