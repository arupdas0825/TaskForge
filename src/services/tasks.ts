import { supabase } from '@/lib/supabase/client';
import { Task } from '@/types';

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Task[];
}

export async function getTaskById(id: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function completeTask(id: string) {
  return updateTask(id, { status: 'completed' });
}

export async function archiveTask(id: string) {
  return updateTask(id, { status: 'archived' });
}

export async function restoreTask(id: string) {
  return updateTask(id, { status: 'todo' });
}

export async function duplicateTask(id: string) {
  const task = await getTaskById(id);
  const { id: _, created_at, updated_at, ...taskData } = task;

  return createTask({
    ...taskData,
    title: `${task.title} (Copy)`,
  });
}
