import { NextResponse } from 'next/server';
import { storeSession } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;

/**
 * GET /api/twitch/callback - Handle Twitch OAuth callback
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('OAuth Callback received:', { code: code ? 'present' : 'missing', state: state ? 'present' : 'missing', error, errorDescription });

    // Check for errors from Twitch
    if (error) {
      console.error('Twitch OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/twitch/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate we have required parameters
    if (!code) {
      console.error('Missing authorization code');
      return NextResponse.redirect(
        new URL('/twitch/login?error=missing_code', request.url)
      );
    }

    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_REDIRECT_URI) {
      console.error('Missing environment variables:', { 
        clientId: TWITCH_CLIENT_ID ? 'present' : 'missing',
        clientSecret: TWITCH_CLIENT_SECRET ? 'present' : 'missing',
        redirectUri: TWITCH_REDIRECT_URI ? 'present' : 'missing'
      });
      return NextResponse.redirect(
        new URL('/twitch/login?error=config_error', request.url)
      );
    }

    // Exchange code for access token
    console.log('Exchanging code for token...');
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: TWITCH_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange failed:', error);
      return NextResponse.redirect(
        new URL('/twitch/login?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error('No access token in response');
      return NextResponse.redirect(
        new URL('/twitch/login?error=no_access_token', request.url)
      );
    }

    console.log('Got access token, fetching user info...');

    // Get user info
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.json();
      console.error('Failed to get user info:', error);
      return NextResponse.redirect(
        new URL('/twitch/login?error=failed_to_get_user', request.url)
      );
    }

    const userData = await userResponse.json();
    const user = userData.data?.[0];

    if (!user) {
      console.error('No user data returned');
      return NextResponse.redirect(
        new URL('/twitch/login?error=no_user_data', request.url)
      );
    }

    console.log('Successfully authenticated user:', user.login);

    // Generate session ID
    const sessionId = Math.random().toString(36).substring(2, 15);

    console.log(`🔐 [CALLBACK] Generated sessionId: ${sessionId}`);
    console.log(`🔐 [CALLBACK] About to store session with data:`, {
      user: user.login,
      accessToken: '***',
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    });

    // Store session data (in production, use database with TTL)
    storeSession(sessionId, {
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

    console.log(`✅ [CALLBACK] Session stored successfully`);

    // Create response with redirect to home page (where games are displayed)
    const response = NextResponse.redirect(
      new URL(`/?session=${sessionId}`, request.url)
    );

    console.log(`🔄 [CALLBACK] Redirecting to: /?session=${sessionId}`);

    // Set secure session cookie
    response.cookies.set('twitch_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Twitch OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/twitch/login?error=internal_error', request.url)
    );
  }
}
