import {
  listCollection,
  getDocById,
  createDoc,
  updateDocById,
  deleteDocById,
} from '@/lib/firebase/firestore';

export async function getLabels() {
  const labels = await listCollection('labels');
  return labels.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function createLabel(label) {
  const newLabel = {
    name: label.name || 'New Label',
    color: label.color || '#3B82F6',
    ...label,
  };

  return createDoc('labels', newLabel);
}

export async function updateLabel(id, updates) {
  const existing = await getDocById('labels', id);
  if (!existing) throw new Error(`Label with id ${id} not found`);

  return updateDocById('labels', id, updates);
}

export async function deleteLabel(id) {
  await deleteDocById('labels', id);
}
