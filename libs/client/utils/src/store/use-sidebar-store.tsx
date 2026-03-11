import { create } from 'zustand';

type SidebarState = {
  content: React.ReactNode;
  label?: string;
  visible: boolean;
};

interface SidebarStore {
  sidebarState: SidebarState | null;
  actions: {
    openSidebar: (sidebarState: SidebarState) => void;
    closeSidebar: () => void;
  };
}

const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarState: null,
  actions: {
    openSidebar: (sidebarState: SidebarState) => set({ sidebarState }),
    closeSidebar: () => set({ sidebarState: null }),
  },
}));

export const useSidebarState = () =>
  useSidebarStore((state) => state.sidebarState);

export const useSidebarActions = () =>
  useSidebarStore((state) => state.actions);
