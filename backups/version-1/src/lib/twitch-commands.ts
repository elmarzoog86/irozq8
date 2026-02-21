/**
 * Twitch Chat Commands Handler
 * Handles game-related commands from chat
 */

interface GameCommand {
  command: string;
  description: string;
  usage: string;
  execute: (args: string[], username: string) => Promise<string>;
}

interface GameState {
  currentGame: string;
  isRunning: boolean;
  players: { username: string; score: number }[];
  questionsCount?: number;
}

// Game state (would be shared with main game)
let gameState: GameState = {
  currentGame: 'none',
  isRunning: false,
  players: [],
};

// Command handlers
const commands: Map<string, GameCommand> = new Map();

/**
 * Register a command
 */
export function registerCommand(cmd: GameCommand) {
  commands.set(cmd.command.toLowerCase(), cmd);
}

/**
 * Initialize default commands
 */
export function initializeDefaultCommands() {
  // !join - Join the current game
  registerCommand({
    command: 'join',
    description: 'Join the current game',
    usage: '!join',
    execute: async (_, username: string) => {
      if (!gameState.isRunning) {
        return `❌ لا توجد لعبة قيد التشغيل حالياً`;
      }

      const exists = gameState.players.some(p => p.username === username);
      if (exists) {
        return `⚠️ ${username}, أنت بالفعل في اللعبة!`;
      }

      gameState.players.push({ username, score: 0 });
      return `✅ ${username} انضم إلى اللعبة! 🎮`;
    }
  });

  // !answer - Submit an answer (for questions game)
  registerCommand({
    command: 'answer',
    description: 'Submit an answer to the current question',
    usage: '!answer [your answer]',
    execute: async (args: string[], username: string) => {
      if (gameState.currentGame !== 'questions') {
        return `❌ هذا الأمر يعمل فقط في لعبة الأسئلة`;
      }

      if (args.length === 0) {
        return `⚠️ ${username}, يجب أن تكتب إجابة: !answer [الإجابة]`;
      }

      const answer = args.join(' ');
      return `📝 تم تسجيل إجابتك: "${answer}"`;
    }
  });

  // !score - Check your score
  registerCommand({
    command: 'score',
    description: 'Check your current score',
    usage: '!score',
    execute: async (_, username: string) => {
      const player = gameState.players.find(p => p.username === username);
      if (!player) {
        return `❌ أنت لم تنضم إلى اللعبة بعد. اكتب !join`;
      }

      return `⭐ ${username}: ${player.score} نقاط`;
    }
  });

  // !help - Show available commands
  registerCommand({
    command: 'help',
    description: 'Show available commands',
    usage: '!help',
    execute: async () => {
      let helpText = `\n🎮 **أوامر اللعبة المتاحة:**\n`;
      
      commands.forEach((cmd) => {
        helpText += `• **${cmd.usage}** - ${cmd.description}\n`;
      });

      return helpText;
    }
  });

  // !players - Show current players
  registerCommand({
    command: 'players',
    description: 'Show list of players in the current game',
    usage: '!players',
    execute: async () => {
      if (gameState.players.length === 0) {
        return `❌ لا يوجد لاعبون في اللعبة حالياً`;
      }

      const playerList = gameState.players
        .sort((a, b) => b.score - a.score)
        .map((p, i) => {
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '→';
          return `${medal} ${p.username} (${p.score} نقطة)`;
        })
        .join('\n');

      return `\n👥 **اللاعبون الحاليون:**\n${playerList}`;
    }
  });

  // !commands - List all commands
  registerCommand({
    command: 'commands',
    description: 'Show all available commands',
    usage: '!commands',
    execute: async () => {
      let cmds = `\n🎮 **الأوامر المتاحة:**\n`;
      commands.forEach((cmd) => {
        cmds += `• \`${cmd.usage}\` - ${cmd.description}\n`;
      });
      return cmds;
    }
  });
}

/**
 * Execute a command
 */
export async function executeCommand(
  commandStr: string,
  username: string
): Promise<string> {
  if (!commandStr.startsWith('!')) {
    return '';
  }

  const parts = commandStr.slice(1).split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = commands.get(commandName);
  if (!command) {
    return `❌ أمر غير معروف: ${commandName}. اكتب !help لمشاهدة الأوامر`;
  }

  try {
    return await command.execute(args, username);
  } catch (error) {
    console.error('Command execution error:', error);
    return `❌ حدث خطأ أثناء تنفيذ الأمر`;
  }
}

/**
 * Update game state
 */
export function updateGameState(newState: Partial<GameState>) {
  gameState = { ...gameState, ...newState };
}

/**
 * Get current game state
 */
export function getGameState(): GameState {
  return { ...gameState };
}

/**
 * Get list of all commands
 */
export function getAllCommands(): GameCommand[] {
  return Array.from(commands.values());
}

/**
 * Get command by name
 */
export function getCommand(name: string): GameCommand | undefined {
  return commands.get(name.toLowerCase());
}
