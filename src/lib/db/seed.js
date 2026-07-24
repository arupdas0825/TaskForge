import { getAll, putItem } from './index';

export const DEFAULT_USER_ID = 'local-user-id';

export const DEFAULT_PROFILE = {
  id: DEFAULT_USER_ID,
  email: 'alex@example.com',
  name: 'Alex Johnson',
  avatar_url: '',
  timezone: 'UTC',
  theme: 'dark',
  language: 'en',
  notifications_enabled: true,
  email_notifications: false,
  push_notifications: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    user_id: DEFAULT_USER_ID,
    name: 'Work & Product',
    description: 'Core product roadmap & deliverables',
    color: '#3B82F6', // Blue
    icon: 'Briefcase',
    tasks_count: 3,
    archived: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    user_id: DEFAULT_USER_ID,
    name: 'Personal & Health',
    description: 'Personal goals, fitness, and reading list',
    color: '#10B981', // Emerald
    icon: 'User',
    tasks_count: 2,
    archived: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    user_id: DEFAULT_USER_ID,
    name: 'UI Redesign',
    description: 'Shadcn/ui theme overhaul and glassmorphism',
    color: '#8B5CF6', // Purple
    icon: 'Palette',
    tasks_count: 2,
    archived: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_LABELS = [
  {
    id: 'label-1',
    user_id: DEFAULT_USER_ID,
    name: 'Feature',
    color: '#3B82F6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'label-2',
    user_id: DEFAULT_USER_ID,
    name: 'Bug Fix',
    color: '#EF4444',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'label-3',
    user_id: DEFAULT_USER_ID,
    name: 'Urgent',
    color: '#F59E0B',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    user_id: DEFAULT_USER_ID,
    title: 'Finalize Q3 Product Architecture Plan',
    description: 'Review client-side local DB schema and performance metrics.',
    priority: 'critical',
    status: 'in_progress',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_time: 120,
    actual_time: 45,
    labels: ['Feature', 'Urgent'],
    project_id: 'proj-1',
    is_recurring: false,
    has_subtasks: true,
    subtasks_count: 2,
    completed_subtasks_count: 1,
    attachments: [],
    comments: [],
    dependencies: [],
    is_favorite: true,
    is_template: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    user_id: DEFAULT_USER_ID,
    title: 'Migrate state management to client-side IndexedDB',
    description: 'Remove Supabase dependencies and implement local auth and persistence layer.',
    priority: 'high',
    status: 'completed',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_time: 180,
    actual_time: 160,
    labels: ['Feature'],
    project_id: 'proj-3',
    is_recurring: false,
    has_subtasks: false,
    subtasks_count: 0,
    completed_subtasks_count: 0,
    attachments: [],
    comments: [],
    dependencies: [],
    is_favorite: true,
    is_template: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    user_id: DEFAULT_USER_ID,
    title: 'Morning 5km Run & Stretching',
    description: 'Keep up with weekly fitness goal.',
    priority: 'medium',
    status: 'completed',
    due_date: new Date().toISOString(),
    estimated_time: 45,
    actual_time: 40,
    labels: [],
    project_id: 'proj-2',
    is_recurring: true,
    recurrence_pattern: 'daily',
    has_subtasks: false,
    subtasks_count: 0,
    completed_subtasks_count: 0,
    attachments: [],
    comments: [],
    dependencies: [],
    is_favorite: false,
    is_template: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    user_id: DEFAULT_USER_ID,
    title: 'Read Chapter 4 of Designing Data-Intensive Applications',
    description: 'Notes on consensus protocols and distributed databases.',
    priority: 'low',
    status: 'todo',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_time: 60,
    actual_time: 0,
    labels: [],
    project_id: 'proj-2',
    is_recurring: false,
    has_subtasks: false,
    subtasks_count: 0,
    completed_subtasks_count: 0,
    attachments: [],
    comments: [],
    dependencies: [],
    is_favorite: false,
    is_template: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-5',
    user_id: DEFAULT_USER_ID,
    title: 'Design System Dark Mode Color Palette Audit',
    description: 'Verify accessibility ratios for primary and secondary text components.',
    priority: 'medium',
    status: 'todo',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimated_time: 90,
    actual_time: 0,
    labels: ['Bug Fix'],
    project_id: 'proj-3',
    is_recurring: false,
    has_subtasks: false,
    subtasks_count: 0,
    completed_subtasks_count: 0,
    attachments: [],
    comments: [],
    dependencies: [],
    is_favorite: false,
    is_template: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function seedInitialData() {
  if (typeof window === 'undefined') return;

  const existingProfiles = await getAll('profiles');
  if (existingProfiles.length === 0) {
    await putItem('profiles', DEFAULT_PROFILE);
  }

  const existingProjects = await getAll('projects');
  if (existingProjects.length === 0) {
    for (const proj of SAMPLE_PROJECTS) {
      await putItem('projects', proj);
    }
  }

  const existingLabels = await getAll('labels');
  if (existingLabels.length === 0) {
    for (const label of SAMPLE_LABELS) {
      await putItem('labels', label);
    }
  }

  const existingTasks = await getAll('tasks');
  if (existingTasks.length === 0) {
    for (const task of SAMPLE_TASKS) {
      await putItem('tasks', task);
    }
  }
}
