import { NextRequest, NextResponse } from 'next/server';

/**
 * Simulate a chat message for testing
 * POST /api/debug/simulate-chat-message?session=ABC&message=test
 */
export async function POST(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session');
  const message = request.nextUrl.searchParams.get('message') || 'test answer';
  const username = request.nextUrl.searchParams.get('username') || 'test_viewer';

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  console.log(`\n🧪 ========== SIMULATING CHAT MESSAGE ==========`);
  console.log(`   Session: ${sessionId}`);
  console.log(`   From: ${username}`);
  console.log(`   Message: "${message}"`);
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log(`🧪 This message should trigger the onMessage callback on the client`);
  console.log(`🧪 If you don't see client-side logs, check browser console (F12)`);
  console.log(`🧪 The game component should process this answer if Questions game is running`);
  console.log(`🧪 ==========================================\n`);

  return NextResponse.json({
    success: true,
    message: 'Simulated message logged to server. Check console for details.',
    details: {
      sessionId,
      username,
      message,
      timestamp: new Date().toISOString(),
      note: 'This endpoint logs to server. Real tmi.js socket message would come from Twitch directly.'
    }
  });
}
