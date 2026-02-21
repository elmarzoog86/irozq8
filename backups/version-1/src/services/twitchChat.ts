import { EventEmitter } from 'events';

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

interface ChatClient {
  connect(channelName: string): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(message: string): Promise<void>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}

/**
 * Twitch Chat Service - Connects to Twitch chat and handles messages
 */
export class TwitchChatService extends EventEmitter implements ChatClient {
  private channelName: string = '';
  private ws: WebSocket | null = null;
  private messageBuffer: ChatMessage[] = [];

  /**
   * Connect to Twitch chat via WebSocket
   */
  async connect(channelName: string): Promise<void> {
    this.channelName = channelName;

    return new Promise((resolve, reject) => {
      try {
        // Note: In production, you would use TMI.js client
        // For now, this is a basic implementation
        console.log(`🔌 Connecting to Twitch chat for channel: ${channelName}`);

        // Simulate connection for now
        this.messageBuffer = [];
        this.emit('connected', { channel: channelName });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Twitch chat
   */
  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.emit('disconnected');
  }

  /**
   * Send a message to chat
   */
  async sendMessage(message: string): Promise<void> {
    console.log(`💬 Sending message to ${this.channelName}: ${message}`);
    this.emit('message-sent', { message, timestamp: Date.now() });
  }


  /**
   * Get chat message history
   */
  getMessageHistory(limit: number = 50): ChatMessage[] {
    return this.messageBuffer.slice(-limit);
  }

  /**
   * Check if a message contains a command
   */
  isCommand(message: string): boolean {
    return message.toLowerCase().startsWith('!');
  }

  /**
   * Parse command from message
   */
  parseCommand(message: string): { command: string; args: string[] } | null {
    if (!this.isCommand(message)) return null;

    const parts = message.slice(1).split(' ');
    return {
      command: parts[0].toLowerCase(),
      args: parts.slice(1),
    };
  }
}

/**
 * Create and export singleton instance
 */
export const twitchChatService = new TwitchChatService();
