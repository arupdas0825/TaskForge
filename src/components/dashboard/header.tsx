'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Search, Bell } from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:block relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <div className="flex items-center gap-2">
            {user?.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
