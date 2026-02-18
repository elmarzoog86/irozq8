/**
 * Real-time Game Sync Utilities
 * Handles syncing game state between server and client
 */

/**
 * Poll for game state updates
 * Returns game session state at regular intervals
 */
export async function pollGameState(
  sessionId: string,
  onUpdate: (state: any) => void,
  intervalMs: number = 1000
): Promise<() => void> {
  let isActive = true;

  const poll = async () => {
    try {
      const response = await fetch(
        `/api/game/session?action=get&sessionId=${sessionId}`
      );
      const data = await response.json();

      if (data.success && isActive) {
        onUpdate(data.session);
      }
    } catch (error) {
      console.error('Error polling game state:', error);
    }

    if (isActive) {
      setTimeout(poll, intervalMs);
    }
  };

  // Start polling
  poll();

  // Return unsubscribe function
  return () => {
    isActive = false;
  };
}

/**
 * Get live leaderboard
 */
export async function getGameLeaderboard(sessionId: string) {
  try {
    const response = await fetch(
      `/api/game/session?action=leaderboard&sessionId=${sessionId}`
    );
    const data = await response.json();
    return data.success ? data.leaderboard : [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Join a game session
 */
export async function joinGameSession(
  sessionId: string,
  username: string,
  userId: string
) {
  try {
    const response = await fetch('/api/game/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        sessionId,
        username,
        userId,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error joining game session:', error);
    return false;
  }
}

/**
 * Leave a game session
 */
export async function leaveGameSession(sessionId: string, userId: string) {
  try {
    const response = await fetch('/api/game/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'leave',
        sessionId,
        userId,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error leaving game session:', error);
    return false;
  }
}

/**
 * Create a new game session
 */
export async function createNewGameSession(
  streamerId: string,
  streamerName: string,
  gameId: string
) {
  try {
    const response = await fetch('/api/game/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        streamerId,
        streamerName,
        gameId,
      }),
    });

    const data = await response.json();
    return data.success ? data.sessionId : null;
  } catch (error) {
    console.error('Error creating game session:', error);
    return null;
  }
}

/**
 * End a game session
 */
export async function endGameSession(sessionId: string) {
  try {
    const response = await fetch('/api/game/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'end',
        sessionId,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error ending game session:', error);
    return false;
  }
}

/**
 * Send a chat command in a game session
 */
export async function sendChatCommandToGame(
  sessionId: string,
  username: string,
  userId: string,
  command: string
) {
  try {
    const response = await fetch('/api/game/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        username,
        userId,
        message: command,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending command:', error);
    return false;
  }
}

/**
 * Get active game for a streamer
 */
export async function getStreamerActiveGame(streamerId: string) {
  try {
    const response = await fetch(
      `/api/game/session?action=get-streamer-game&streamerId=${streamerId}`
    );
    const data = await response.json();
    return data.success ? data.session : null;
  } catch (error) {
    console.error('Error fetching streamer game:', error);
    return null;
  }
}

/**
 * Get all active games
 */
export async function getAllActiveGames() {
  try {
    const response = await fetch(
      '/api/game/session?action=get-all-active'
    );
    const data = await response.json();
    return data.success ? data.sessions : [];
  } catch (error) {
    console.error('Error fetching active games:', error);
    return [];
  }
}
