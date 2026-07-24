import { getAll, getById, putItem, deleteItem } from '@/lib/db/index';
import { getCurrentUser } from '@/lib/auth';

export async function getProjects() {
  const user = await getCurrentUser();
  const projects = await getAll('projects');

  let filtered = projects;
  if (user?.id) {
    filtered = projects.filter((p) => !p.user_id || p.user_id === user.id || p.user_id === 'local-user-id');
  }

  return filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function createProject(project) {
  const user = await getCurrentUser();
  const userId = user?.id || 'local-user-id';
  const now = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const newProject = {
    id,
    user_id: userId,
    name: project.name || 'New Project',
    description: project.description || '',
    color: project.color || '#3B82F6',
    icon: project.icon || 'Folder',
    tasks_count: 0,
    archived: false,
    created_at: now,
    updated_at: now,
    ...project,
  };

  await putItem('projects', newProject);
  return newProject;
}

export async function updateProject(id, updates) {
  const existing = await getById('projects', id);
  if (!existing) throw new Error(`Project with id ${id} not found`);

  const updated = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await putItem('projects', updated);
  return updated;
}

export async function deleteProject(id) {
  await deleteItem('projects', id);
}
