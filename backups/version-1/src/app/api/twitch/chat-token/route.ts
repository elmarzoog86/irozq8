import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

/**
 * GET /api/twitch/chat-token
 * Get auth token for Twitch chat connection (for frontend use only)
 * This is safer than exposing directly in session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');
    const action = searchParams.get('action');

    console.log(`🎫 [CHAT TOKEN] Requested with sessionId: ${sessionId}, action: ${action}`);

    if (!sessionId) {
      console.log(`   ❌ No session provided`);
      return NextResponse.json(
        { success: false, error: 'No session' },
        { status: 401 }
      );
    }

    console.log(`   🔍 Looking up session...`);
    const sessionData = getSession(sessionId);
    if (!sessionData) {
      console.log(`   ❌ Session not found!`);
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    console.log(`   ✅ Session found!`);

    // If requesting to connect to chat
    if (action === 'connect') {
      console.log(`   📡 Returning chat token for channel: ${sessionData.user.login}`);
      return NextResponse.json({
        success: true,
        channel: sessionData.user.login,
        accessToken: sessionData.accessToken,
        userName: sessionData.user.displayName,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Chat token error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
