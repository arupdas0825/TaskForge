import { getAll, getById, putItem, deleteItem } from '@/lib/db/index';
import { getCurrentUser } from '@/lib/auth';
import { DEFAULT_USER_ID } from '@/lib/db/seed';

export async function getLabels() {
  const labels = await getAll('labels');
  return labels.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function createLabel(label) {
  const user = await getCurrentUser();
  const userId = user?.id || DEFAULT_USER_ID;
  const now = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `label-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const newLabel = {
    id,
    user_id: userId,
    name: label.name || 'New Label',
    color: label.color || '#3B82F6',
    created_at: now,
    updated_at: now,
    ...label,
  };

  await putItem('labels', newLabel);
  return newLabel;
}

export async function updateLabel(id, updates) {
  const existing = await getById('labels', id);
  if (!existing) throw new Error(`Label with id ${id} not found`);

  const updated = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await putItem('labels', updated);
  return updated;
}

export async function deleteLabel(id) {
  await deleteItem('labels', id);
}
