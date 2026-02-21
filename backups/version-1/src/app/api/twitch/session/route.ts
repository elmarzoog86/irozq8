import { NextResponse, NextRequest } from 'next/server';
import { getSession, deleteSession } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sessionParam = searchParams.get('session');
    
    console.log(`📋 [SESSION ENDPOINT] Called with action: ${action}, sessionParam: ${sessionParam}`);
    
    // Try to get session from parameter or cookie
    const session = sessionParam || request.cookies.get('twitch_session')?.value;

    console.log(`   Session to retrieve: ${session}`);

    if (action === 'user') {
      if (!session) {
        console.log(`   ❌ No session provided (neither param nor cookie)`);
        return NextResponse.json(
          { success: false, error: 'No session' },
          { status: 401 }
        );
      }

      console.log(`   🔍 Looking up session: ${session}`);
      const sessionData = getSession(session);
      if (!sessionData) {
        console.log(`   ❌ Session data not found!`);
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }

      console.log(`   ✅ Session found, returning user data`);

      // Include access token if requested or if for chat connection
      const includeToken = searchParams.get('includeToken') === 'true' || searchParams.get('chat') === 'true';
      
      return NextResponse.json({
        success: true,
        user: sessionData.user,
        ...(includeToken && { accessToken: sessionData.accessToken }),
      });
    }

    if (action === 'logout') {
      if (session) {
        deleteSession(session);
      }

      const response = NextResponse.json({ success: true });
      response.cookies.delete('twitch_session');
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
