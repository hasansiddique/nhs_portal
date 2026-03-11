import { toast } from 'sonner';
import { create } from 'zustand';

import { request } from '../request';

type Notification = {
  id: number;
  categoryId: number;
  message: string;
  isRead: string;
  url: string;
  image: string;
  createdAt: string;
};

type NotificationCategory = {
  id: number;
  name: string;
};

type NotificationState = {
  isInitialized: boolean;
  notifications: Notification[];
  unreadNotificationsCount: number;
  nextPageData: { page: number; totalPages: number } | null;
  isFetchingNotifications: boolean;
  categories: NotificationCategory[];
  isFetchingCategories: boolean;
};

interface NotificationStore {
  state: NotificationState;
  actions: {
    fetchNotifications: (fetchMore?: boolean) => Promise<void>;
    fetchNotificationCategories: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    clearNotifications: () => void;
    updateUnreadNotificationsCount: (count: number) => void;
    resetUnreadNotificationsCount: () => void;
    markAsRead: (notificationId: number) => void;
    markAllAsRead: () => void;
    sortNotifications: (notifications: Notification[]) => Notification[];
    // initializeWebSocketListeners: () => void;
  };
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  state: {
    isInitialized: false,
    categories: [],
    notifications: [],
    nextPageData: null,
    unreadNotificationsCount: 0,
    isFetchingNotifications: false,
    isFetchingCategories: false,
  },
  actions: {
    fetchNotifications: async (fetchMore = false) => {
      const { state } = get();
      set((store) => ({
        state: { ...store.state, isFetchingNotifications: true, isInitialized: true },
      }));

      try {
        const { data } = await request.post('/notifications', {
          limit: 20,
          page:
            fetchMore && state.nextPageData ? state.nextPageData.page + 1 : 1,
        });

        set((store) => ({
          state: {
            ...store.state,
            unreadNotificationsCount: data?.totalUnreadCount,
            notifications: fetchMore
              ? [...store.state.notifications, ...data?.data]
              : data?.data,
            nextPageData: data?.pager,
          },
        }));
      } catch (err: any) {
        Object.values(err.response?.data?.messages || {}).forEach((message) =>
          toast.error(String(message))
        );
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingNotifications: false },
        }));
      }
    },

    fetchNotificationCategories: async () => {
      set((store) => ({
        state: { ...store.state, isFetchingCategories: true },
      }));

      try {
        const { data } = await request.get('/notification-categories');
        set((store) => ({
          state: {
            ...store.state,
            categories: data?.data,
          },
        }));
      } catch (err: any) {
        Object.values(err.response?.data?.messages || {}).forEach((message) =>
          toast.error(String(message))
        );
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingCategories: false },
        }));
      }
    },

    markAsRead: async (notificationId: number) => {
      try {
        await request.put(`/notifications/mark-read/${notificationId}`, {});

        set((store) => ({
          state: {
            ...store.state,
            notifications: get().actions.sortNotifications(
              store.state.notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: '1' } : n
              )
            ),
            unreadNotificationsCount: Math.max(
              store.state.unreadNotificationsCount - 1,
              0
            ),
          },
        }));
      } catch (err: any) {
        toast.error('Failed to mark notification as read.');
      }
    },

    markAllAsRead: async () => {
      try {
        await request.put('/notifications/mark-all-read', {});

        set((store) => ({
          state: {
            ...store.state,
            notifications: get().actions.sortNotifications(
              store.state.notifications.map((n) => ({ ...n, isRead: '1' }))
            ),
            unreadNotificationsCount: 0, // Reset unread count
          },
        }));

        toast.success('All notifications marked as read.');
      } catch (err: any) {
        toast.error('Failed to mark all notifications as read.');
      }
    },

    sortNotifications: (notifications: Notification[]) => {
      return [...notifications].sort((a, b) => {
        if (a.isRead === b.isRead) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return a.isRead === '0' ? -1 : 1;
      });
    },

    addNotification: (notification) => {
      set((store) => ({
        state: {
          ...store.state,
          notifications: [
            {
              ...notification,
              isRead: String(notification.isRead),
            },
            ...store.state.notifications,
          ],
          unreadNotificationsCount: store.state.unreadNotificationsCount + 1,
        },
      }));
    },

    clearNotifications: () => {
      set((store) => ({
        state: {
          ...store.state,
          notifications: [],
        },
      }));
    },

    updateUnreadNotificationsCount: (count) => {
      set((store) => ({
        state: {
          ...store.state,
          unreadNotificationsCount: count,
        },
      }));
    },

    resetUnreadNotificationsCount: () => {
      set((store) => ({
        state: {
          ...store.state,
          unreadNotificationsCount: 0,
        },
      }));
    },

    // initializeWebSocketListeners: () => {
    //   WebSocketManager.setWebSocketHandlers({
    //     addNotification: (notification) => {
    //       get().actions.addNotification(notification);
    //     },
    //     updateUnreadNotificationsCount: (count) => {
    //       get().actions.updateUnreadNotificationsCount(count);
    //     },
    //   });
    // },
  },
}));

// Selectors for accessing state/actions in components
export const useNotificationState = () =>
  useNotificationStore((state) => state.state);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
