import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type EventFilters = {
  search: string;
  status: 'all' | 'draft' | 'published';
  sortBy: 'createdAt' | 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
};

export type AdminLanguage = 'en' | 'hr';

type AdminUiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  lang: AdminLanguage;
  setLang: (lang: AdminLanguage) => void;
  eventFilters: EventFilters;
  setEventFilters: (patch: Partial<EventFilters>) => void;
};

export const useAdminUiStore = create<AdminUiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
      lang: 'en',
      setLang: (lang) => set({ lang }),
      eventFilters: {
        search: '',
        status: 'all',
        sortBy: 'date',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      },
      setEventFilters: (patch) =>
        set((state) => ({ eventFilters: { ...state.eventFilters, ...patch } })),
    }),
    {
      name: 'speedelite-admin-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lang: state.lang,
        eventFilters: state.eventFilters,
      }),
    }
  )
);
