import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/twitch-sessions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');

    if (sessionId) {
      deleteSession(sessionId);
    }

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
