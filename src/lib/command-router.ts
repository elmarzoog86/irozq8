/**
 * Chat Command Router
 * Routes chat commands to appropriate game handlers
 */

import {
  ChatCommand,
  addViewerToSession,
  updateViewer,
  getGameSession,
} from './game-state';
import { sendChatMessage } from './twitch-chat-service';

export interface CommandHandler {
  command: string;
  description: string;
  handler: (cmd: ChatCommand, sessionId: string) => Promise<void>;
  requiresSession: boolean;
}

const commandHandlers = new Map<string, CommandHandler>();

/**
 * Register a command handler
 */
export function registerCommand(handler: CommandHandler): void {
  commandHandlers.set(handler.command.toLowerCase(), handler);
  console.log(`📝 Command registered: !${handler.command}`);
}

/**
 * Handle chat command
 */
export async function handleCommand(
  cmd: ChatCommand,
  sessionId: string
): Promise<void> {
  const handler = commandHandlers.get(cmd.command);

  if (!handler) {
    console.log(`⚠️  Unknown command: !${cmd.command}`);
    return;
  }

  if (handler.requiresSession && !getGameSession(sessionId)) {
    console.warn(`❌ Command !${cmd.command} requires active session`);
    return;
  }

  try {
    await handler.handler(cmd, sessionId);
  } catch (error) {
    console.error(`Error handling command !${cmd.command}:`, error);
    await sendChatMessage(`❌ Błąd w przetwarzaniu polecenia !${cmd.command}`);
  }
}

/**
 * Register default game commands
 */
export function registerDefaultCommands(): void {
  // !join - Join game
  registerCommand({
    command: 'join',
    description: 'Join the current game',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      const session = getGameSession(sessionId);
      if (!session) return;

      const alreadyJoined = session.viewers.has(cmd.userId);
      if (alreadyJoined) {
        await sendChatMessage(
          `@${cmd.username} أنت بالفعل منضم إلى اللعبة! 🎮`
        );
        return;
      }

      const maxPlayers = 100; // From game config
      if (session.viewers.size >= maxPlayers) {
        await sendChatMessage(
          `@${cmd.username} اللعبة امتلأت. عذراً، لا يمكن الانضمام الآن. 😢`
        );
        return;
      }

      addViewerToSession(sessionId, cmd.username, cmd.userId);
      await sendChatMessage(
        `✅ @${cmd.username} انضم إلى اللعبة! اللاعبون الآن: ${session.viewers.size + 1}`
      );
    },
    requiresSession: true,
  });

  // !leave - Leave game
  registerCommand({
    command: 'leave',
    description: 'Leave the current game',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      const session = getGameSession(sessionId);
      if (!session) return;

      const isJoined = session.viewers.has(cmd.userId);
      if (!isJoined) {
        await sendChatMessage(`@${cmd.username} أنت لم تنضم إلى اللعبة بعد.`);
        return;
      }

      session.viewers.delete(cmd.userId);
      await sendChatMessage(`👋 @${cmd.username} غادر اللعبة.`);
    },
    requiresSession: true,
  });

  // !ready - Mark ready
  registerCommand({
    command: 'ready',
    description: 'Mark as ready for the game',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      const session = getGameSession(sessionId);
      if (!session) return;

      const viewer = session.viewers.get(cmd.userId);
      if (!viewer) {
        await sendChatMessage(
          `@${cmd.username} يجب أن تنضم إلى اللعبة أولاً باستخدام !join`
        );
        return;
      }

      updateViewer(sessionId, cmd.userId, { role: 'ready' });
      await sendChatMessage(`✅ @${cmd.username} جاهز للعب!`);
    },
    requiresSession: true,
  });

  // !vote - Vote for something (game-specific)
  registerCommand({
    command: 'vote',
    description: 'Vote for an option (usage: !vote <option>)',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      if (cmd.args.length === 0) {
        await sendChatMessage(
          `@${cmd.username} استخدم !vote <option> للتصويت`
        );
        return;
      }

      const session = getGameSession(sessionId);
      if (!session) return;

      const viewer = session.viewers.get(cmd.userId);
      if (!viewer) {
        await sendChatMessage(
          `@${cmd.username} يجب أن تنضم إلى اللعبة أولاً!`
        );
        return;
      }

      const option = cmd.args[0];
      updateViewer(sessionId, cmd.userId, { role: option });
      await sendChatMessage(`✅ @${cmd.username} صوت لـ: ${option}`);
    },
    requiresSession: true,
  });

  // !answer - Submit answer (for trivia game)
  registerCommand({
    command: 'answer',
    description: 'Submit an answer (usage: !answer <answer>)',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      if (cmd.args.length === 0) {
        await sendChatMessage(
          `@${cmd.username} استخدم !answer <إجابتك>`
        );
        return;
      }

      const session = getGameSession(sessionId);
      if (!session) return;

      const viewer = session.viewers.get(cmd.userId);
      if (!viewer) {
        await sendChatMessage(
          `@${cmd.username} يجب أن تنضم إلى اللعبة أولاً!`
        );
        return;
      }

      const answer = cmd.args.join(' ').toLowerCase();
      updateViewer(sessionId, cmd.userId, { role: `answer_${answer}` });
      await sendChatMessage(`✅ @${cmd.username} أرسلت الإجابة!`);
    },
    requiresSession: true,
  });

  // !skip - Skip current round
  registerCommand({
    command: 'skip',
    description: 'Request to skip current round',
    handler: async (cmd: ChatCommand, sessionId: string) => {
      const session = getGameSession(sessionId);
      if (!session) return;

      const viewer = session.viewers.get(cmd.userId);
      if (!viewer) {
        await sendChatMessage(
          `@${cmd.username} يجب أن تنضم إلى اللعبة أولاً!`
        );
        return;
      }

      await sendChatMessage(`⏭️ @${cmd.username} طلب تخطي الجولة`);
    },
    requiresSession: true,
  });

  // !help - Show available commands
  registerCommand({
    command: 'help',
    description: 'Show available commands',
    handler: async () => {
      const commands = Array.from(commandHandlers.values());
      const commandList = commands.map(c => `!${c.command}`).join(', ');
      await sendChatMessage(`📋 الأوامر المتاحة: ${commandList}`);
    },
    requiresSession: false,
  });

  // !players - Show number of players
  registerCommand({
    command: 'players',
    description: 'Show number of players in game',
    handler: async (_cmd: ChatCommand, sessionId: string) => {
      const session = getGameSession(sessionId);
      if (!session) {
        await sendChatMessage(`ℹ️ لا توجد لعبة نشطة حالياً.`);
        return;
      }

      await sendChatMessage(
        `👥 اللاعبون الحاليون: ${session.viewers.size}`
      );
    },
    requiresSession: false,
  });

  console.log('✓ Default commands registered');
}

/**
 * Get all registered commands
 */
export function getRegisteredCommands(): CommandHandler[] {
  return Array.from(commandHandlers.values());
}

/**
 * Get command handler
 */
export function getCommandHandler(command: string): CommandHandler | undefined {
  return commandHandlers.get(command.toLowerCase());
}
