'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  attribute,
  defaultTheme,
  enableSystem,
}) {
  return (
    <NextThemesProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
      {children}
    </NextThemesProvider>
  );
}
