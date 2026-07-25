export default function manifest() {
  return {
    name: 'TaskForge',
    short_name: 'TaskForge',
    description: 'Task management with Google sign-in, email & WhatsApp reminders.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0b0b0f',
    theme_color: '#0b0b0f',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
