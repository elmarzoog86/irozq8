import { NextRequest, NextResponse } from 'next/server';

const logs: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    logs.push(message);
    
    // Log to server console for visibility
    console.log(`🖥️  [CLIENT] ${message}`);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging client message:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    logs,
    count: logs.length,
  });
}
