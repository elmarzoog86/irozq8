import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/twitch/auth-url
 * Generate Twitch OAuth authorization URL
 * This endpoint is called by the frontend to get the OAuth URL
 */
export async function GET() {
  try {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;

    console.log(`🔐 [AUTH-URL] Generating Twitch OAuth URL`);
    console.log(`   Client ID: ${TWITCH_CLIENT_ID ? 'set' : 'MISSING'}`);
    console.log(`   Redirect URI: ${TWITCH_REDIRECT_URI ? 'set' : 'MISSING'}`);

    if (!TWITCH_CLIENT_ID || !TWITCH_REDIRECT_URI) {
      console.error('❌ Missing required environment variables');
      return NextResponse.json({
        success: false,
        error: 'Twitch configuration missing'
      }, { status: 500 });
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);

    // Build OAuth URL
    const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
    authUrl.searchParams.append('client_id', TWITCH_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', TWITCH_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'user:read:email user:read:chat chat:read analytics:read:extensions');
    authUrl.searchParams.append('state', state);

    console.log(`✅ [AUTH-URL] Generated OAuth URL`);
    console.log(`   Redirect to: ${TWITCH_REDIRECT_URI}`);

    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString()
    });
  } catch (error) {
    console.error('❌ [AUTH-URL] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
