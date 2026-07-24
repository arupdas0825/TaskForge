# TaskForge AI - Development Guide

This comprehensive guide covers the architecture, setup, and development practices for TaskForge AI.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/arupdas0825/TaskForge-sh.git
cd TaskForge-sh

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Fill in your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture Overview

### Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── tasks/              # Task management
│   │   ├── calendar/           # Calendar view
│   │   ├── analytics/          # Analytics & insights
│   │   └── settings/           # User settings
│   └── globals.css             # Global styles
│
├── components/
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── task-quick-add.tsx
│   │   └── progress-bar.tsx
│   ├── tasks/                   # Task management components
│   │   ├── task-list.tsx
│   │   ├── task-item.tsx
│   │   ├── task-filters.tsx
│   │   └── ...
│   ├── analytics/               # Analytics components
│   │   └── analytics-dashboard.tsx
│   ├── navigation/              # Navigation components
│   │   └── sidebar-navigation.tsx
│   └── theme-provider.tsx       # Theme management
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useTasks.ts             # Tasks management hook
│   └── useAnalytics.ts         # Analytics hook
│
├── lib/
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Client-side Supabase
│   │   └── server.ts           # Server-side Supabase
│   ├── auth.ts                 # Authentication utilities
│   ├── cn.ts                   # Class name utility
│   ├── constants.ts            # App constants
│   ├── query-client.ts         # TanStack Query setup
│   └── ...
│
├── services/                     # API service layer
│   ├── tasks.ts                # Task operations
│   ├── projects.ts             # Project operations
│   ├── labels.ts               # Label operations
│   └── analytics.ts            # Analytics queries
│
├── stores/                       # Zustand state management
│   ├── auth-store.ts           # Authentication state
│   └── task-store.ts           # Task state
│
├── types/                        # TypeScript type definitions
│   └── index.ts                # All type definitions
│
└── utils/                        # Utility functions
    └── ...

supabase/
└── migrations/
    └── 001_initial_schema.sql   # Database schema
```

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router for file-based routing
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **Framer Motion** - Smooth animations
- **TanStack Query (React Query)** - Server state management with caching
- **Zustand** - Lightweight client state management
- **React Hook Form** - Efficient form management
- **Zod** - Runtime schema validation
- **Recharts** - Data visualization and charts

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL database
  - Row Level Security (RLS) for data isolation
  - Authentication (Email, OAuth)
  - Real-time subscriptions
  - Edge Functions for serverless backend

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## Key Features

### 1. Authentication System

**Location**: `src/lib/auth.ts`, `src/app/auth/`

- Email/password signup and login
- Google OAuth integration
- Email verification
- Password reset functionality
- Protected routes with `useAuth()` hook

**Usage**:
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isLoading } = useAuth();
  return <div>{user?.name}</div>;
}
```

### 2. Task Management

**Location**: `src/services/tasks.ts`, `src/hooks/useTasks.ts`

Core operations:
- Create, read, update, delete tasks
- Task filtering by status and priority
- Task duplication and archiving
- Subtask management
- Task dependencies

**Usage**:
```typescript
import { useTasks } from '@/hooks/useTasks';

function TaskManager() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  return <div>{/* render tasks */}</div>;
}
```

### 3. Analytics System

**Location**: `src/services/analytics.ts`, `src/hooks/useAnalytics.ts`

Provides:
- Productivity statistics (completion rates, streaks, focus time)
- Task metrics (total, completed, overdue)
- Completion trends over time
- Category and project analysis
- Charts and visualizations

**Usage**:
```typescript
import { useProductivityStats, useTaskMetrics } from '@/hooks/useAnalytics';

function Analytics() {
  const { data: stats } = useProductivityStats();
  const { data: metrics } = useTaskMetrics();
  return <div>{/* render analytics */}</div>;
}
```

### 4. Dashboard

**Location**: `src/app/dashboard/`

Features:
- At-a-glance task overview
- Quick task creation
- Today's tasks list
- Progress metrics
- Navigation to all major features

### 5. Database Schema

**Location**: `supabase/migrations/001_initial_schema.sql`

Tables:
- `profiles` - User profiles with settings
- `projects` - Task projects/categories
- `tasks` - Main task table with all fields
- `subtasks` - Nested tasks
- `labels` - Task labels/tags
- `attachments` - File attachments
- `comments` - Task comments
- `notifications` - User notifications
- `workspaces` - Collaboration workspaces
- `workspace_members` - Workspace membership
- `task_dependencies` - Task relationships

All tables have:
- Row Level Security (RLS) for data protection
- Proper indexes for performance
- Timestamps for audit trails

