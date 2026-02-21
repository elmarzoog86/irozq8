import { NextResponse } from 'next/server';
import { storeSession } from '@/lib/twitch-sessions';

/**
 * Create a test session for debugging without OAuth
 */
export async function POST() {
  const testSessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create mock session data
  const mockSessionData = {
    user: {
      id: '12345',
      login: 'test_user',
      displayName: 'Test User',
    },
    accessToken: 'mock_access_token_' + Math.random().toString(36).substr(2, 20),
    refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substr(2, 20),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };

  try {
    storeSession(testSessionId, mockSessionData);
    console.log(`🧪 [TEST SESSION] Created: ${testSessionId}`);
    
    return NextResponse.json({
      success: true,
      sessionId: testSessionId,
      message: 'Test session created',
    });
  } catch (error) {
    console.error('❌ [TEST SESSION] Failed to create:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
