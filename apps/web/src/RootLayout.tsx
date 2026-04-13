import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { SonnerToaster } from '@your-props/client/ui';
import {
  getUserId,
  ScrollToTop,
  useCartActions,
  useInboxActions,
  WebSocketManager,
  useNotificationActions,
  usePropActions,
} from '@your-props/client/utils';
import { ThemeLayout, DashboardRightSidebar } from '@your-props/client/web';

export const RootLayout = () => {
  const userId = getUserId();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/' || pathname === '/home';

  const { addMessageToChat, fetchChats, updateChatsCount } = useInboxActions();
  const { fetchCartItems } = useCartActions();
  const { addNotification, fetchNotifications, updateUnreadNotificationsCount } = useNotificationActions();
  const { updateAuctionBids } = usePropActions();

  WebSocketManager.connect();
  WebSocketManager.setWebSocketHandlers({
    addNotification,
    addMessageToChat,
    updateUnreadNotificationsCount,
    updateChatsCount,
    updateAuctionBids,
  });

  useEffect(() => {
    if (userId && !isHomePage) {
      // fetchChats();
      // fetchCartItems();
      // fetchNotifications();
    }
  }, [userId, isHomePage]);

  return (
    <>
      <DashboardRightSidebar />
      <ScrollToTop />

      <SonnerToaster
        richColors
        closeButton
        theme="light"
        position="top-right"
        style={{ top: 14 }}
        toastOptions={{
          classNames: {
            title: 'text-2xl p-6',
            icon: 'ml-6',
          },
        }}
        expand
      />

      <ThemeLayout>
        <Outlet />
      </ThemeLayout>
    </>
  );
};
