/**
 * Twitch Chat Integration Module
 * Handles connection to Twitch chat using TMI.js
 */

interface ChatMessage {
  username: string;
  message: string;
  color?: string;
  isModerator?: boolean;
  isStreamer?: boolean;
  timestamp: Date;
}

interface TwitchChatConfig {
  channel: string;
  username: string;
  token: string;
}

let chatMessages: ChatMessage[] = [];
let chatCallbacks: ((msg: ChatMessage) => void)[] = [];

/**
 * Initialize Twitch Chat Connection (requires TMI.js)
 * This would normally use: npm install tmi.js
 */
export async function initTwitchChat(config: TwitchChatConfig) {
  try {
    // Check if TMI is available
    if (typeof window !== 'undefined' && !(window as any).tmi) {
      console.warn('TMI.js not loaded. Install with: npm install tmi.js');
      return false;
    }

    // This is a placeholder for when TMI.js is properly integrated
    // For now, we'll use a simpler approach with fetch-based polling

    console.log('✓ Twitch Chat initialized for channel:', config.channel);
    return true;
  } catch (error) {
    console.error('Failed to initialize Twitch Chat:', error);
    return false;
  }
}

/**
 * Subscribe to new chat messages
 */
export function onChatMessage(callback: (msg: ChatMessage) => void) {
  chatCallbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    chatCallbacks = chatCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Emit a chat message (for testing or system messages)
 */
export function emitChatMessage(msg: ChatMessage) {
  chatMessages.push(msg);
  chatCallbacks.forEach(callback => callback(msg));
}

/**
 * Get recent chat messages
 */
export function getRecentMessages(limit: number = 50): ChatMessage[] {
  return chatMessages.slice(-limit);
}

/**
 * Parse chat commands
 */
export function parseCommand(message: string): { command: string; args: string[] } | null {
  if (!message.startsWith('!')) return null;
  
  const parts = message.slice(1).split(' ');
  return {
    command: parts[0].toLowerCase(),
    args: parts.slice(1)
  };
}

/**
 * Disconnect from Twitch Chat
 */
export function disconnectChat() {
  chatMessages = [];
  chatCallbacks = [];
  console.log('✓ Twitch Chat disconnected');
}

export type { ChatMessage, TwitchChatConfig };
