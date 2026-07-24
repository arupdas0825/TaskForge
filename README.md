# TaskForge

A self-contained, 100% client-side task management platform built with Next.js 15, React 19, JavaScript (JSX), and browser-local IndexedDB persistence.

## Key Highlights

- ⚡ **Zero Backend Required**: Runs completely client-side without any server dependencies, APIs, or environment variables.
- 📦 **Browser-Local Persistence**: Uses browser IndexedDB (`taskforge-local`) to store tasks, projects, labels, and local user profiles.
- 🎯 **Task Management**: Quick-add, priority flags, categories, statuses (To Do, In Progress, Completed, Archived), and inline completion toggles.
- 📅 **Interactive Calendar**: View scheduled tasks visually across a monthly calendar.
- 📊 **Local Analytics**: Dynamic completion trends, priority breakdown, project performance, and focus metrics computed locally.
- 🎨 **Theme & Customization**: Support for Light, Dark, and System themes with toast notifications (Sonner).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS + shadcn/ui components
- **Language**: JavaScript (ES6+ / JSX)
- **State & Data**: TanStack React Query + Zustand + IndexedDB
- **Icons & Motion**: Lucide React + Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Quick Start

1. Clone or open the project directory:
```bash
cd TaskForge-sh-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server (zero environment variables required):
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle with Next.js
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks
