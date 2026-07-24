'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { user } = await signInWithGoogle();
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/90 to-muted p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TaskForge Logo" className="w-16 h-16 object-contain rounded-xl shadow-md" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to TaskForge</CardTitle>
          <CardDescription>
            Sign in with your Google account to access your local task management workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-12 flex items-center justify-center gap-3 border-border hover:bg-muted font-medium transition-all"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Signing in with Google...' : 'Sign in with Google'}</span>
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-4">
            Identity authentication is managed securely via Firebase. All task data remains stored locally.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
