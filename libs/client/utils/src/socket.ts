export class WebSocketManager2 {
  private static instance: WebSocket | null = null;

  static getWebSocket(): WebSocket {
    if (!this.instance) {
      this.instance = new WebSocket('wss://api.yourprops.devletes.com/ws/');

      this.instance.onopen = () => {
        console.log('WebSocket Connection opened');
      };

      this.instance.onerror = (error) => {
        console.error('WebSocket Connection failed', error);
      };

      this.instance.onclose = () => {
        console.log('WebSocket Connection closed');
        this.instance = null;
      };
    }

    return this.instance;
  }
}
