#!/usr/bin/env node

/**
 * Automated test to verify Twitch chat integration flow
 * This script simulates the entire flow without needing browser interaction
 */

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  console.log('🚀 Starting Twitch Chat Integration Test\n');

  try {
    // Step 1: Create a mock session
    console.log('Step 1: Creating a mock session...');
    
    // We need to hit the OAuth callback endpoint
    // For testing, we'll call a debug endpoint to create a session
    const sessionResponse = await fetch(`${BASE_URL}/api/debug/create-test-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!sessionResponse.ok) {
      console.error('❌ Failed to create session:', sessionResponse.status);
      return;
    }

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.sessionId;
    console.log(`✅ Session created: ${sessionId}\n`);

    // Step 2: Call the games page with the session
    console.log('Step 2: Loading games page...');
    const gamesResponse = await fetch(`${BASE_URL}/games?id=questions&session=${sessionId}`);
    
    if (!gamesResponse.ok) {
      console.error('❌ Failed to load games page:', gamesResponse.status);
      return;
    }
    
    console.log(`✅ Games page loaded\n`);

    // Step 3: Wait a bit for React to render and hook to initialize
    console.log('Step 3: Waiting for hook to initialize...');
    await sleep(2000);

    // Step 4: Try calling the chat-token endpoint directly to verify it works
    console.log('Step 4: Testing chat-token endpoint...');
    const chatTokenResponse = await fetch(
      `${BASE_URL}/api/twitch/chat-token?action=connect&session=${sessionId}`
    );

    if (!chatTokenResponse.ok) {
      console.error(`❌ Chat-token endpoint failed: ${chatTokenResponse.status}`);
      const errorData = await chatTokenResponse.json();
      console.error('   Error:', errorData);
      return;
    }

    const chatTokenData = await chatTokenResponse.json();
    console.log('✅ Chat-token endpoint working');
    console.log('   Response:', {
      success: chatTokenData.success,
      channel: chatTokenData.channel,
      userName: chatTokenData.userName,
      hasAccessToken: !!chatTokenData.accessToken,
    });
    console.log();

    // Step 5: Check debug endpoint calls
    console.log('Step 5: Checking debug logs...');
    const debugLogsResponse = await fetch(`${BASE_URL}/api/debug/get-logs`);
    
    if (debugLogsResponse.ok) {
      const logs = await debugLogsResponse.json();
      console.log('📋 Recent server logs:');
      logs.slice(-10).forEach(log => console.log('   ', log));
    }

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();
