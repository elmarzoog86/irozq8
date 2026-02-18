import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Comprehensive logging endpoint to trace the chat flow
 * Call this when game is running to see real-time status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session');

  if (!sessionId) {
    return NextResponse.json({ error: 'No sessionId provided' }, { status: 400 });
  }

  console.log(`\n\n🔍🔍🔍 [CHAT FLOW TRACE] Starting comprehensive trace for session: ${sessionId} 🔍🔍🔍\n`);

  try {
    // Step 1: Check if session file exists
    console.log(`\n📋 STEP 1: Check session file existence`);
    const fs = await import('fs');
    const path = await import('path');
    const SESSIONS_DIR = path.join(process.cwd(), '.sessions');
    const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    
    console.log(`   Session file path: ${sessionPath}`);
    const fileExists = fs.existsSync(sessionPath);
    console.log(`   File exists: ${fileExists ? '✅ YES' : '❌ NO'}`);

    if (!fileExists) {
      console.log(`   ❌ Session file not found!`);
      return NextResponse.json({
        status: 'BROKEN',
        step: 'session_file_missing',
        message: 'Session file not found in .sessions directory',
      });
    }

    // Step 2: Read session file
    console.log(`\n📖 STEP 2: Read session file`);
    const sessionContent = fs.readFileSync(sessionPath, 'utf-8');
    const sessionData = JSON.parse(sessionContent);
    console.log(`   ✅ Session file read and parsed`);
    console.log(`   User: ${sessionData.user?.login}`);
    console.log(`   Has access token: ${!!sessionData.accessToken}`);
    console.log(`   Token prefix: ${sessionData.accessToken?.substring(0, 10)}...`);

    // Step 3: Simulate what chat-token endpoint would do
    console.log(`\n🎫 STEP 3: Simulate /api/twitch/chat-token endpoint`);
    const channel = sessionData.user?.login;
    const accessToken = sessionData.accessToken;
    const userName = sessionData.user?.displayName;
    
    if (!channel || !accessToken || !userName) {
      console.log(`   ❌ Missing required data!`);
      console.log(`   Channel: ${channel}`);
      console.log(`   Token: ${!!accessToken}`);
      console.log(`   Username: ${userName}`);
      return NextResponse.json({
        status: 'BROKEN',
        step: 'missing_session_data',
        message: 'Session missing required fields',
      });
    }

    console.log(`   ✅ All data present for chat connection`);
    console.log(`   Channel: ${channel}`);
    console.log(`   Username: ${userName}`);
    console.log(`   Token: ${accessToken.substring(0, 10)}...`);

    // Step 4: Check TMI.js configuration
    console.log(`\n🔧 STEP 4: TMI.js configuration would be:`);
    const config = {
      identity: {
        username: userName,
        password: `oauth:${accessToken}`,
      },
      channels: [channel],
    };
    console.log(`   Channels: [${config.channels.join(', ')}]`);
    console.log(`   Auth mode: OAuth`);
    console.log(`   Has password: ${!!config.identity.password}`);

    // Step 5: Check if token is valid (basic validation)
    console.log(`\n🔐 STEP 5: Token validation`);
    if (accessToken.length < 20) {
      console.log(`   ⚠️ Warning: Token looks too short (${accessToken.length} chars)`);
    } else {
      console.log(`   ✅ Token length looks valid (${accessToken.length} chars)`);
    }

    console.log(`\n✅✅✅ [FLOW CHECK COMPLETE] Everything looks correct! 🚀\n`);

    return NextResponse.json({
      status: 'OK',
      message: 'All checks passed! Chat flow should work.',
      sessionData: {
        channel,
        userName,
        hasAccessToken: !!accessToken,
        tokenLength: accessToken.length,
      },
    });

  } catch (error) {
    console.error(`❌ Error during trace:`, error);
    return NextResponse.json({
      status: 'ERROR',
      error: String(error),
    }, { status: 500 });
  }
}
