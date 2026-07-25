'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent', 'accepted');
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl text-foreground">
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        We use only essential browser storage (sign-in session, theme). No tracking cookies. Read our{' '}
        <Link href="/cookies" className="text-primary underline">
          Cookie Policy
        </Link>
        .
      </p>
      <Button size="sm" onClick={accept} className="w-full text-xs font-medium">
        Got it
      </Button>
    </div>
  );
}
