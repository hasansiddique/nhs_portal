import React, { useEffect } from 'react';

import { Footer } from './footer/Footer';
import { Header } from './header/Header';

import { Dialog, ModalDialog } from '@your-props/client/ui';
import { useAuthDialogStore, useSidebarState } from '@your-props/client/utils';

export const ThemeLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    showDialog,
    showMessageDialog,
    toggleDialogVisibility,
    toggleMessageDialogVisibility,
  } = useAuthDialogStore();
  const sidebarState = useSidebarState();

  useEffect(() => {
    document.body.style.overflow = sidebarState?.visible ? 'hidden' : 'auto';
  }, [sidebarState?.visible]);

  return (
    <div>
      <Dialog
        show={showDialog}
        onHide={() => toggleDialogVisibility(false, null)}
      />

      <div className="extra-large-modal">
        <ModalDialog
          show={showMessageDialog}
          onHide={() => toggleMessageDialogVisibility(false, null)}
        />
      </div>

      <Header />

      {children}
      <Footer />
    </div>
  );
};
