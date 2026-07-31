import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLabels,
  createLabel as apiCreateLabel,
  updateLabel as apiUpdateLabel,
  deleteLabel as apiDeleteLabel,
} from '@/services/labels';
import { toast } from 'sonner';

const LABELS_QUERY_KEY = ['labels'];

export function useLabels() {
  const queryClient = useQueryClient();

  const { data: labels = [], isLoading, error } = useQuery({
    queryKey: LABELS_QUERY_KEY,
    queryFn: getLabels,
  });

  const createLabelMutation = useMutation({
    mutationFn: apiCreateLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
      toast.success('Label created successfully');
    },
    onError: (err) => {
      toast.error(`Failed to create label: ${err.message || err}`);
    },
  });

  const updateLabelMutation = useMutation({
    mutationFn: ({ id, updates }) => apiUpdateLabel(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
      toast.success('Label updated');
    },
    onError: (err) => {
      toast.error(`Failed to update label: ${err.message || err}`);
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: apiDeleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
      toast.success('Label deleted');
    },
    onError: (err) => {
      toast.error(`Failed to delete label: ${err.message || err}`);
    },
  });

  return {
    labels,
    isLoading,
    error,
    createLabel: createLabelMutation.mutateAsync,
    updateLabel: (id, updates) => updateLabelMutation.mutateAsync({ id, updates }),
    deleteLabel: deleteLabelMutation.mutateAsync,
    isCreating: createLabelMutation.isPending,
    isUpdating: updateLabelMutation.isPending,
    isDeleting: deleteLabelMutation.isPending,
  };
}
