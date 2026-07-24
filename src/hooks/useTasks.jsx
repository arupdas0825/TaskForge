import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '@/services/tasks';
import { toast } from 'sonner';

const TASKS_QUERY_KEY = ['tasks'];

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: getTasks,
  });

  const createTaskMutation = useMutation({
    mutationFn: apiCreateTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-metrics'] });
      toast.success('Task created successfully');
    },
    onError: (err) => {
      toast.error(`Failed to create task: ${err.message || err}`);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }) => apiUpdateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-metrics'] });
      toast.success('Task updated');
    },
    onError: (err) => {
      toast.error(`Failed to update task: ${err.message || err}`);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: apiDeleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['productivity-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-metrics'] });
      toast.success('Task deleted');
    },
    onError: (err) => {
      toast.error(`Failed to delete task: ${err.message || err}`);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: (taskOrId, possibleUpdates) => {
      if (typeof taskOrId === 'string') {
        return updateTaskMutation.mutateAsync({ id: taskOrId, updates: possibleUpdates });
      }
      return updateTaskMutation.mutateAsync({ id: taskOrId.id, updates: taskOrId });
    },
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}