## State Management

### Zustand Stores

**Auth Store** (`src/stores/auth-store.ts`):
```typescript
const { user, isLoading, setUser, logout } = useAuthStore();
```

**Task Store** (`src/stores/task-store.ts`):
```typescript
const { tasks, filters, selectedTask, setTasks, setFilters } = useTaskStore();
```

### Server State (TanStack Query)

Used for API calls with automatic caching and refetching:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: getTasks,
});
```

## Styling

### Design System

**Color Scheme**:
- Primary: Blue (#3B82F6)
- Secondary: Dark blue (#1E3A5F)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)

**Typography**:
- Font family: System UI (Apple San Francisco, Segoe UI, etc.)
- Base font size: 16px
- Line height: 1.5

**Spacing Scale**:
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
```

**Component Styling**:
Use Tailwind classes directly or compose with `cn()` utility:
```typescript
import { cn } from '@/lib/cn';

function MyComponent() {
  return (
    <div className={cn(
      'p-4 rounded-lg border',
      'hover:bg-accent transition-colors'
    )}>
      Content
    </div>
  );
}
```

## API Integration

### Supabase Client Usage

**Client-side**:
```typescript
import { supabase } from '@/lib/supabase/client';

const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'todo');
```

**Server-side**:
```typescript
import { getServerClient } from '@/lib/supabase/server';

const supabase = await getServerClient();
const { data } = await supabase.from('tasks').select('*');
```

### Service Layer

All API operations are abstracted in `src/services/`:
```typescript
// In components/hooks, use services instead of direct API calls
import { getTasks, createTask, updateTask } from '@/services/tasks';

const task = await createTask({
  title: 'New task',
  priority: 'high',
  // ...
});
```

## Authentication Flow

1. **Signup**: User creates account → Email verification → Auto redirect to dashboard
2. **Login**: User enters credentials → Session created → Dashboard access
3. **OAuth**: Click "Sign in with Google" → Google auth → Session created
4. **Protected Routes**: `useAuth()` hook redirects unauthenticated users to login
5. **Logout**: Clear session → Clear Zustand store → Redirect to login

## Component Patterns

### Server Components (Default)
```typescript
// src/app/dashboard/page.tsx
export default function Page() {
  return <div>Server component content</div>;
}
```

### Client Components
```typescript
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [state, setState] = useState();
  return <div>{state}</div>;
}
```

### Layout Components
```typescript
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Best Practices

### TypeScript
- Always type function parameters and returns
- Use interfaces for complex objects
- Import types from `@/types`

### Components
- Keep components small and focused
- Extract complex logic into custom hooks
- Use composition over inheritance
- Add loading and error states

### Performance
- Use `React.memo()` for expensive components
- Lazy load routes with dynamic imports
- Optimize images with Next.js Image component
- Use virtual scrolling for long lists

### Data Fetching
- Use TanStack Query for all remote data
- Implement proper error handling
- Show loading states
- Use optimistic updates when appropriate

### Forms
- Use React Hook Form for complex forms
- Validate with Zod schemas
- Provide clear error messages
- Show loading state during submission

## Testing

### Setup
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Docker

```bash
# Build image
docker build -t taskforge-ai .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  taskforge-ai
```

## Environment Variables

### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Optional
```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# AI (OpenAI)
NEXT_PUBLIC_OPENAI_API_KEY=xxx
```

## Common Tasks

### Add a New Page

1. Create directory under `src/app`
2. Create `page.tsx`
3. Add layout if needed
4. Add navigation link

### Add a New Component

1. Create file in appropriate directory under `src/components`
2. Export from index file if in a subdirectory
3. Use in other components

### Add a New API Endpoint

1. Create service function in `src/services`
2. Create custom hook in `src/hooks` if needed
3. Use in components with proper error handling

### Query the Database

```typescript
// src/services/example.ts
import { supabase } from '@/lib/supabase/client';

export async function getExamples() {
  const { data, error } = await supabase
    .from('examples')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}
```

## Troubleshooting

### Authentication Issues
- Check Supabase credentials in `.env.local`
- Verify redirect URL in Supabase settings
- Clear browser cookies/session storage

### Database Errors
- Check Row Level Security policies
- Verify user is authenticated
- Check table name and column spelling

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

## Support

For issues or questions:
1. Check existing documentation
2. Search GitHub issues
3. Create new issue with details
4. Email support@taskforge.ai

## License

MIT - See LICENSE file

---

**Last updated**: July 24, 2024
**Maintained by**: TaskForge Team
