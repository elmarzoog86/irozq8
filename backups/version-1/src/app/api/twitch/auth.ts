import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI || 'http://localhost:3000/api/twitch/callback';

// Store active sessions
const twitchSessions = new Map();
const twitchTokens = new Map();

/**
 * GET /api/twitch/login - Redirect to Twitch OAuth
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Login - redirect to Twitch OAuth
    if (action === 'login') {
      const state = Math.random().toString(36).substring(7);
      twitchSessions.set(state, { createdAt: Date.now() });

      const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
      authUrl.searchParams.append('client_id', TWITCH_CLIENT_ID!);
      authUrl.searchParams.append('redirect_uri', TWITCH_REDIRECT_URI);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', 'user:read:email user:read:chat chat:read');
      authUrl.searchParams.append('state', state);

      return NextResponse.redirect(authUrl.toString());
    }

    // Callback - handle OAuth code
    if (action === 'callback') {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state || !twitchSessions.has(state)) {
        return NextResponse.json(
          { success: false, error: 'Invalid state or code' },
          { status: 400 }
        );
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: TWITCH_CLIENT_ID!,
          client_secret: TWITCH_CLIENT_SECRET!,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: TWITCH_REDIRECT_URI,
        }).toString(),
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        return NextResponse.json(
          { success: false, error: 'Failed to get access token' },
          { status: 400 }
        );
      }

      // Get user info
      const userResponse = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      const userData = await userResponse.json();
      const user = userData.data?.[0];

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Failed to get user info' },
          { status: 400 }
        );
      }

      // Store session
      const sessionId = Math.random().toString(36).substring(7);
      twitchTokens.set(sessionId, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + (tokens.expires_in * 1000),
        user: {
          id: user.id,
          login: user.login,
          displayName: user.display_name,
          profileImageUrl: user.profile_image_url,
          email: user.email,
        }
      });

      twitchSessions.delete(state);

      // Return redirect with session token
      const response = NextResponse.redirect(
        new URL(`/twitch/dashboard?session=${sessionId}`, request.url)
      );
      response.cookies.set('twitch_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // Get current user info
    if (action === 'user') {
      const session = searchParams.get('session');
      const tokenData = twitchTokens.get(session);

      if (!tokenData) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: tokenData.user,
      });
    }

    // Logout
    if (action === 'logout') {
      const session = searchParams.get('session');
      twitchTokens.delete(session);

      const response = NextResponse.json({ success: true });
      response.cookies.delete('twitch_session');
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Twitch OAuth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/twitch - Handle game events
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId, gameId } = body;

    const tokenData = twitchTokens.get(sessionId);
    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Action: send message to chat
    if (action === 'send-chat') {
      const message = body.message;
      // This would be handled by the chat service
      console.log(`Chat message from ${tokenData.user.login}: ${message}`);

      return NextResponse.json({
        success: true,
        message: 'Message sent to chat',
      });
    }

    // Action: update game status
    if (action === 'update-game') {
      return NextResponse.json({
        success: true,
        gameStatus: {
          gameId,
          status: body.status,
          players: body.players || [],
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
