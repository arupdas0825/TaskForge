/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { auth, functions } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { ensureProfileForFirebaseUser } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';

export default function AuthPage() {
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sendEmailOtp = httpsCallable(functions, 'sendEmailOtp');
      await sendEmailOtp({ fullName: fullName.trim(), email: cleanEmail });
      setStep('verify');
    } catch (err) {
      console.error('Send OTP Error:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (code.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyEmailOtp = httpsCallable(functions, 'verifyEmailOtp');
      const result = await verifyEmailOtp({
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      const cred = await signInWithCustomToken(auth, result.data.token);
      const profile = await ensureProfileForFirebaseUser(cred.user, {
        name: fullName.trim() || undefined,
      });

      setUser(profile);
      router.push('/dashboard');
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setError(err.message || 'Incorrect or expired code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#121212] relative overflow-hidden w-full">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-white/10 to-[#121212] backdrop-blur-md border border-white/10 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mx-auto mb-2 border border-white/20">
            <img src="/logo.png" alt="TaskForge" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {step === 'request' ? 'Sign in to TaskForge' : 'Enter your code'}
          </h1>
          <p className="text-xs text-gray-400">
            {step === 'request'
              ? "No password needed — we'll email you a one-time sign-in code."
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleSendCode} className="space-y-3">
            <input
              type="text"
              placeholder="Full name (optional)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="w-full rounded-xl py-2.5" disabled={isSubmitting}>
              {isSubmitting ? 'Sending code...' : 'Send code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-3">
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-white placeholder-gray-400 text-lg tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="w-full rounded-xl py-2.5" disabled={isSubmitting || code.length !== 6}>
              {isSubmitting ? 'Verifying...' : 'Verify & continue'}
            </Button>
            <button
              type="button"
              className="w-full text-xs text-gray-400 hover:text-white transition pt-1"
              onClick={() => {
                setStep('request');
                setCode('');
                setError('');
              }}
            >
              Use a different email address
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-gray-400">
          By continuing you agree to our{' '}
          <a href="/privacy" className="text-white underline hover:text-primary">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/cookies" className="text-white underline hover:text-primary">
            Cookie Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
