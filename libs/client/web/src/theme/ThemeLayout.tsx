import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();

  // Dashboard has its own `pt-[96px]` in `apps/web/src/DashboardLayout.tsx`.
  // For all other pages, add a safe default offset so content never hides under the header.
  const needsHeaderOffset = !pathname.startsWith('/dashboard');

  useEffect(() => {
    document.body.style.overflow = sidebarState?.visible ? 'hidden' : 'auto';
  }, [sidebarState?.visible]);

  return (
    <div className="min-h-screen flex flex-col">
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

      <main className={`flex-1 ${needsHeaderOffset ? 'pt-[80px]' : ''}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};
