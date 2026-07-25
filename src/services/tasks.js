import {
  listCollection,
  getDocById,
  createDoc,
  updateDocById,
  deleteDocById,
} from '@/lib/firebase/firestore';
import { getGoogleAccessToken } from '@/lib/auth';
import { syncTaskToGoogle } from '@/lib/google-sync';

export async function getTasks() {
  const tasks = await listCollection('tasks');
  return tasks.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function getTaskById(id) {
  const task = await getDocById('tasks', id);
  if (!task) throw new Error(`Task with id ${id} not found`);
  return task;
}

export async function createTask(task) {
  const payload = {
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
    reminder_sent: task.due_date ? false : true,
    ...task,
  };

  const created = await createDoc('tasks', payload);

  // Sync to Google Calendar & Google Tasks if due_date is specified and access token is present
  if (created.due_date) {
    const accessToken = getGoogleAccessToken();
    if (accessToken) {
      syncTaskToGoogle(created, accessToken);
    }
  }

  return created;
}

export async function updateTask(id, updates) {
  const existingTask = await getTaskById(id);

  const payload = {
    ...updates,
  };

  // If due_date is changed or added, reset reminder_sent flag
  if (updates.due_date !== undefined && updates.due_date !== existingTask.due_date) {
    payload.reminder_sent = false;
  }

  const updatedTask = await updateDocById('tasks', id, payload);
  return updatedTask;
}

export async function deleteTask(id) {
  await deleteDocById('tasks', id);
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
