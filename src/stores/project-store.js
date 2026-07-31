import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  selectedProjectId: null,
  selectedLabelId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedLabelId: (id) => set({ selectedLabelId: id }),
  clearProjectFilters: () => set({ selectedProjectId: null, selectedLabelId: null }),
}));
