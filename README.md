# TaskForge AI

A premium, AI-powered productivity platform built with Next.js 15, React 19, TypeScript, and Supabase.

## Features

- 🎯 **Smart Task Management** - Create, organize, and prioritize tasks with AI assistance
- 📅 **Calendar Integration** - Drag-and-drop task scheduling with Google Calendar sync
- 🤖 **AI-Powered** - Natural language task creation, smart suggestions, and insights
- 🎨 **Premium UI** - Apple-inspired design with smooth animations and dark mode
- 🔐 **Secure** - End-to-end encryption, Row Level Security, and SOC 2 compliance
- 📊 **Analytics** - Comprehensive productivity metrics and insights
- 👥 **Collaboration** - Workspaces, task assignment, and team communication
- ⚡ **Performance** - Optimized for speed with 60fps animations
- 📱 **Mobile** - Native app experience on all devices
- 🌐 **Offline** - PWA support with offline functionality

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest UI library
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **Framer Motion** - Smooth animations
- **TanStack Query** - Server state management
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Backend
- **Supabase** - BaaS platform
- **PostgreSQL** - Relational database
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless backend
- **Supabase Auth** - Authentication

### Optional Integrations
- **OpenAI API** - AI features
- **Google Calendar API** - Calendar sync
- **Stripe** - Payments
- **SendGrid** - Email notifications

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- OpenAI API key (for AI features)
- Google OAuth credentials (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/arupdas0825/TaskForge-sh.git
cd TaskForge-sh
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase and API keys
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   ├── tasks/             # Task management
│   ├── calendar/          # Calendar views
│   └── auth/              # Authentication
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── services/              # API services
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

## Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Tests
npm run test
npm run test:watch
npm run test:coverage
```

## Database

```bash
# Push schema to Supabase
npm run db:push

# Pull latest schema
npm run db:pull

# Reset database
npm run db:reset
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t taskforge-ai .
docker run -p 3000:3000 taskforge-ai
```

## Security

- Row Level Security (RLS) for data isolation
- Input validation with Zod
- CSRF protection
- XSS prevention
- Secure headers
- Rate limiting
- Audit logs

## Performance

- Code splitting
- Image optimization
- Server components
- Lazy loading
- Caching strategies
- 60fps animations
- Virtual scrolling for lists

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- ARIA labels

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

MIT - See LICENSE file for details

## Support

For support, email support@taskforge.ai or open an issue on GitHub.

## Roadmap

- [ ] Team collaboration features
- [ ] Advanced AI insights
- [ ] Mobile apps (iOS/Android)
- [ ] Zapier integration
- [ ] Custom workflows
- [ ] Enterprise features

---

**Built with ❤️ by Arup Das**
