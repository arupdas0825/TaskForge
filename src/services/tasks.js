import { getAll, getById, putItem, deleteItem } from '@/lib/db/index';
import { getCurrentUser } from '@/lib/auth';

export async function getTasks() {
  const user = await getCurrentUser();
  const tasks = await getAll('tasks');

  let filtered = tasks;
  if (user?.id) {
    filtered = tasks.filter((t) => !t.user_id || t.user_id === user.id || t.user_id === 'local-user-id');
  }

  return filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function getTaskById(id) {
  const task = await getById('tasks', id);
  if (!task) throw new Error(`Task with id ${id} not found`);
  return task;
}

export async function createTask(task) {
  const user = await getCurrentUser();
  const userId = user?.id || 'local-user-id';
  const now = new Date().toISOString();

  const id = crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const newTask = {
    id,
    user_id: userId,
    title: task.title || 'Untitled Task',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    due_date: task.due_date || null,
    start_date: task.start_date || null,
    end_date: task.end_date || null,
    estimated_time: task.estimated_time || 0,
    actual_time: task.actual_time || 0,
    labels: task.labels || [],
    color: task.color || null,
    project_id: task.project_id || null,
    parent_task_id: task.parent_task_id || null,
    is_recurring: Boolean(task.is_recurring),
    recurrence_pattern: task.recurrence_pattern || null,
    recurrence_custom: task.recurrence_custom || null,
    has_subtasks: Boolean(task.has_subtasks),
    subtasks_count: task.subtasks_count || 0,
    completed_subtasks_count: task.completed_subtasks_count || 0,
    attachments: task.attachments || [],
    comments: task.comments || [],
    dependencies: task.dependencies || [],
    is_favorite: Boolean(task.is_favorite),
    is_template: Boolean(task.is_template),
    created_at: now,
    updated_at: now,
    ...task,
  };

  await putItem('tasks', newTask);
  return newTask;
}

export async function updateTask(id, updates) {
  const existingTask = await getTaskById(id);
  const updatedTask = {
    ...existingTask,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await putItem('tasks', updatedTask);
  return updatedTask;
}

export async function deleteTask(id) {
  await deleteItem('tasks', id);
}

export async function completeTask(id) {
  return updateTask(id, { status: 'completed' });
}

export async function archiveTask(id) {
  return updateTask(id, { status: 'archived' });
}

export async function restoreTask(id) {
  return updateTask(id, { status: 'todo' });
}

export async function duplicateTask(id) {
  const task = await getTaskById(id);
  const { id: _, created_at, updated_at, ...taskData } = task;

  return createTask({
    ...taskData,
    title: `${task.title} (Copy)`,
  });
}
