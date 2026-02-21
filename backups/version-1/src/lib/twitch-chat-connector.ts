'use client';

/**
 * Real Twitch Chat Integration Service
 * Connects to actual Twitch chat using tmi.js
 * Listens for game answers and commands
 */

// Type for TMI.js (will be loaded at runtime)
declare global {
  interface Window {
    tmi: any;
  }
}

interface TwitchChatConnectorProps {
  channelName: string;
  accessToken: string;
  onMessage?: (username: string, message: string) => void;
  onAnswer?: (playerIndex: number, username: string, answer: string) => void;
  botUsername?: string;
}

class TwitchChatConnector {
  private client: any = null;
  private isConnected = false;
  private channelName = '';
  private messageCallbacks: Array<(username: string, message: string) => void> = [];
  private answerCallbacks: Array<(playerIndex: number, username: string, answer: string) => void> = [];

  /**
   * Initialize and connect to Twitch chat
   */
  async connect(props: TwitchChatConnectorProps): Promise<boolean> {
    try {
      const { channelName, accessToken, botUsername, onMessage, onAnswer } = props;

      console.log(`🚀 Starting Twitch chat connection for channel: ${channelName}`);
      console.log(`👤 Bot username: ${botUsername}`);
      console.log(`🔑 Access token: ${accessToken ? 'present' : 'MISSING'}`);

      // If already connected to the same channel, just update callbacks and return
      if (this.isConnected && this.channelName === channelName && this.client) {
        console.log(`✅ Already connected to channel: ${channelName}. Updating callbacks only.`);
        this.messageCallbacks = [];
        this.answerCallbacks = [];
        if (onMessage) this.messageCallbacks.push(onMessage);
        if (onAnswer) this.answerCallbacks.push(onAnswer);
        console.log(`📌 Updated ${this.messageCallbacks.length} message callbacks`);
        console.log(`📌 Updated ${this.answerCallbacks.length} answer callbacks`);
        return true;
      }

      // Wait for tmi.js to be available (load from CDN)
      let retries = 50; // Try for 5 seconds (50 * 100ms)
      console.log(`⏳ [CONNECTOR] Waiting for tmi.js to load from CDN...`);
      while (!window.tmi && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries--;
        if (retries % 10 === 0) {
          console.log(`⏳ [CONNECTOR] Waiting... ${retries * 100}ms remaining`);
        }
      }

      if (!window.tmi) {
        console.error('❌ [CONNECTOR] TMI.js failed to load from CDN after 5 seconds. Chat integration unavailable.');
        console.error('❌ [CONNECTOR] Check if https://cdn.jsdelivr.net/npm/tmi.js@1.8.5/lib/tmi.min.js is accessible');
        return false;
      }

      console.log('✅ [CONNECTOR] TMI.js loaded successfully from CDN');
      console.log(`📚 [CONNECTOR] TMI.js version: ${window.tmi.version || 'unknown'}`);

      this.channelName = channelName;

      // Clear old callbacks and register new ones
      // This prevents duplicate callbacks from being registered on reconnects
      this.messageCallbacks = [];
      this.answerCallbacks = [];
      
      if (onMessage) this.messageCallbacks.push(onMessage);
      if (onAnswer) this.answerCallbacks.push(onAnswer);

      console.log(`📌 Cleared and registered ${this.messageCallbacks.length} message callbacks`);
      console.log(`📌 Cleared and registered ${this.answerCallbacks.length} answer callbacks`);

      // Create TMI client with detailed config
      // Using OAuth token for authenticated chat access
      // This allows us to receive and send messages in chat
      const clientConfig = {
        options: { 
          debug: true,  // Enable debug mode to see detailed logs
          messagesLogLevel: 'info'
        },
        connection: {
          secure: true,
          reconnect: true,
          maxReconnectAttempts: 5,
          maxReconnectInterval: 30000
        },
        // Use OAuth authentication for proper chat access
        identity: {
          username: botUsername || 'bot', // Use the bot username from credentials
          password: accessToken ? `oauth:${accessToken}` : undefined, // OAuth token for authentication
        },
        channels: [channelName],
      };

      console.log('🔧 TMI.js client config (OAUTH MODE):', {
        username: clientConfig.identity.username,
        mode: 'oauth',
        channels: clientConfig.channels,
        debug: clientConfig.options.debug,
        hasToken: !!clientConfig.identity.password
      });

      this.client = new window.tmi.Client(clientConfig);

      // Set up event listeners with detailed logging
      this.client.on('connecting', (address: string, port: number) => {
        console.log(`🔄 [CONNECTOR-EVENT] Connecting to Twitch chat server: ${address}:${port}`);
      });

      this.client.on('logon', () => {
        console.log(`✅ [CONNECTOR-EVENT] Logged on to Twitch chat`);
      });

      this.client.on('message', (_channel: string, tags: any, message: string, self: boolean) => {
        const username = tags['display-name'] || tags.username;
        
        console.log(`📨 [CONNECTOR-EVENT] Message received - Username: ${username}, Self: ${self}, Message: "${message}"`);

        if (self) {
          console.log('  ℹ️ Ignoring own message');
          return;
        }

        const trimmedMessage = message.trim();

        console.log(`  ✓ Processing message from viewer: ${username} -> "${trimmedMessage}"`);

        // Call all message callbacks
        this.messageCallbacks.forEach(cb => {
          console.log(`  → Calling message callback for: ${username}`);
          cb(username, trimmedMessage);
        });

        // Check if message looks like a game answer
        this.processGameAnswer(username, trimmedMessage);
      });

      this.client.on('connected', (_address: string, _port: number) => {
        this.isConnected = true;
        console.log(`✅ [CONNECTOR-EVENT] Successfully connected to Twitch chat: ${this.channelName}`);
        console.log(`🎯 [CONNECTOR-EVENT] Ready to receive messages from: #${this.channelName}`);
      });

      this.client.on('disconnected', (reason: string) => {
        this.isConnected = false;
        console.log(`❌ [CONNECTOR-EVENT] Disconnected from Twitch chat. Reason: ${reason}`);
      });

      this.client.on('error', (error: any) => {
        console.error(`❌ [CONNECTOR-EVENT] TMI.js Error:`, error);
      });

      // Connect to chat
      console.log('🔗 [CONNECTOR] Initiating TMI.js connection...');
      console.log(`🔗 [CONNECTOR] Connecting to channel: ${this.channelName}`);
      try {
        await this.client.connect();
        console.log('⏳ [CONNECTOR] Connection initiated, waiting for confirmation events...');
        console.log('⏳ [CONNECTOR] If no "connected" event appears, the socket may not be connecting');
        return true;
      } catch (connectError) {
        console.error('❌ [CONNECTOR] Connection error:', connectError);
        throw connectError;
      }
    } catch (error) {
      console.error('❌ Failed to connect to Twitch chat:', error);
      return false;
    }
  }

