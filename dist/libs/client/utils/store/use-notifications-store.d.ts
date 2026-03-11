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
    nextPageData: {
        page: number;
        totalPages: number;
    } | null;
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
    };
}
export declare const useNotificationStore: import('zustand').UseBoundStore<import('zustand').StoreApi<NotificationStore>>;
export declare const useNotificationState: () => NotificationState;
export declare const useNotificationActions: () => {
    fetchNotifications: (fetchMore?: boolean) => Promise<void>;
    fetchNotificationCategories: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    clearNotifications: () => void;
    updateUnreadNotificationsCount: (count: number) => void;
    resetUnreadNotificationsCount: () => void;
    markAsRead: (notificationId: number) => void;
    markAllAsRead: () => void;
    sortNotifications: (notifications: Notification[]) => Notification[];
};
export {};
