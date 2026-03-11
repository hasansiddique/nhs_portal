import { toast } from 'sonner';
import { create } from 'zustand';

import { request } from '../request';
import transformKeys from "../transform-keys";

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
  nextPageData: { page: number; totalPages: number } | null;
};

interface UseInboxStore {
  state: InboxState;
  actions: {
    fetchChats: (fetchMore?: boolean) => Promise<void>;
    initiateChat: (receiverId: number) => Promise<number | null>;
    setActiveChat: (chatId: number) => void;
    addMessageToChat: (chat: any) => void;

    markChatAsRead: (chatId: number) => void;
    // fetchSelectedUserMessages: (chatId: string) => Promise<void>;

    clearInbox: () => void;
    updateChatsCount: (count: number) => void;
    resetUnreadInboxCount: () => void;
  };
}

export const useInboxStore = create<UseInboxStore>((set, get) => ({
  state: {
    isInitialized: false,
    chats: [],
    isFetchingChats: false,
    activeChat: 0,

    isFetchingUserMessages: false,

    nextPageData: null,
    unreadChatsCount: 0,
  },
  actions: {
    fetchChats: async (fetchMore = false) => {
      set((store) => ({
        state: { ...store.state, isFetchingChats: true, isInitialized: true },
      }));

      try {
        const { data } = await request.post('/chats', {});

        set((store) => ({
          state: {
            ...store.state,
            unreadChatsCount: data?.data.unreadChatsCount,
            chats: fetchMore
              ? [...store.state.chats, ...data?.data.chats]
              : data?.data.chats
          },
        }));
      } catch (err: any) {
        toast.error(err.response?.data.messages || err.message || 'Something went wrong.')
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingChats: false },
        }));
      }
    },

    // fetchSelectedUserMessages: async (chatId: string) => {
    //   set((store) => ({
    //     state: { ...store.state, isFetchingUserMessages: true },
    //   }));
    //
    //   try {
    //     const { data } = await request.get(`/chat/${chatId}/messages`);
    //     set((store) => ({
    //       state: {
    //         ...store.state,
    //         selectedUserMessages: data?.data,
    //       },
    //     }));
    //   } catch (err: any) {
    //     Object.values(err.response?.data?.messages || {}).forEach((message) =>
    //       toast.error(String(message))
    //     );
    //   } finally {
    //     set((store) => ({
    //       state: { ...store.state, isFetchingUserMessages: false },
    //     }));
    //   }
    // },

    addMessageToChat: (chat) =>
      set((store) => {
        let updatedChats = [...store.state.chats];

        const existingChatIndex = updatedChats.findIndex((c) => c.id === chat.id);

        if (existingChatIndex !== -1) {
          // Update existing chat
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            lastMessage: chat.message.message,
            lastMessageTime: chat.message.created_at,
            unreadCount: chat.unread_count,
            messages: [...updatedChats[existingChatIndex].messages, transformKeys.toCamelCase(chat.message) as MessageProps],
          };
        } else {
          // Add new chat entry if not found
          updatedChats.push({
            id: chat.id,
            recipientAvatar: chat.recipient_avatar,
            recipientUsername: chat.recipient_username,
            lastMessage: chat.message.message,
            lastMessageTime: chat.message.created_at,
            unreadCount: chat.unread_count,
            messages: [transformKeys.toCamelCase(chat.message) as MessageProps],
          });
        }

        // 🔹 Sort the updated chats by lastMessageTime (descending order)
        updatedChats.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

        return {
          state: {
            ...store.state,
            chats: updatedChats,
          },
        };
      }),


    initiateChat: async (receiverId: number) => {
      set((store) => ({
        state: { ...store.state, isFetchingChats: true },
      }));

      try {
        const { data } = await request.post(`/chat/initiate`, {
          receiver_id: receiverId,
        });

        const newChat = data.data?.chat;

        set((store) => {
          const existingChatIndex = store.state.chats.findIndex((chat) => chat.id === newChat.id);

          return {
            state: {
              ...store.state,
              chats:
                existingChatIndex !== -1
                  ? store.state.chats.map((chat, index) =>
                    index === existingChatIndex
                      ? { ...chat, ...newChat, messages: chat.messages } // Preserve messages
                      : chat
                  )
                  : [{ ...newChat, messages: [] }, ...store.state.chats], // Prepend only if new
              activeChat: newChat.id,
            },
          };
        });

        return newChat.id;
      } catch (err: any) {
        toast.error(err.response?.data.message || err.message || 'Something went wrong.');
        return null;
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingChats: false },
        }));
      }
    },

    markChatAsRead: async (chatId) => {
      const { state } = get();
      const chat = state.chats.find((chat) => chat.id === chatId);

      if (!chat || Number(chat.unreadCount) < 1) return;

      try {
        const { data } = await request.post(`/chat/mark-read/${chatId}`, {});

        set((store) => ({
          state: {
            ...store.state,
            chats: store.state.chats.map((chat) =>
              chat.id === data?.data?.chat.id
                ? { ...chat, unreadCount: data?.data?.chat.unreadCount }
                : chat
            ),
            unreadChatsCount: data?.data?.unreadChatCount,
          },
        }));
      } catch (err: any) {
        toast.error(err.response?.data.message || err.message || "Something went wrong.");
      }
    },

    setActiveChat: (chatId) =>
      set((store) => ({
        state: {
          ...store.state,
          activeChat: chatId,
        },
      })),

    clearInbox: () =>
      set((store) => ({
        state: {
          ...store.state,
          chats: [],
        },
      })),

    updateChatsCount: (count: number) =>
      set((store) => ({
        state: {
          ...store.state,
          unreadChatsCount: count,
        },
      })),

    resetUnreadInboxCount: () =>
      set((store) => ({
        state: {
          ...store.state,
          unreadChatsCount: 0,
        },
      })),
  },
}));

export const useInboxState = () => useInboxStore((state) => state.state);
export const useInboxActions = () => useInboxStore((state) => state.actions);
