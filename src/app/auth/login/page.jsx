/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { user } = await signInWithEmail({ email, password });
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Email Login Error:', err);
      setError(mapAuthError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const { user } = await signInWithGoogle();
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      // Soft handle user popup cancellation without showing error banner
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setError(mapAuthError(err.code || err.message));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#121212] relative overflow-hidden w-full">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-white/10 to-[#121212] backdrop-blur-md border border-white/10 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mx-auto mb-2 border border-white/20">
            <img src="/logo.png" alt="TaskForge" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your TaskForge workspace</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" className="w-full rounded-xl py-2.5" disabled={isSubmitting || isGoogleLoading}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="h-px flex-1 bg-white/10" />
          <span>OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-b from-[#232526] to-[#2d2e30] hover:from-[#2d2e30] hover:to-[#36383a] rounded-full px-5 py-3 font-medium text-white shadow-lg transition text-sm border border-white/15 cursor-pointer disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <p className="text-center text-xs text-gray-400">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="text-white underline hover:text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

function mapAuthError(code) {
  const map = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts — try again in a bit.',
    'auth/email-already-in-use': 'An account already exists with that email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
