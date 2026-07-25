import {
  listCollection,
  getDocById,
  createDoc,
  updateDocById,
  deleteDocById,
} from '@/lib/firebase/firestore';

export async function getProjects() {
  const projects = await listCollection('projects');
  return projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function createProject(project) {
  const newProject = {
    name: project.name || 'New Project',
    description: project.description || '',
    color: project.color || '#3B82F6',
    icon: project.icon || 'Folder',
    tasks_count: 0,
    archived: false,
    ...project,
  };

  return createDoc('projects', newProject);
}

export async function updateProject(id, updates) {
  const existing = await getDocById('projects', id);
  if (!existing) throw new Error(`Project with id ${id} not found`);

  return updateDocById('projects', id, updates);
}

export async function deleteProject(id) {
  await deleteDocById('projects', id);
}
