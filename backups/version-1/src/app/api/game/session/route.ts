import { NextResponse } from 'next/server';
import {
  createGameSession,
  getGameSession,
  getStreamerGame,
  getAllActiveSessions,
  addViewerToSession,
  removeViewerFromSession,
  updateSessionStatus,
  getLeaderboard,
  endGameSession,
} from '@/lib/game-state';

/**
 * POST /api/game/session
 * Create a new game session or get existing session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, streamerId, streamerName, gameId, sessionId } = body;

    if (action === 'create') {
      const session = createGameSession(streamerId, streamerName, gameId);
      return NextResponse.json({
        success: true,
        sessionId: session.sessionId,
        session,
      });
    }

    if (action === 'join') {
      const { username, userId } = body;
      const success = addViewerToSession(sessionId, username, userId);
      
      if (!success) {
        return NextResponse.json(
          { success: false, error: 'Failed to join session' },
          { status: 400 }
        );
      }

      const session = getGameSession(sessionId);
      return NextResponse.json({
        success: true,
        viewers: Array.from(session?.viewers.values() || []),
      });
    }

    if (action === 'leave') {
      const { userId } = body;
      removeViewerFromSession(sessionId, userId);

      const session = getGameSession(sessionId);
      return NextResponse.json({
        success: true,
        viewers: Array.from(session?.viewers.values() || []),
      });
    }

    if (action === 'update-status') {
      const { status } = body;
      updateSessionStatus(sessionId, status);

      const session = getGameSession(sessionId);
      return NextResponse.json({ success: true, session });
    }

    if (action === 'end') {
      endGameSession(sessionId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Game session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/game/session
 * Get game session details
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const streamerId = searchParams.get('streamerId');
    const action = searchParams.get('action');

    if (action === 'get') {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: 'sessionId required' },
          { status: 400 }
        );
      }

      const session = getGameSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        session: {
          sessionId: session.sessionId,
          gameId: session.gameId,
          status: session.status,
          streamerId: session.streamerId,
          streamerName: session.streamerName,
          viewerCount: session.viewers.size,
          viewers: Array.from(session.viewers.values()),
          createdAt: session.createdAt,
          startedAt: session.startedAt,
        },
      });
    }

    if (action === 'get-streamer-game') {
      if (!streamerId) {
        return NextResponse.json(
          { success: false, error: 'streamerId required' },
          { status: 400 }
        );
      }

      const session = getStreamerGame(streamerId);
      if (!session) {
        return NextResponse.json({
          success: true,
          session: null,
        });
      }

      return NextResponse.json({
        success: true,
        session: {
          sessionId: session.sessionId,
          gameId: session.gameId,
          status: session.status,
          viewerCount: session.viewers.size,
        },
      });
    }

    if (action === 'get-all-active') {
      const sessions = getAllActiveSessions();
      return NextResponse.json({
        success: true,
        sessions: sessions.map(s => ({
          sessionId: s.sessionId,
          gameId: s.gameId,
          streamerName: s.streamerName,
          viewerCount: s.viewers.size,
          status: s.status,
        })),
      });
    }

    if (action === 'leaderboard') {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: 'sessionId required' },
          { status: 400 }
        );
      }

      const leaderboard = getLeaderboard(sessionId);
      return NextResponse.json({
        success: true,
        leaderboard,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Game session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
