'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { updateProfile, setGoogleAccessToken } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { httpsCallable } from 'firebase/functions';
import { functions, auth, googleProvider } from '@/lib/firebase/config';
import { linkWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false);

  // Phone Verification States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setEmailReminders(user.email_reminders_enabled !== false);
      if (user.phone_number) {
        setPhoneNumber(user.phone_number);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        email_reminders_enabled: emailReminders,
        theme: theme || 'dark',
      });
      setUser(updated);
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(`Failed to update settings: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    setIsConnectingCalendar(true);
    try {
      if (!auth.currentUser) {
        toast.error('You must be signed in to connect Google Calendar');
        return;
      }
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }
      const updated = await updateProfile({ calendar_connected: true });
      setUser(updated);
      toast.success('Google Calendar & Tasks connected successfully!');
    } catch (err) {
      console.error('Google Calendar Connect Error:', err);
      if (err.code === 'auth/credential-already-in-use') {
        toast.error('This Google account is already linked to another user.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(err.message || 'Failed to connect Google Calendar.');
      }
    } finally {
      setIsConnectingCalendar(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      toast.error('Please enter a valid phone number in E.164 format (e.g. +8801700000000)');
      return;
    }

    setIsSendingOtp(true);
    try {
      const sendOtpFn = httpsCallable(functions, 'sendPhoneOtp');
      await sendOtpFn({ phone: phoneNumber });
      setOtpSent(true);
      toast.success(`Verification code sent to ${phoneNumber}`);
    } catch (err) {
      console.error('Send OTP Error:', err);
      toast.error(err.message || 'Failed to send OTP code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyOtpFn = httpsCallable(functions, 'verifyPhoneOtp');
      await verifyOtpFn({ phone: phoneNumber, code: otpCode.trim() });
      toast.success('Phone number verified successfully! WhatsApp reminders activated.');
      setOtpSent(false);
      setOtpCode('');
      const updated = await updateProfile({});
      setUser(updated);
    } catch (err) {
      console.error('Verify OTP Error:', err);
      toast.error(err.message || 'Verification failed. Incorrect or expired code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (user) {
      updateProfile({ theme: newTheme }).then((updated) => setUser(updated));
    }
    toast.success(`Theme updated to ${newTheme}`);
  };

  const getWhatsappStatus = () => {
    if (!user?.phone_verified) {
      return { text: 'Not verified', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    }
    if (user?.whatsapp_opt_in) {
      return { text: 'Active (Receiving Reminders)', color: 'text-green-400 bg-green-500/10 border-green-500/20' };
    }
    return { text: 'Opted out (Text STOP was received)', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const whatsappStatus = getWhatsappStatus();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and automated reminder integrations</p>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your account profile information saved securely in Firestore</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Google Calendar & Tasks Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar & Tasks Sync</CardTitle>
          <CardDescription>Connect your Google account to automatically push scheduled tasks to Google Calendar and Google Tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.calendar_connected
                  ? 'Connected — task due dates auto-sync with Google Calendar & Tasks'
                  : 'Not connected — click button to grant permission'}
              </p>
            </div>
            {user?.calendar_connected ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                Connected ✅
              </span>
            ) : (
              <Button type="button" onClick={handleConnectGoogleCalendar} disabled={isConnectingCalendar}>
                {isConnectingCalendar ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Reminders & Phone OTP Section */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Reminders & Verification</CardTitle>
          <CardDescription>Verify your phone number via Twilio OTP to receive real-time task due reminders on WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border text-xs font-medium bg-muted/30">
            <span>WhatsApp Reminders Status:</span>
            <span className={`px-2.5 py-1 rounded-full border ${whatsappStatus.color}`}>
              {whatsappStatus.text}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number (E.164 Format)</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+14155552671"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="button" onClick={handleSendOtp} disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending Code...' : otpSent ? 'Resend Code' : 'Send Code'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must include country code (e.g. +1, +44, +880). Reply <strong>STOP</strong> to any WhatsApp message to opt out anytime.
            </p>
          </div>

          {otpSent && (
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-sm font-medium">Enter 6-Digit OTP Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-40 px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary tracking-widest text-center"
                />
                <Button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} variant="default">
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Reminders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Email Reminders</CardTitle>
          <CardDescription>Configure task due notification delivery to your account email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Send Task Due Email Reminders</label>
              <p className="text-xs text-muted-foreground mt-0.5">Receive automated email alerts 15 minutes before tasks are due</p>
            </div>
            <input
              type="checkbox"
              checked={emailReminders}
              onChange={(e) => {
                const checked = e.target.checked;
                setEmailReminders(checked);
                updateProfile({ email_reminders_enabled: checked }).then((updated) => setUser(updated));
                toast.success(`Email reminders ${checked ? 'enabled' : 'disabled'}`);
              }}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how TaskForge looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Theme Mode</label>
            <div className="flex gap-2 mt-2">
              {['light', 'dark', 'system'].map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
