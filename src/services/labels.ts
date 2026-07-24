import { supabase } from '@/lib/supabase/client';
import { Label } from '@/types';

export async function getLabels() {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Label[];
}

export async function createLabel(label: Omit<Label, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('labels')
    .insert([label])
    .select()
    .single();

  if (error) throw error;
  return data as Label;
}

export async function updateLabel(id: string, updates: Partial<Label>) {
  const { data, error } = await supabase
    .from('labels')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Label;
}

export async function deleteLabel(id: string) {
  const { error } = await supabase.from('labels').delete().eq('id', id);
  if (error) throw error;
}
