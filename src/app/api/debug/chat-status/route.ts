import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

/**
 * GET /api/debug/chat-status
 * Diagnostic endpoint to check chat integration status
 * Used for debugging why chat messages aren't displaying
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');

    if (!sessionId) {
      return NextResponse.json({
        status: 'error',
        message: 'No session parameter provided',
        sessionId: null,
        sessionExists: false,
        sessionData: null,
      }, { status: 400 });
    }

    const sessionData = getSession(sessionId);
    
    if (!sessionData) {
      return NextResponse.json({
        status: 'error',
        message: 'Session not found in backend storage',
        sessionId: sessionId,
        sessionExists: false,
        sessionData: null,
      }, { status: 401 });
    }

    // If we get here, session exists and is valid
    return NextResponse.json({
      status: 'ok',
      message: 'Session is valid and chat should work',
      sessionId: sessionId,
      sessionExists: true,
      sessionData: {
        channel: sessionData.user.login,
        userName: sessionData.user.displayName,
        userId: sessionData.user.id,
        hasAccessToken: !!sessionData.accessToken,
        createdAt: sessionData.createdAt, // If you track this
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Chat debug error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      error: String(error),
    }, { status: 500 });
  }
}
