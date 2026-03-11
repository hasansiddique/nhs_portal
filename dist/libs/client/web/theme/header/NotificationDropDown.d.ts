import { default as React } from 'react';

interface Notification {
    id: number;
    categoryId: number;
    message: string;
    isRead: string;
    url: string;
    image: string;
    createdAt: string;
}
interface NotificationDropDownProps {
    isLoggedIn: boolean;
    animateIcon: boolean;
    unreadNotificationsCount: number;
    notifications: Notification[];
}
export declare const NotificationDropDown: React.FC<NotificationDropDownProps>;
export {};
