import { NextResponse } from 'next/server';
import { storeSession, getSession, getAllSessions } from '@/lib/twitch-sessions';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('\n🧪 [TEST SESSION] Starting test...');
  
  // Test 1: Store a session
  const testSessionId = 'test-' + Date.now();
  console.log(`📌 Test Session ID: ${testSessionId}`);
  
  storeSession(testSessionId, {
    user: { id: '123', login: 'testuser' },
    accessToken: 'test-token'
  });
  
  console.log(`   Stored! Now retrieving...`);
  
  // Test 2: Retrieve it immediately
  const retrieved = getSession(testSessionId);
  
  console.log(`   Retrieved result: ${retrieved ? '✅ FOUND' : '❌ NOT FOUND'}`);
  
  // Test 3: Get all sessions
  const all = getAllSessions();
  console.log(`   Total sessions: ${all.length}`);
  
  return NextResponse.json({
    test: 'session store',
    stored: testSessionId,
    retrieved: !!retrieved,
    allCount: all.length,
    allKeys: all.map(([k]) => k),
  });
}
