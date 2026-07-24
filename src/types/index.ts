// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends User {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

// Task Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  start_date?: string;
  end_date?: string;
  estimated_time?: number; // in minutes
  actual_time?: number; // in minutes
  labels: string[];
  color?: string;
  project_id?: string;
  parent_task_id?: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_custom?: string;
  has_subtasks: boolean;
  subtasks_count: number;
  completed_subtasks_count: number;
  attachments: Attachment[];
  comments: Comment[];
  dependencies: string[]; // task IDs
  is_favorite: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// Project Types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  tasks_count: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// Label Types
export interface Label {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// Attachment Types
export interface Attachment {
  id: string;
  task_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
}

// Comment Types
export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  user: User;
  created_at: string;
  updated_at: string;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  task_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface ProductivityStats {
  tasks_completed_today: number;
  tasks_completed_this_week: number;
  tasks_completed_this_month: number;
  total_focus_time: number;
  productivity_score: number;
  streak: number;
  average_completion_time: number;
}

export interface TaskMetrics {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_by_priority: Record<TaskPriority, number>;
  tasks_by_project: Record<string, number>;
  completion_rate: number;
}

// Notification Types
export type NotificationType = 'task_due' | 'task_completed' | 'task_assigned' | 'comment' | 'mention';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: string;
  read: boolean;
  created_at: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

// AI Types
export interface AIInsight {
  type: 'suggestion' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  action?: {
    label: string;
    type: string;
  };
}

export interface NaturalLanguageTaskInput {
  input: string;
  suggestedTask: Partial<Task>;
}
