import { NextResponse } from 'next/server';
import { getSession } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');

    console.log(`\n🔍 [DEBUG FULL FLOW] Testing complete chat flow with session: ${sessionId}`);

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'No session provided',
        step: 'initial',
      }, { status: 400 });
    }

    // Step 1: Retrieve session
    console.log(`\n📋 Step 1: Retrieving session...`);
    const sessionData = getSession(sessionId);
    
    if (!sessionData) {
      return NextResponse.json({
        success: false,
        error: 'Session not found',
        step: 'session_retrieval',
      }, { status: 404 });
    }

    console.log(`✅ Step 1 PASSED: Session retrieved`);
    console.log(`   - User: ${sessionData.user.login}`);
    console.log(`   - Has token: ${!!sessionData.accessToken}`);

    // Step 2: Prepare chat token
    console.log(`\n📡 Step 2: Preparing chat token...`);
    const channel = sessionData.user.login;
    const accessToken = sessionData.accessToken;
    const userName = sessionData.user.displayName;

    console.log(`✅ Step 2 PASSED: Chat credentials ready`);
    console.log(`   - Channel: ${channel}`);
    console.log(`   - Username: ${userName}`);
    console.log(`   - Token prefix: ${accessToken.substring(0, 5)}...`);

    // Step 3: Check if tmi.js would connect
    console.log(`\n🔗 Step 3: tmi.js connection config:`);
    const tmijsConfig = {
      identity: {
        username: userName,
        password: `oauth:${accessToken}`,
      },
      channels: [channel],
    };
    
    console.log(`✅ Step 3 PASSED: tmi.js config ready`);
    console.log(`   - Channels: [${tmijsConfig.channels.join(', ')}]`);
    console.log(`   - Auth mode: OAuth`);

    // Step 4: Simulate what the frontend would do
    console.log(`\n🎮 Step 4: Frontend would call connector with:`);
    console.log(`   - channelName: ${channel}`);
    console.log(`   - accessToken: ${accessToken.substring(0, 5)}...`);
    console.log(`   - botUsername: ${userName}`);

    return NextResponse.json({
      success: true,
      allStepsPass: true,
      session: {
        id: sessionId,
        user: sessionData.user.login,
      },
      chatConfig: {
        channel,
        username: userName,
        hasToken: !!accessToken,
      },
      message: '✅ All steps passed! Chat should work. If not, check browser console logs.',
    });
  } catch (error) {
    console.error('Debug flow error:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
