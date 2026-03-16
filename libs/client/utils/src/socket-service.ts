import { getUserId } from './auth.types';
import { isEmpty } from 'lodash';
import Cookies from 'js-cookie';
import transformKeys from './transform-keys';

export class WebSocketManager {
  private static instance: WebSocket | null = null;
  private static channels: Set<string> = new Set();
  private static messageQueue: string[] = [];
  private static reconnectTimeout: NodeJS.Timeout | null = null;
  private static actions: {
    updateUnreadNotificationsCount: (count: number) => void;
    addNotification: (notification: any) => void;
    addMessageToChat: (message: any) => void;
    updateChatsCount: (count: number) => void;
    updateAuctionBids: (bidData: any) => void;
  } | null = null;

  static setWebSocketHandlers(actions: {
    updateUnreadNotificationsCount: (count: number) => void;
    addNotification: (notification: any) => void;
    addMessageToChat: (message: any) => void;
    updateChatsCount: (count: number) => void;
    updateAuctionBids: (bidData: any) => void;
  }) {
    this.actions = actions;
  }

  static connect() {
    if (this.instance) return;

    const rawToken = Cookies.get('token');
    const token = !isEmpty(rawToken)
      ? rawToken?.replace(/^Bearer\s+/i, '')
      : null;
    const userId = getUserId();

    const wsBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    const wsUrl = `${wsBaseUrl}${
      token ? `?token=${encodeURIComponent(token)}` : ''
    }`;
    // const wsUrl = `ws://127.0.0.1:8080/${token ? `?token=${encodeURIComponent(token)}` : ''}`;

    this.instance = new WebSocket(wsUrl);

    this.instance.onopen = () => {
      console.log('✅ WebSocket Connection Established');

      if (userId) {
        // Flush queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) this.instance?.send(message);
        }

        // Resubscribe to channels after reconnecting
        this.channels.forEach((channel) => {
          this.send('subscribe', { channel });
        });
      }
    };

    this.instance.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        const type = parsedData.type;
        if (this.actions) {
          if (type === 'notification') {
            this.actions.addNotification(
              transformKeys.toCamelCase(parsedData?.data?.notification)
            );
            this.actions.updateUnreadNotificationsCount(
              parsedData?.data?.total_unread_count
            );
          } else if (type === 'message') {
            this.actions.addMessageToChat(parsedData.data.chat);
            this.actions.updateChatsCount(parsedData.data.unread_chats_count);
          } else if (type === 'auction') {
            this.actions.updateAuctionBids(parsedData.data);
          }
        }
      } catch (error) {
        console.error('❌ WebSocket message parse error:', error);
      }
    };

    this.instance.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };

    this.instance.onclose = () => {
      console.warn('⚠️ WebSocket Disconnected. Reconnecting in 3s...');
      this.instance = null;
      if (!this.reconnectTimeout) {
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectTimeout = null;
          this.connect();
        }, 3000);
      }
    };
  }

  static subscribe(channel: string, callback?: (data: any) => void) {
    this.connect();
    this.channels.add(channel);

    const subscribeMessage = JSON.stringify({ action: 'subscribe', channel });
    if (this.instance?.readyState === WebSocket.OPEN) {
      console.log(`✅ Subscribed to channel: ${channel}`);
      this.instance.send(subscribeMessage);
    } else {
      this.messageQueue.push(subscribeMessage);
    }
  }

  static unsubscribe(channel: string) {
    if (this.channels.has(channel)) {
      this.channels.delete(channel);

      const unsubscribeMessage = JSON.stringify({
        action: 'unsubscribe',
        channel,
      });
      if (this.instance?.readyState === WebSocket.OPEN) {
        this.instance.send(unsubscribeMessage);
      } else {
        this.messageQueue.push(unsubscribeMessage);
      }
    }

    if (this.channels.size === 0) {
      this.disconnect();
    }
  }

  static send(channel: string, data: any) {
    const message = JSON.stringify({ channel, ...data });
    if (this.instance?.readyState === WebSocket.OPEN) {
      this.instance.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  static disconnect() {
    if (this.instance) {
      console.log('🔴 Closing WebSocket Connection...');
      this.instance.onopen = null;
      this.instance.onmessage = null;
      this.instance.onerror = null;
      this.instance.onclose = null;
      this.instance.close();
      this.instance = null;
    }
  }
}
