/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Download,
  Share,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { isInstallable, isIOS, promptInstall } = useInstallPrompt();

  const handleLogout = async () => {
    await signOut();
    logout();
    router.push('/auth');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-muted bg-card border border-border"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-screen border-r border-border bg-card flex-col sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logo.png" alt="TaskForge Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
            <span className="font-bold text-lg tracking-tight">TaskForge</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* PWA Install Button for Chrome/Android/Desktop */}
          {isInstallable && (
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={promptInstall}
                className="w-full justify-start gap-2 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold"
              >
                <Download size={16} />
                <span>Install App</span>
              </Button>
            </div>
          )}

          {/* PWA iOS Safari Instruction Banner */}
          {isIOS && (
            <div className="pt-2 p-3 rounded-lg border border-border bg-muted/40 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Share size={14} className="text-primary" />
                <span>Install on iOS</span>
              </div>
              <p>Tap <strong className="text-foreground">Share</strong> in Safari → <strong className="text-foreground">Add to Home Screen</strong>.</p>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-64 max-w-xs bg-card h-full flex flex-col z-50 p-4 border-r border-border">
            <div className="p-4 border-b border-border mb-4">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <img src="/logo.png" alt="TaskForge Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
                <span className="font-bold text-lg tracking-tight">TaskForge</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isInstallable && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      promptInstall();
                      setIsOpen(false);
                    }}
                    className="w-full justify-start gap-2 border-primary/40 bg-primary/10 text-primary text-xs font-semibold"
                  >
                    <Download size={16} />
                    <span>Install App</span>
                  </Button>
                </div>
              )}

              {isIOS && (
                <div className="pt-2 p-3 rounded-lg border border-border bg-muted/40 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Share size={14} className="text-primary" />
                    <span>Install on iOS</span>
                  </div>
                  <p>Tap <strong className="text-foreground">Share</strong> in Safari → <strong className="text-foreground">Add to Home Screen</strong>.</p>
                </div>
              )}
            </nav>
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
