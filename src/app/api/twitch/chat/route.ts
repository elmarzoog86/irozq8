/**
 * Server-side Twitch Chat Streaming via Server-Sent Events (SSE)
 * Bypasses CDN blocking by handling tmi.js entirely on the server
 * Clients connect via EventSource to receive real-time messages
 */

import { NextRequest, NextResponse } from 'next/server';
import tmi from 'tmi.js';

// Store active chat clients (channelName -> {client, listeners})
interface ChatClient {
  client: any;
  listeners: Set<(data: string) => void>;
}

const activeChatClients = new Map<string, ChatClient>();

interface ChatStartRequest {
  action: 'start' | 'stop';
  channelName: string;
  accessToken: string;
  sessionId: string;
}

/**
 * Helper to broadcast messages to all listeners of a channel
 */
function broadcastToListeners(channelName: string, data: string) {
  const chatClient = activeChatClients.get(channelName);
  if (chatClient) {
    chatClient.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error calling listener:', error);
      }
    });
  }
}

/**
 * POST /api/twitch/chat
 * Start or stop a chat connection
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatStartRequest = await request.json();
    const { action, channelName, accessToken, sessionId } = body;

    console.log(`🎙️ [CHAT PROXY] Received request: action=${action}, channel=${channelName}, session=${sessionId}`);

    if (action === 'start') {
      // Check if we already have a client for this channel
      if (activeChatClients.has(channelName)) {
        console.log(`✅ [CHAT PROXY] Already connected to channel: ${channelName}`);
        return NextResponse.json({ 
          success: true, 
          message: 'Already connected to channel',
          channelName 
        });
      }

      // Create new TMI.js client
      try {
        const client = new (tmi as any).client({
          options: { 
            debug: false,
            messagesLogLevel: 'error'
          },
          connection: {
            secure: true,
            reconnect: true,
            maxReconnectAttempts: 5
          },
          identity: {
            username: channelName,
            password: `oauth:${accessToken}`
          },
          channels: [channelName]
        });

        const chatClient: ChatClient = {
          client,
          listeners: new Set()
        };

        // Setup event handlers
        client.on('connected', () => {
          console.log(`✅ [CHAT PROXY] Connected to ${channelName}'s chat`);
          broadcastToListeners(channelName, JSON.stringify({
            type: 'connected',
            channel: channelName,
            message: `Connected to ${channelName}'s chat`
          }));
        });

        client.on('message', (_channel: string, tags: any, message: string, self: boolean) => {
          if (self) return;
          
          const messageData = {
            type: 'message',
            username: tags['display-name'] || tags.username,
            message: message,
            timestamp: Date.now()
          };

          console.log(`📨 [CHAT PROXY] ${messageData.username}: ${message}`);
          
          // Broadcast to all listeners
          broadcastToListeners(channelName, JSON.stringify(messageData));
        });

        client.on('disconnected', () => {
          console.log(`❌ [CHAT PROXY] Disconnected from ${channelName}`);
          activeChatClients.delete(channelName);
          broadcastToListeners(channelName, JSON.stringify({
            type: 'disconnected',
            channel: channelName
          }));
        });

        // Store client before connecting
        activeChatClients.set(channelName, chatClient);

        // Connect to chat
        await client.connect();

        console.log(`🎉 [CHAT PROXY] Successfully started chat connection for ${channelName}`);
        return NextResponse.json({ 
          success: true, 
          message: 'Chat connection started',
          channelName 
        });

      } catch (error: any) {
        console.error(`❌ [CHAT PROXY] Failed to create client:`, error.message);
        activeChatClients.delete(channelName);
        return NextResponse.json({ 
          success: false, 
          error: error.message 
        }, { status: 500 });
      }

    } else if (action === 'stop') {
      const chatClient = activeChatClients.get(channelName);
      
      if (chatClient) {
        try {
          await chatClient.client.disconnect();
          activeChatClients.delete(channelName);
          console.log(`✅ [CHAT PROXY] Stopped chat connection for ${channelName}`);
          return NextResponse.json({ 
            success: true, 
            message: 'Chat connection stopped' 
          });
        } catch (error: any) {
          console.error(`❌ [CHAT PROXY] Error disconnecting:`, error.message);
          activeChatClients.delete(channelName);
          return NextResponse.json({ 
            success: false, 
            error: error.message 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'No active connection for this channel' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error: any) {
    console.error('❌ [CHAT PROXY] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * GET /api/twitch/chat
 * Server-Sent Events endpoint for streaming messages
 */
export function GET(request: NextRequest) {
  const channelName = request.nextUrl.searchParams.get('channel');

  if (!channelName) {
    return NextResponse.json({ error: 'channel parameter required' }, { status: 400 });
  }

  console.log(`🔌 [CHAT SSE] Client connecting to channel: ${channelName}`);

  // Create a custom ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      const message = encoder.encode(
        `data: ${JSON.stringify({ type: 'connected', channel: channelName })}\n\n`
      );
      controller.enqueue(message);

      // Create a listener function for this client
      const listener = (data: string) => {
        try {
          const encoded = encoder.encode(`data: ${data}\n\n`);
          controller.enqueue(encoded);
        } catch (error) {
          console.error('Error sending SSE message:', error);
        }
      };

      // Register this listener with the chat client
      const chatClient = activeChatClients.get(channelName);
      if (chatClient) {
        chatClient.listeners.add(listener);
        console.log(`➕ [CHAT SSE] Added listener for ${channelName}, total: ${chatClient.listeners.size}`);
      } else {
        console.log(`⚠️  [CHAT SSE] No chat client for channel: ${channelName}`);
      }

      // Handle client disconnect
      const cleanup = () => {
        const client = activeChatClients.get(channelName);
        if (client) {
          client.listeners.delete(listener);
          console.log(`➖ [CHAT SSE] Removed listener for ${channelName}, total: ${client.listeners.size}`);
        }
        try {
          controller.close();
        } catch (e) {
          // Already closed
        }
      };

      // Listen for abort signal
      request.signal.addEventListener('abort', cleanup);
    },
    cancel() {
      console.log(`❌ [CHAT SSE] Stream cancelled for ${channelName}`);
      const chatClient = activeChatClients.get(channelName);
      if (chatClient) {
        console.log(`   Listeners still connected: ${chatClient.listeners.size}`);
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
