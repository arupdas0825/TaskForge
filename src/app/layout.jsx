import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'TaskForge - Intelligent Local Task Management',
  description: 'Self-contained, fast client-side task management platform',
};

export default function RootLayout({ children }) {
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
