import { defaultCache } from '@serwist/next/worker';
import { Serwist } from 'serwist';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Firestore/Auth calls: always try the network first, don't serve stale data
    {
      matcher: ({ url }) =>
        url.hostname.includes('firestore.googleapis.com') ||
        url.hostname.includes('identitytoolkit.googleapis.com'),
      handler: 'NetworkOnly',
    },
    // Everything else (app shell, static assets): use Serwist's sensible defaults
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      { url: '/offline', matcher: ({ request }) => request.destination === 'document' },
    ],
  },
});

serwist.addEventListeners();
