-- Enable RLS
alter publication supabase_realtime set (publish = 'insert,update,delete');

-- Users/Profiles Table
create table public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  email text not null unique,
  name text,
  avatar_url text,
  timezone text default 'UTC',
  theme text default 'system',
  language text default 'en',
  notifications_enabled boolean default true,
  email_notifications boolean default true,
  push_notifications boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  color text default '#3B82F6',
  icon text,
  archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.projects enable row level security;

create policy "Users can read their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Labels Table
create table public.labels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text default '#3B82F6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.labels enable row level security;

create policy "Users can read their own labels"
  on public.labels for select
  using (auth.uid() = user_id);

create policy "Users can insert their own labels"
  on public.labels for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own labels"
  on public.labels for update
  using (auth.uid() = user_id);

create policy "Users can delete their own labels"
  on public.labels for delete
  using (auth.uid() = user_id);

-- Tasks Table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text default 'todo' check (status in ('todo', 'in_progress', 'completed', 'archived')),
  due_date timestamp with time zone,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  estimated_time integer,
  actual_time integer,
  labels text[] default array[]::text[],
  color text,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  is_recurring boolean default false,
  recurrence_pattern text check (recurrence_pattern in ('daily', 'weekly', 'monthly', 'custom')),
  recurrence_custom text,
  has_subtasks boolean default false,
  subtasks_count integer default 0,
  completed_subtasks_count integer default 0,
  is_favorite boolean default false,
  is_template boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.tasks enable row level security;

create policy "Users can read their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Subtasks Table
create table public.subtasks (
  id uuid default gen_random_uuid() primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  completed boolean default false,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.subtasks enable row level security;

create policy "Users can read subtasks of their own tasks"
  on public.subtasks for select
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can insert subtasks to their own tasks"
  on public.subtasks for insert
  with check (
    exists (
      select 1 from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can update subtasks of their own tasks"
  on public.subtasks for update
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can delete subtasks of their own tasks"
  on public.subtasks for delete
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- Attachments Table
create table public.attachments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_name text not null,
  file_size integer not null,
  file_type text not null,
  file_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.attachments enable row level security;

create policy "Users can read attachments of their own tasks"
  on public.attachments for select
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = attachments.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can insert attachments to their own tasks"
  on public.attachments for insert
  with check (
    exists (
      select 1 from public.tasks
      where tasks.id = attachments.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can delete attachments of their own tasks"
  on public.attachments for delete
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = attachments.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- Comments Table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.comments enable row level security;

create policy "Users can read comments on their own tasks"
  on public.comments for select
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = comments.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can insert comments to their own tasks"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.tasks
      where tasks.id = comments.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('task_due', 'task_completed', 'task_assigned', 'comment', 'mention')),
  title text not null,
  message text not null,
  related_id uuid,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.notifications enable row level security;

create policy "Users can read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Workspaces Table
create table public.workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alt table public.workspaces enable row level security;

create policy "Users can read workspaces they are members of"
  on public.workspaces for select
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can insert workspaces"
  on public.workspaces for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own workspaces"
  on public.workspaces for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own workspaces"
  on public.workspaces for delete
  using (auth.uid() = owner_id);

-- Workspace Members Table
create table public.workspace_members (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id, user_id)
);

alt table public.workspace_members enable row level security;

create policy "Users can read workspace members"
  on public.workspace_members for select
  using (
    exists (
      select 1 from public.workspaces
      where workspaces.id = workspace_members.workspace_id
      and (
        workspaces.owner_id = auth.uid()
        or exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id = workspaces.id
          and wm.user_id = auth.uid()
        )
      )
    )
  );

-- Task Dependencies Table
create table public.task_dependencies (
  id uuid default gen_random_uuid() primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(task_id, depends_on_task_id)
);

alt table public.task_dependencies enable row level security;

create policy "Users can read dependencies of their own tasks"
  on public.task_dependencies for select
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = task_dependencies.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- Indexes for performance
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_due_date_idx on public.tasks(due_date);
create index tasks_status_idx on public.tasks(status);
create index tasks_priority_idx on public.tasks(priority);
create index projects_user_id_idx on public.projects(user_id);
create index labels_user_id_idx on public.labels(user_id);
create index subtasks_task_id_idx on public.subtasks(task_id);
create index attachments_task_id_idx on public.attachments(task_id);
create index comments_task_id_idx on public.comments(task_id);
create index comments_user_id_idx on public.comments(user_id);
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_created_at_idx on public.notifications(created_at);
create index workspace_members_user_id_idx on public.workspace_members(user_id);
create index workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