  /**
   * Process potential game answer from chat
   */
  private processGameAnswer(username: string, message: string) {
    // Parse the answer (could be: number, letter, or option text)
    const cleanMessage = message.toLowerCase().trim();

    // Try to extract just the answer (first word or character)
    let answer = cleanMessage;

    // If message is a number (1-4 or 0-3)
    if (/^[0-4]$/.test(cleanMessage)) {
      answer = cleanMessage;
    }
    // If message is a letter (a-d or أ-د)
    else if (/^[a-dأ-د]$/i.test(cleanMessage)) {
      answer = cleanMessage;
    }
    // If message contains more than one word, take first word
    else {
      answer = cleanMessage.split(/\s+/)[0];
    }

    // For now, always send as player index 0 (first player is streamer)
    // In a real implementation, you might map chat users to player indices
    const playerIndex = 0;
    
    console.log(`📍 Processing game answer from ${username}: "${answer}" (playerIndex: ${playerIndex})`);
    
    // Call all answer callbacks
    this.answerCallbacks.forEach(cb => {
      console.log(`  → Calling answer callback with: ${username}, ${answer}`);
      cb(playerIndex, username, answer);
    });
  }

  /**
   * Send a message to chat
   */
  async sendMessage(message: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      console.error('Not connected to Twitch chat');
      return false;
    }

    try {
      await this.client.say(this.channelName, message);
      return true;
    } catch (error) {
      console.error('Failed to send message to chat:', error);
      return false;
    }
  }

  /**
   * Disconnect from chat
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const twitchChatConnector = new TwitchChatConnector();
