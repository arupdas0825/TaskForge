'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { updateProfile } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setNotifications(user.notifications_enabled !== false);
      setEmailNotifications(Boolean(user.email_notifications));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        notifications_enabled: notifications,
        email_notifications: emailNotifications,
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (user) {
      updateProfile({ theme: newTheme }).then((updated) => setUser(updated));
    }
    toast.success(`Theme updated to ${newTheme}`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your local profile preferences</p>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your local profile details saved on this browser</CardDescription>
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
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Local profile email identifier</p>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
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

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage local notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">In-App Toast Notifications</label>
              <p className="text-xs text-muted-foreground mt-0.5">Show success/error toast alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => {
                setNotifications(e.target.checked);
                updateProfile({ notifications_enabled: e.target.checked }).then((updated) => setUser(updated));
              }}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Email Summary Preference</label>
              <p className="text-xs text-muted-foreground mt-0.5">Saved locally for user preferences</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked);
                updateProfile({ email_notifications: e.target.checked }).then((updated) => setUser(updated));
              }}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
