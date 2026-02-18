import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Endpoint for frontend to send debug logs to server
 * Frontend will call this with important events
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { event, message, details } = data;

    // Log to server terminal with timestamp
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] 📤 CLIENT LOG: ${event}`);
    if (message) console.log(`   Message: ${message}`);
    if (details) console.log(`   Details:`, details);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
