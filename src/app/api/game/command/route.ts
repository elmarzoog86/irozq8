import { NextResponse } from 'next/server';
import { handleCommand } from '@/lib/command-router';
import { parseCommand } from '@/lib/twitch-chat-service';

/**
 * POST /api/game/command
 * Handle chat commands
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, username, userId, message } = body;

    if (!sessionId || !username || !userId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse command from message
    const command = parseCommand(message, username, { 'user-id': userId });

    if (!command) {
      return NextResponse.json({
        success: true,
        isCommand: false,
        message: 'Not a command',
      });
    }

    // Route command to handler
    await handleCommand(command, sessionId);

    return NextResponse.json({
      success: true,
      isCommand: true,
      command: command.command,
      args: command.args,
    });
  } catch (error) {
    console.error('Command processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
