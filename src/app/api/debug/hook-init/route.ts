import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to confirm useTwitchChat hook initialization
 * Called by the hook immediately when enabled condition is met
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  const timestamp = new Date().toISOString();
  
  console.log(`🪝 [HOOK INIT] useTwitchChat hook called at ${timestamp}`);
  console.log(`   sessionId: ${sessionId}`);
  
  return NextResponse.json({
    success: true,
    message: '✅ Hook initialized',
    timestamp,
    sessionId,
  });
}
