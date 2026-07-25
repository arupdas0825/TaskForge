'use client';

import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { auth, functions } from '@/lib/firebase/config';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { ensureProfileForFirebaseUser } from '@/lib/auth';

export function GuestVerifyModal({ open, onClose, onVerified }) {
  const [step, setStep] = useState('contact'); // 'contact' | 'codes'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuthStore();

  const sendBothCodes = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!cleanPhone || !cleanPhone.startsWith('+')) {
      setError('Please enter a valid phone number in E.164 format (e.g. +8801700000000)');
      return;
    }

    setIsSubmitting(true);
    try {
      const sendEmailOtpFn = httpsCallable(functions, 'sendEmailOtp');
      const sendPhoneOtpFn = httpsCallable(functions, 'sendPhoneOtp');

      await Promise.all([
        sendEmailOtpFn({ email: cleanEmail }),
        sendPhoneOtpFn({ phone: cleanPhone }),
      ]);

      setStep('codes');
    } catch (err) {
      console.error('Send Verification Codes Error:', err);
      setError(err.message || 'Failed to send verification codes. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyBoth = async (e) => {
    e.preventDefault();
    setError('');

    if (emailCode.trim().length !== 6 || phoneCode.trim().length !== 6) {
      setError('Please enter both 6-digit verification codes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const completeGuestVerificationFn = httpsCallable(functions, 'completeGuestVerification');
      const result = await completeGuestVerificationFn({
        email: email.trim().toLowerCase(),
        emailCode: emailCode.trim(),
        phone: phone.trim(),
        phoneCode: phoneCode.trim(),
      });

      const cred = await signInWithCustomToken(auth, result.data.token);
      const profile = await ensureProfileForFirebaseUser(cred.user);
      setUser(profile);

      onVerified?.();
      onClose();
    } catch (err) {
      console.error('Verify Both Error:', err);
      setError(err.message || 'Verification failed. Please verify your codes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Verify to save your tasks</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Guest tasks are temporary. Verify your email and phone number to upgrade to a permanent account and save your work.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {step === 'contact' ? (
          <form onSubmit={sendBothCodes} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Phone Number (E.164 Format)</label>
              <input
                type="tel"
                required
                placeholder="+14155552671"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl py-2.5 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Sending verification codes...' : 'Send verification codes'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyBoth} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">6-Digit Email Code</label>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-center tracking-[0.5em] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">6-Digit WhatsApp / SMS Code</label>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-center tracking-[0.5em] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl py-2.5 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying & upgrading...' : 'Verify & save my tasks'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
