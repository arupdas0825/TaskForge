import { create } from 'zustand';

export const useTaskStore = create((set) => ({
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
