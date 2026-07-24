'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-muted-foreground mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <p className="text-muted-foreground mt-1">{user?.timezone || 'UTC'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how TaskForge looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2 mt-2">
              {['light', 'dark', 'system'].map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(t)}
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
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Push Notifications</label>
              <p className="text-xs text-muted-foreground mt-1">Get notified on your device</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Email Notifications</label>
              <p className="text-xs text-muted-foreground mt-1">Get notified via email</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
