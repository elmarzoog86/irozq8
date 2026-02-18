import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/twitch-sessions';

/**
 * Diagnostic endpoint to check if chat token is valid and Twitch API responds
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session');

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Missing sessionId' },
      { status: 400 }
    );
  }

  try {
    console.log(`🔍 [DIAGNOSTIC] Checking session: ${sessionId}`);

    // Get the session
    const session = getSession(sessionId);
    if (!session) {
      console.error('❌ [DIAGNOSTIC] Session not found');
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    console.log(`✅ [DIAGNOSTIC] Session found for user: ${session.user?.login}`);
    console.log(`   Token present: ${!!session.accessToken}`);
    console.log(`   Token length: ${session.accessToken?.length}`);

    // Try to validate the token by calling Twitch API
    console.log(`🔗 [DIAGNOSTIC] Validating token with Twitch API...`);

    const validateResponse = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: {
        'Authorization': `OAuth ${session.accessToken}`,
      },
    });

    console.log(`   Validation response status: ${validateResponse.status}`);

    if (validateResponse.ok) {
      const validation = await validateResponse.json();
      console.log(`✅ [DIAGNOSTIC] Token is valid!`);
      console.log(`   Scopes: ${validation.scopes?.join(', ')}`);
      console.log(`   User ID: ${validation.user_id}`);

      // Check if token has required scopes for chat
      const hasRequiredScopes = validation.scopes?.includes('chat:read') && 
                                validation.scopes?.includes('user:read:email');
      console.log(`   Has chat:read scope: ${validation.scopes?.includes('chat:read')}`);
      console.log(`   Has user:read:email scope: ${validation.scopes?.includes('user:read:email')}`);

      return NextResponse.json({
        success: true,
        token: 'valid',
        user: session.user?.login,
        channel: session.user?.login,
        scopes: validation.scopes,
        userId: validation.user_id,
        hasRequiredScopes,
        message: hasRequiredScopes 
          ? '✅ Token is valid and has all required scopes for chat'
          : '⚠️  Token is valid but may be missing some required scopes'
      });
    } else {
      const error = await validateResponse.json();
      console.error(`❌ [DIAGNOSTIC] Token validation failed:`, error);
      return NextResponse.json(
        { 
          success: false, 
          token: 'invalid',
          error: error.message,
          details: error
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ [DIAGNOSTIC] Error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
