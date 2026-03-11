export declare class WebSocketManager {
    private static instance;
    private static channels;
    private static messageQueue;
    private static reconnectTimeout;
    private static actions;
    static setWebSocketHandlers(actions: {
        updateUnreadNotificationsCount: (count: number) => void;
        addNotification: (notification: any) => void;
        addMessageToChat: (message: any) => void;
        updateChatsCount: (count: number) => void;
        updateAuctionBids: (bidData: any) => void;
    }): void;
    static connect(): void;
    static subscribe(channel: string, callback?: (data: any) => void): void;
    static unsubscribe(channel: string): void;
    static send(channel: string, data: any): void;
    static disconnect(): void;
}
