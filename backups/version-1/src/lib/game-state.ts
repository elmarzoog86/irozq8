/**
 * Game State Management
 * Centralized state for active games and viewers
 */

export interface Viewer {
  username: string;
  userId: string;
  joinedAt: Date;
  isActive: boolean;
  role?: string;
  score?: number;
}

export interface GameSession {
  sessionId: string;
  streamerId: string;
  streamerName: string;
  gameId: string;
  status: 'lobby' | 'starting' | 'active' | 'finished';
  viewers: Map<string, Viewer>;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  currentRound?: number;
  scores: Map<string, number>;
  gameData: any;
}

export interface ChatCommand {
  command: string;
  username: string;
  userId: string;
  args: string[];
  timestamp: Date;
}

// Global game sessions storage (in production, use Redis or database)
const gameSessions = new Map<string, GameSession>();
const streamerGames = new Map<string, string>(); // streamer_id -> session_id

/**
 * Create a new game session
 */
export function createGameSession(
  streamerId: string,
  streamerName: string,
  gameId: string
): GameSession {
  const sessionId = `game_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  const session: GameSession = {
    sessionId,
    streamerId,
    streamerName,
    gameId,
    status: 'lobby',
    viewers: new Map(),
    createdAt: new Date(),
    scores: new Map(),
    gameData: {},
  };

  gameSessions.set(sessionId, session);
  streamerGames.set(streamerId, sessionId);

  console.log(`✓ Game session created: ${sessionId} (${gameId} by ${streamerName})`);
  return session;
}

/**
 * Get game session by ID
 */
export function getGameSession(sessionId: string): GameSession | undefined {
  return gameSessions.get(sessionId);
}

/**
 * Get active game for a streamer
 */
export function getStreamerGame(streamerId: string): GameSession | undefined {
  const sessionId = streamerGames.get(streamerId);
  return sessionId ? gameSessions.get(sessionId) : undefined;
}

/**
 * Get all active games
 */
export function getAllActiveSessions(): GameSession[] {
  return Array.from(gameSessions.values()).filter(s => s.status !== 'finished');
}

/**
 * Add viewer to game session
 */
export function addViewerToSession(
  sessionId: string,
  username: string,
  userId: string
): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  const viewer: Viewer = {
    username,
    userId,
    joinedAt: new Date(),
    isActive: true,
  };

  session.viewers.set(userId, viewer);
  if (!session.scores.has(userId)) {
    session.scores.set(userId, 0);
  }

  console.log(`✓ Viewer added: ${username} to session ${sessionId}`);
  return true;
}

/**
 * Remove viewer from session
 */
export function removeViewerFromSession(sessionId: string, userId: string): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  session.viewers.delete(userId);
  console.log(`✓ Viewer removed from session ${sessionId}`);
  return true;
}

/**
 * Update viewer in session
 */
export function updateViewer(
  sessionId: string,
  userId: string,
  updates: Partial<Viewer>
): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  const viewer = session.viewers.get(userId);
  if (!viewer) return false;

  Object.assign(viewer, updates);
  return true;
}

/**
 * Update session status
 */
export function updateSessionStatus(
  sessionId: string,
  status: GameSession['status']
): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  const oldStatus = session.status;
  session.status = status;

  if (status === 'active' && !session.startedAt) {
    session.startedAt = new Date();
  }
  if (status === 'finished' && !session.endedAt) {
    session.endedAt = new Date();
  }

  console.log(`✓ Session ${sessionId} status: ${oldStatus} → ${status}`);
  return true;
}

/**
 * Update viewer score
 */
export function updateViewerScore(
  sessionId: string,
  userId: string,
  scoreChange: number
): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  const currentScore = session.scores.get(userId) || 0;
  session.scores.set(userId, currentScore + scoreChange);
  return true;
}

/**
 * Get leaderboard for session
 */
export function getLeaderboard(sessionId: string): Array<{ username: string; score: number }> {
  const session = gameSessions.get(sessionId);
  if (!session) return [];

  const leaderboard: Array<{ username: string; score: number }> = [];

  session.scores.forEach((score, userId) => {
    const viewer = session.viewers.get(userId);
    if (viewer) {
      leaderboard.push({ username: viewer.username, score });
    }
  });

  return leaderboard.sort((a, b) => b.score - a.score);
}

/**
 * Update game data
 */
export function updateGameData(sessionId: string, data: any): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  session.gameData = { ...session.gameData, ...data };
  return true;
}

/**
 * End game session
 */
export function endGameSession(sessionId: string): boolean {
  const session = gameSessions.get(sessionId);
  if (!session) return false;

  updateSessionStatus(sessionId, 'finished');
  streamerGames.delete(session.streamerId);

  // Keep session data for 1 hour before cleanup
  setTimeout(() => {
    gameSessions.delete(sessionId);
  }, 3600000);

  return true;
}

/**
 * Clear all sessions (for development/testing)
 */
export function clearAllSessions(): void {
  gameSessions.clear();
  streamerGames.clear();
  console.log('✓ All game sessions cleared');
}
