'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseTwitchChatOptions {
  sessionId?: string;
  onAnswer?: (playerIndex: number, username: string, answer: string) => void;
  onMessage?: (username: string, message: string) => void;
  onJoin?: (username: string) => void;
  onVote?: (voteData: { playerIndex: number; username: string }) => void;
  enabled?: boolean;
}

/**
 * Custom hook to connect to Twitch chat via Server-Sent Events (SSE)
 * Uses server-side tmi.js proxy to bypass browser CDN blocking
 * Automatically connects when sessionId is provided
 * Automatically disconnects on unmount
 */
export function useTwitchChat({
  sessionId,
  onAnswer,
  onMessage,
  onJoin,
  onVote,
  enabled = true,
}: UseTwitchChatOptions) {
  const hasInitialized = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const channelRef = useRef<string | null>(null);

  // Memoize callbacks to prevent unnecessary dependency changes
  const memoizedOnAnswer = useCallback(onAnswer || (() => {}), [onAnswer]);
  const memoizedOnMessage = useCallback(onMessage || (() => {}), [onMessage]);
  const memoizedOnJoin = useCallback(onJoin || (() => {}), [onJoin]);
  const memoizedOnVote = useCallback(onVote || (() => {}), [onVote]);

  useEffect(() => {
    console.log(`🎣 [HOOK] useTwitchChat called - enabled: ${enabled}, sessionId: ${sessionId ? 'present' : 'missing'}`);

    if (!enabled || !sessionId || hasInitialized.current) {
      console.log(`⏭️  [HOOK] Skipping - enabled: ${enabled}, sessionId: ${!!sessionId}, hasInitialized: ${hasInitialized.current}`);
      return;
    }

    hasInitialized.current = true;
    console.log(`� [HOOK] Initializing Twitch chat for session: ${sessionId}`);

    const initializeChat = async () => {
      try {
        // Step 1: Get chat credentials from backend
        console.log(`📡 [HOOK] Fetching chat token from /api/twitch/chat-token`);
        
        const tokenResponse = await fetch(
          `/api/twitch/chat-token?action=connect&session=${sessionId}`
        );

        if (!tokenResponse.ok) {
          throw new Error(`Token endpoint returned ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        console.log(`✅ [HOOK] Got chat token: channel=${tokenData.channel}, user=${tokenData.userName}`);

        if (!tokenData.success) {
          throw new Error(tokenData.error || 'Failed to get token');
        }

        const channelName = tokenData.channel;
        channelRef.current = channelName;

        // Step 2: Start server-side chat connection
        console.log(`🎙️  [HOOK] Starting server-side chat connection for channel: ${channelName}`);
        
        const startResponse = await fetch('/api/twitch/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'start',
            channelName,
            accessToken: tokenData.accessToken,
            sessionId
          })
        });

        if (!startResponse.ok) {
          throw new Error(`Chat start endpoint returned ${startResponse.status}`);
        }

        const startData = await startResponse.json();
        console.log(`✅ [HOOK] Server-side chat connection started:`, startData);

        if (!startData.success) {
          throw new Error(`Failed to start chat connection: ${startData.error}`);
        }

        // Step 3: Wait a moment for the server to be ready, then connect to SSE stream with retry logic
        console.log(`⏳ [HOOK] Waiting for server to be ready...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`🔌 [HOOK] Connecting to SSE stream for channel: ${channelName}`);
        
        // Retry logic for SSE connection
        let eventSource: EventSource | null = null;
        let retryCount = 0;
        const maxRetries = 5;

        const connectSSE = () => {
          return new Promise<EventSource>((resolve, reject) => {
            try {
              const es = new EventSource(`/api/twitch/chat?channel=${encodeURIComponent(channelName)}`);
              
              // Set up timeout to detect connection failures
              const timeout = setTimeout(() => {
                es.close();
                reject(new Error('SSE connection timeout'));
              }, 5000);

              es.addEventListener('open', () => {
                clearTimeout(timeout);
                console.log(`✅ [HOOK] SSE connection opened for channel: ${channelName}`);
                resolve(es);
              });

              es.addEventListener('error', (error: any) => {
                clearTimeout(timeout);
                console.error(`❌ [HOOK] SSE connection error:`, error);
                es.close();
                reject(error);
              });
            } catch (error) {
              console.error(`❌ [HOOK] Failed to create EventSource:`, error);
              reject(error);
            }
          });
        };

        // Retry loop
        while (retryCount < maxRetries) {
          try {
            eventSource = await connectSSE();
            console.log(`✅ [HOOK] Successfully connected to SSE after ${retryCount} retries`);
            break;
          } catch (error) {
            retryCount++;
            console.warn(`⚠️  [HOOK] SSE connection attempt ${retryCount}/${maxRetries} failed:`, error);
            
            if (retryCount < maxRetries) {
              const delay = Math.pow(2, retryCount) * 500; // exponential backoff
              console.log(`⏳ [HOOK] Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              throw new Error(`Failed to connect to SSE after ${maxRetries} attempts`);
            }
          }
        }

        if (!eventSource) {
          throw new Error('Failed to establish SSE connection');
        }

        eventSourceRef.current = eventSource;

        eventSource.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`📨 [HOOK-EVENT] Received:`, data.type);

            if (data.type === 'connected') {
              console.log(`✅ [HOOK-EVENT] Connected to channel: ${data.channel}`);
            } else if (data.type === 'message') {
              console.log(`💬 [HOOK-EVENT] Message from ${data.username}: ${data.message}`);
              
              // Call message callback
              memoizedOnMessage(data.username, data.message);

              // Check for !join command
              const message = data.message.toLowerCase().trim();
              if (message === '!join') {
                console.log(`✅ [HOOK-EVENT] Join command from ${data.username}`);
                memoizedOnJoin(data.username);
              }

              // Check for voting command (e.g., "!vote 1", "vote 2", "1", "2", etc.)
              const voteMatch = message.match(/^(?:!vote\s+)?(\d+)$/);
              if (voteMatch) {
                const playerIndex = parseInt(voteMatch[1], 10) - 1;  // Convert to 0-based index
                console.log(`🗳️  [HOOK-EVENT] Vote command from ${data.username}: ${voteMatch[1]}`);
                memoizedOnVote({playerIndex, username: data.username});
              }

              // Parse as potential game answer
              // This is a simple implementation - customize based on your game logic
              if (memoizedOnAnswer) {
                // Try to match the message as a game answer
                // You can add answer parsing logic here
                console.log(`📝 [HOOK-EVENT] Answer candidate: ${message}`);
                memoizedOnAnswer(0, data.username, data.message);
              }
            } else if (data.type === 'disconnected') {
              console.log(`❌ [HOOK-EVENT] Disconnected from channel: ${data.channel}`);
            }
          } catch (error) {
            console.error('❌ [HOOK-EVENT] Error parsing SSE message:', error);
          }
        });

        eventSource.onerror = (error) => {
          console.error('❌ [HOOK-EVENT] SSE connection error:', error);
          if (eventSource.readyState === EventSource.CLOSED) {
            console.log('❌ [HOOK-EVENT] SSE connection closed');
            hasInitialized.current = false;
          }
        };

        console.log(`✅ [HOOK] Twitch chat successfully initialized!`);

      } catch (error) {
        console.error('❌ [HOOK] Error initializing Twitch chat:', error);
        hasInitialized.current = false;
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      console.log(`🧹 [HOOK] Cleanup - closing SSE connection for channel: ${channelRef.current}`);
      
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (channelRef.current) {
        // Stop server-side chat connection
        fetch('/api/twitch/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stop',
            channelName: channelRef.current,
            accessToken: '',
            sessionId
          })
        }).catch(err => console.error('❌ [HOOK] Error stopping chat:', err));
      }

      hasInitialized.current = false;
    };
  }, [sessionId, enabled, memoizedOnAnswer, memoizedOnMessage, memoizedOnJoin, memoizedOnVote]);

  return {
    isConnected: eventSourceRef.current !== null,
    channelName: channelRef.current
  };
}
