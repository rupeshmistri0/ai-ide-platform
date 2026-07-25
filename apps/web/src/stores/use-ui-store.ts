import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  theme: 'dark' | 'light';
  breadcrumbTitle: string;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setBreadcrumbTitle: (title: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  theme: 'dark',
  breadcrumbTitle: 'Dashboard',
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setBreadcrumbTitle: (title) => set({ breadcrumbTitle: title }),
}));
