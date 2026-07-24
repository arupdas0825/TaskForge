import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskForge AI - Premium Productivity Platform',
  description: 'AI-powered task management, scheduling, and productivity platform',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taskforge.ai',
    title: 'TaskForge AI',
    description: 'Premium AI-powered productivity platform',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TaskForge" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
