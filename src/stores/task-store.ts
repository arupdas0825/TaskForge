import { create } from 'zustand';
import { Task } from '@/types';

interface TaskFilter {
  status?: string;
  priority?: string;
  project_id?: string;
  labels?: string[];
}

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilter;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setFilters: (filters: TaskFilter) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedTask: null,
  filters: {},
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
