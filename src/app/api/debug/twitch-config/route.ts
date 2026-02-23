import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const redirectUri = process.env.TWITCH_REDIRECT_URI;
  
  console.log('=== TWITCH AUTH TEST ===');
  console.log('Client ID:', clientId);
  console.log('Redirect URI:', redirectUri);
  console.log('Client ID Length:', clientId?.length);
  console.log('Redirect URI Length:', redirectUri?.length);
  
  return NextResponse.json({
    clientId,
    redirectUri,
    clientIdLength: clientId?.length,
    redirectUriLength: redirectUri?.length,
    clientIdSet: !!clientId,
    redirectUriSet: !!redirectUri,
  });
}
