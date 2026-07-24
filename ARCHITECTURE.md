# Architecture & Technical Decisions

## Overview

TaskForge AI is built as a modern, scalable SaaS application using Next.js 15 and Supabase, with a focus on performance, security, and user experience.

## Key Architectural Decisions

### 1. Next.js App Router

**Decision**: Use App Router instead of Pages Router

**Rationale**:
- Built-in support for Server Components
- Better code organization with directory-based routing
- Native streaming support for real-time updates
- Improved performance with automatic code splitting

### 2. Supabase as Backend

**Decision**: Use Supabase instead of custom backend

**Rationale**:
- PostgreSQL database with proven reliability
- Built-in authentication with multiple providers
- Row Level Security for data isolation
- Real-time subscriptions without additional infrastructure
- Edge Functions for serverless backend logic
- Cost-effective for MVP and scaling

### 3. TypeScript Everything

**Decision**: Full TypeScript coverage

**Rationale**:
- Type safety catches bugs at compile time
- Better IDE support and autocomplete
- Easier refactoring
- Self-documenting code
- Reduced runtime errors

### 4. State Management Strategy

**Decision**: Hybrid approach with Zustand + TanStack Query

**Rationale**:
- **TanStack Query**: Server state (API data, caching, synchronization)
- **Zustand**: Client state (UI state, filters, selections)
- **React Context**: Theme and app-level configuration

This separation keeps concerns clear and performance optimal.

### 5. Component Library

**Decision**: shadcn/ui with Tailwind CSS

**Rationale**:
- Accessible components (Radix UI foundation)
- Fully customizable with Tailwind
- No vendor lock-in (copy-paste model)
- Consistent design system
- Community-driven improvements

### 6. Database Security

**Decision**: Row Level Security (RLS) for all tables

**Rationale**:
- Data isolation at database level
- No need for application-level authorization checks
- Prevents data leaks from programming errors
- Complies with data protection regulations

### 7. API Layer

**Decision**: Service functions abstraction layer

**Rationale**:
- Separation of concerns (components don't know about API)
- Easy to mock for testing
- Centralized error handling
- Query logic reuse across components

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React Components & Pages               │  │
│  │  (Authentication, Dashboard, Tasks, Calendar)   │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management Layer                   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │  Zustand (Client State)                  │   │  │
│  │  │  - Auth state                            │   │  │
│  │  │  - UI filters                            │   │  │
│  │  │  - Selected items                        │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │  TanStack Query (Server State)           │   │  │
│  │  │  - Task data caching                     │   │  │
│  │  │  - Background sync                       │   │  │
│  │  │  - Optimistic updates                    │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Service Layer                        │  │
│  │  - tasks.ts                                      │  │
│  │  - projects.ts                                   │  │
│  │  - analytics.ts                                  │  │
│  │  - labels.ts                                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│               SUPABASE (Backend-as-a-Service)           │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Authentication                        │  │
│  │  - Email/Password                               │  │
│  │  - OAuth Providers                              │  │
│  │  - Session Management                           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                      │  │
│  │  - Profiles, Projects, Tasks, etc.              │  │
│  │  - Row Level Security enabled                   │  │
│  │  - Real-time subscriptions                      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Storage (Files)                       │  │
│  │  - Task attachments                              │  │
│  │  - User avatars                                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Edge Functions (Optional)                │  │
│  │  - Complex business logic                        │  │
│  │  - Scheduled jobs                                │  │
│  │  - Email notifications                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Reading Data (Query)

```
1. Component renders → TanStack Query useQuery()
2. Cache hit? Return cached data
3. Cache miss? → Service function
4. Service → Supabase API
5. Supabase → RLS check → Database query
6. Return data → Cache → Component
```

### Writing Data (Mutation)

```
1. User action → Form submission
2. React Hook Form validation
3. Optimistic update in local state
4. Service function called
5. Supabase API → RLS check → Database write
6. On success → Invalidate cache → Refetch
7. On error → Revert optimistic update
```

## Security Architecture

### Authentication

```
┌────────────────────────────────────────┐
│     1. User Credentials                │
└──────────────┬───────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  2. Supabase Auth Service              │
│     - Hash password (bcrypt)           │
│     - Generate JWT token               │
│     - Store session                    │
└──────────────┬───────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  3. JWT in HttpOnly Cookie             │
│     - Secure transport only            │
│     - No JavaScript access             │
│     - Auto-refreshed                   │
└──────────────┬───────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  4. Protected Routes                   │
│     - useAuth() check in middleware    │
│     - Redirect if not authenticated    │
└────────────────────────────────────────┘
```

### Database Security

```
Row Level Security (RLS) Policies:

1. Profiles Table
   - SELECT: User can only view their own profile
   - UPDATE: User can only update their own profile
   - DELETE: Cascade on auth.users delete

2. Tasks Table
   - SELECT: User can only view tasks they created
   - INSERT: user_id must match authenticated user
   - UPDATE: User can only update their own tasks
   - DELETE: User can only delete their own tasks

3. Comments Table
   - User can read comments on their own tasks
   - User can only insert/update/delete their own comments

4. Shared Resources
   - Workspace members can access workspace tasks
   - Permission checks via workspace role
```

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - Automatic per-route in Next.js
   - Dynamic imports for heavy components

2. **Image Optimization**
   - Next.js Image component
   - AVIF and WebP formats
   - Responsive sizing

3. **Caching Strategy**
   - Browser cache for static assets
   - TanStack Query cache for API data
   - Stale-while-revalidate pattern

4. **Runtime Performance**
   - React.memo() for expensive components
   - useCallback for event handlers
   - Virtual scrolling for long lists

### Backend Optimization

1. **Database Indexes**
   - User ID indexes for RLS performance
   - Status/priority indexes for filtering
   - Date indexes for sorting

2. **Query Optimization**
   - Select only needed columns
   - Use pagination for large datasets
   - Denormalize when needed

3. **Real-time Updates**
   - Supabase real-time subscriptions
   - Automatic cache invalidation
   - Conflict resolution

## Scalability Considerations

### User Growth

1. **Database**
   - PostgreSQL handles millions of records
   - Proper indexing essential
   - Consider archiving old data

2. **API Requests**
   - TanStack Query reduces redundant requests
   - Rate limiting in Supabase
   - Consider caching layer (Redis) for high traffic

3. **Storage**
   - Supabase Storage for files
   - CDN distribution
   - Cleanup old attachments

### Feature Growth

1. **Modular Architecture**
   - Features in separate components
   - Services layer allows easy swapping
   - Type system prevents breaking changes

2. **Plugin System**
   - Easy to add integrations
   - Calendar, Slack, GitHub, etc.
   - Edge Functions for custom logic

## Monitoring & Analytics

### Application Monitoring

- Error tracking (Sentry integration ready)
- Performance monitoring (Web Vitals)
- User analytics (Segment integration ready)

### Database Monitoring

- Slow query logs
- Connection pooling
- Backup verification

## Future Improvements

1. **AI Integration**
   - OpenAI API for task suggestions
   - Natural language processing
   - Predictive analytics

2. **Real-time Collaboration**
   - Live cursors for shared tasks
   - Conflict-free data types (CRDT)
   - WebSocket optimizations

3. **Mobile Apps**
   - React Native for iOS/Android
   - Offline-first synchronization
   - Native notifications

4. **Enterprise Features**
   - SAML/SCIM for SSO
   - Audit logs
   - Advanced permission models
   - White-label support

---

**Document Version**: 1.0
**Last Updated**: July 24, 2024
