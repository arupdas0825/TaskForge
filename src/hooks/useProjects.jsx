import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '@/services/projects';
import { toast } from 'sonner';

const PROJECTS_QUERY_KEY = ['projects'];

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: apiCreateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['project-analysis'] });
      toast.success('Project created successfully');
    },
    onError: (err) => {
      toast.error(`Failed to create project: ${err.message || err}`);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }) => apiUpdateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['project-analysis'] });
      toast.success('Project updated');
    },
    onError: (err) => {
      toast.error(`Failed to update project: ${err.message || err}`);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: apiDeleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['project-analysis'] });
      toast.success('Project deleted');
    },
    onError: (err) => {
      toast.error(`Failed to delete project: ${err.message || err}`);
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutateAsync,
    updateProject: (id, updates) => updateProjectMutation.mutateAsync({ id, updates }),
    deleteProject: deleteProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}
