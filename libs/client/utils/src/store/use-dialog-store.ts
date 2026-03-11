import React from 'react';
import { create } from 'zustand';

interface StoreState {
  showDialog: boolean;
  dialogClasses?: string;
  showCloseButton?: boolean;
  showMessageDialog: boolean;
  dialogContent: React.ReactNode;
  toggleDialogVisibility: (
    status: boolean,
    content: React.ReactNode,
    dialogClasses?: string,
    showCloseButton?: boolean
  ) => void;
  toggleMessageDialogVisibility: (
    status: boolean,
    content: React.ReactNode,
    dialogClasses?: string,
    showCloseButton?: boolean
  ) => void;
}

export const useAuthDialogStore = create<StoreState>((set) => ({
  showDialog: false,
  dialogClasses: '',
  dialogContent: null,
  showCloseButton: true,
  showMessageDialog: false,
  toggleDialogVisibility: (
    status: boolean,
    content: React.ReactNode,
    dialogClasses?: string,
    showCloseButton?: boolean
  ) =>
    set(() => ({
      showDialog: status,
      dialogContent: content,
      dialogClasses: dialogClasses,
      showCloseButton: showCloseButton,
    })),

  toggleMessageDialogVisibility: (
    status: boolean,
    content: React.ReactNode,
    dialogClasses?: string,
    showCloseButton?: boolean
  ) =>
    set(() => ({
      dialogContent: content,
      showMessageDialog: status,
      dialogClasses: dialogClasses,
      showCloseButton: showCloseButton,
    })),
}));
