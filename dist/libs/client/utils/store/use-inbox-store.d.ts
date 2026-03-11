export type MessageProps = {
    id: number;
    isRead: number;
    message: string;
    senderId: number;
    createdAt: string;
};
type InboxState = {
    isInitialized: boolean;
    chats: any[];
    isFetchingChats: boolean;
    activeChat: number;
    isFetchingUserMessages: boolean;
    unreadChatsCount: number;
    nextPageData: {
        page: number;
        totalPages: number;
    } | null;
};
interface UseInboxStore {
    state: InboxState;
    actions: {
        fetchChats: (fetchMore?: boolean) => Promise<void>;
        initiateChat: (receiverId: number) => Promise<number | null>;
        setActiveChat: (chatId: number) => void;
        addMessageToChat: (chat: any) => void;
        markChatAsRead: (chatId: number) => void;
        clearInbox: () => void;
        updateChatsCount: (count: number) => void;
        resetUnreadInboxCount: () => void;
    };
}
export declare const useInboxStore: import('zustand').UseBoundStore<import('zustand').StoreApi<UseInboxStore>>;
export declare const useInboxState: () => InboxState;
export declare const useInboxActions: () => {
    fetchChats: (fetchMore?: boolean) => Promise<void>;
    initiateChat: (receiverId: number) => Promise<number | null>;
    setActiveChat: (chatId: number) => void;
    addMessageToChat: (chat: any) => void;
    markChatAsRead: (chatId: number) => void;
    clearInbox: () => void;
    updateChatsCount: (count: number) => void;
    resetUnreadInboxCount: () => void;
};
export {};
