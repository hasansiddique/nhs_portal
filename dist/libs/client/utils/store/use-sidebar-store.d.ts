type SidebarState = {
    content: React.ReactNode;
    label?: string;
    visible: boolean;
};
export declare const useSidebarState: () => SidebarState | null;
export declare const useSidebarActions: () => {
    openSidebar: (sidebarState: SidebarState) => void;
    closeSidebar: () => void;
};
export {};
