/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignIn = (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Perform Google Sign in fallback or demo sign in
    handleGoogleSignIn();
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full p-4">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-white/10 to-[#121212] backdrop-blur-md border border-white/10 shadow-2xl p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4 shadow-lg overflow-hidden border border-white/20">
          <img
            src="/logo.png"
            alt="TaskForge Logo"
            className="w-10 h-10 object-contain"
            style={{ width: '40px', height: '40px' }}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center tracking-tight">
          TaskForge
        </h2>

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <form onSubmit={handleSignIn} className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-white/10"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-white/10"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-400 text-left px-1">{error}</div>
            )}
          </form>

          <hr className="border-white/10 my-1" />

          <div>
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm border border-white/15 cursor-pointer"
            >
              Sign in
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm border border-white/10 cursor-pointer"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 flex-shrink-0"
                style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
              />
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            <div className="w-full text-center mt-3">
              <span className="text-xs text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="underline text-white/80 hover:text-white bg-transparent border-0 cursor-pointer"
                >
                  Sign up, it&apos;s free!
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User count and avatars */}
      <div className="relative z-10 mt-10 flex flex-col items-center text-center">
        <p className="text-gray-400 text-sm mb-3">
          Join <span className="font-medium text-white">thousands</span> of developers who are already using TaskForge.
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover"
            style={{ width: '32px', height: '32px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover"
            style={{ width: '32px', height: '32px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover"
            style={{ width: '32px', height: '32px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover"
            style={{ width: '32px', height: '32px' }}
          />
        </div>
      </div>
    </div>
  );
}
