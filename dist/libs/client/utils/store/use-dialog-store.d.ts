import { default as React } from 'react';

interface StoreState {
    showDialog: boolean;
    dialogClasses?: string;
    showCloseButton?: boolean;
    showMessageDialog: boolean;
    dialogContent: React.ReactNode;
    toggleDialogVisibility: (status: boolean, content: React.ReactNode, dialogClasses?: string, showCloseButton?: boolean) => void;
    toggleMessageDialogVisibility: (status: boolean, content: React.ReactNode, dialogClasses?: string, showCloseButton?: boolean) => void;
}
export declare const useAuthDialogStore: import('zustand').UseBoundStore<import('zustand').StoreApi<StoreState>>;
export {};
