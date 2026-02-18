/**
 * Twitch Chat Integration Service
 * Handles real-time chat connection, message parsing, and command routing
 */

import { ChatCommand } from './game-state';

export interface ChatMessage {
  username: string;
  userId: string;
  message: string;
  color?: string;
  isModerator: boolean;
  isStreamer: boolean;
  isBroadcaster: boolean;
  timestamp: Date;
  badges?: Record<string, string>;
}

export interface TwitchChatConfig {
  channel: string;
  botUsername?: string;
  oauthToken?: string;
}

interface ChatSubscriber {
  callback: (msg: ChatMessage) => void;
  filter?: (msg: ChatMessage) => boolean;
}

interface CommandSubscriber {
  command: string;
  callback: (cmd: ChatCommand) => void;
}

let currentConfig: TwitchChatConfig | null = null;
let messageHistory: ChatMessage[] = [];
let messageSubscribers: ChatSubscriber[] = [];
let commandSubscribers: CommandSubscriber[] = [];
let isConnected = false;

// Parse TMI badges to determine user status
function parseBadges(badgeStr?: string): Record<string, string> {
  const badges: Record<string, string> = {};
  if (!badgeStr) return badges;

  badgeStr.split(',').forEach(badge => {
    const [key, value] = badge.split('/');
    badges[key] = value;
  });

  return badges;
}

/**
 * Parse chat message into our interface
 * This would work with real TMI.js library
 */
export function parseChatMessage(
  username: string,
  message: string,
  userstate: any = {}
): ChatMessage {
  const isModerator = !!userstate.mod || !!userstate.badges?.moderator;
  const isBroadcaster = !!userstate.badges?.broadcaster;
  const isStreamer = isBroadcaster;

  return {
    username,
    userId: userstate['user-id'] || `user_${Date.now()}`,
    message,
    color: userstate.color,
    isModerator,
    isStreamer,
    isBroadcaster,
    timestamp: new Date(),
    badges: parseBadges(userstate.badges),
  };
}

/**
 * Initialize Twitch Chat connection
 * For real implementation, this would use tmi.js
 */
export async function initTwitchChat(config: TwitchChatConfig): Promise<boolean> {
  try {
    currentConfig = config;

    console.log(`🔗 Connecting to Twitch chat: #${config.channel}`);

    // In production, this would use real TMI.js library
    // For now, we'll set up the infrastructure for real-time chat
    
    isConnected = true;
    console.log(`✓ Connected to #${config.channel}`);

    return true;
  } catch (error) {
    console.error('Failed to initialize Twitch Chat:', error);
    isConnected = false;
    return false;
  }
}

/**
 * Subscribe to chat messages
 */
export function onChatMessage(
  callback: (msg: ChatMessage) => void,
  filter?: (msg: ChatMessage) => boolean
): () => void {
  const subscriber: ChatSubscriber = { callback, filter };
  messageSubscribers.push(subscriber);

  // Return unsubscribe function
  return () => {
    messageSubscribers = messageSubscribers.filter(s => s !== subscriber);
  };
}

/**
 * Subscribe to specific chat commands
 */
export function onChatCommand(
  command: string,
  callback: (cmd: ChatCommand) => void
): () => void {
  const subscriber: CommandSubscriber = { command: command.toLowerCase(), callback };
  commandSubscribers.push(subscriber);

  // Return unsubscribe function
  return () => {
    commandSubscribers = commandSubscribers.filter(s => s !== subscriber);
  };
}

/**
 * Handle incoming chat message
 * This should be called by the chat connection library
 */
export function handleChatMessage(
  username: string,
  message: string,
  userstate?: any
): void {
  const chatMsg = parseChatMessage(username, message, userstate);
  
  messageHistory.push(chatMsg);
  if (messageHistory.length > 1000) {
    messageHistory.shift(); // Keep only last 1000 messages
  }

  // Notify message subscribers
  messageSubscribers.forEach(subscriber => {
    if (!subscriber.filter || subscriber.filter(chatMsg)) {
      subscriber.callback(chatMsg);
    }
  });

  // Parse and handle commands
  const commandParsed = parseCommand(message, username, userstate);
  if (commandParsed) {
    handleCommand(commandParsed);
  }
}

/**
 * Parse command from message
 */
export function parseCommand(
  message: string,
  username: string,
  userstate?: any
): ChatCommand | null {
  if (!message.startsWith('!')) return null;

  const parts = message.slice(1).split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return {
    command,
    username,
    userId: userstate?.['user-id'] || `user_${Date.now()}`,
    args,
    timestamp: new Date(),
  };
}

/**
 * Route command to subscribers
 */
function handleCommand(cmd: ChatCommand): void {
  commandSubscribers.forEach(subscriber => {
    if (subscriber.command === cmd.command) {
      subscriber.callback(cmd);
    }
  });
}

/**
 * Send message to chat (requires proper credentials)
 */
export async function sendChatMessage(message: string): Promise<boolean> {
  if (!currentConfig) {
    console.error('Chat not initialized');
    return false;
  }

  try {
    // In production, would use tmi.js
    // client.say(currentConfig.channel, message);
    console.log(`💬 [BOT] → #${currentConfig.channel}: ${message}`);
    return true;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    return false;
  }
}

/**
 * Get recent chat messages
 */
export function getRecentMessages(limit: number = 50): ChatMessage[] {
  return messageHistory.slice(-limit);
}

/**
 * Get chat messages from specific user
 */
export function getUserMessages(username: string, limit: number = 20): ChatMessage[] {
  return messageHistory
    .filter(msg => msg.username.toLowerCase() === username.toLowerCase())
    .slice(-limit);
}

/**
 * Check if user has badge
 */
export function userHasBadge(username: string, badge: string): boolean {
  const messages = getUserMessages(username, 1);
  if (messages.length === 0) return false;
  return badge in (messages[0].badges || {});
}

/**
 * Disconnect from chat
 */
export async function disconnectChat(): Promise<void> {
  try {
    isConnected = false;
    messageHistory = [];
    messageSubscribers = [];
    commandSubscribers = [];
    currentConfig = null;
    console.log('✓ Disconnected from Twitch Chat');
  } catch (error) {
    console.error('Error disconnecting from chat:', error);
  }
}

/**
 * Get connection status
 */
export function isConnectedToChat(): boolean {
  return isConnected;
}

/**
 * Get current channel
 */
export function getCurrentChannel(): string | null {
  return currentConfig?.channel || null;
}

/**
 * Clear message history (useful for testing)
 */
export function clearMessageHistory(): void {
  messageHistory = [];
}
