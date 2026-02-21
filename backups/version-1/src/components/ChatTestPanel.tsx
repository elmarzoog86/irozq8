'use client';

import { useEffect, useState } from 'react';

/**
 * Test panel to simulate Twitch chat messages
 * Used for debugging without real Twitch account
 */
export function ChatTestPanel({ 
  sessionId, 
  enabled,
  onMessage 
}: { 
  sessionId?: string;
  enabled: boolean;
  onMessage?: (username: string, message: string) => void;
}) {
  const [testMessage, setTestMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`[TEST PANEL] ${message}`);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-10));
  };

  useEffect(() => {
    if (!enabled) {
      addLog('Test panel disabled (game not started)');
    }
  }, [enabled]);

  const sendTestMessage = () => {
    if (!testMessage.trim()) return;
    
    const message = `🧪 Simulating message: "${testMessage}"`;
    addLog(message);
    console.log(`Calling onMessage with: username="test_user", message="${testMessage}"`);
    
    if (onMessage) {
      try {
        onMessage('test_user', testMessage);
        addLog('✅ onMessage callback executed successfully');
      } catch (error) {
        addLog(`❌ onMessage callback failed: ${error}`);
      }
    } else {
      addLog('❌ onMessage callback not provided');
    }
    
    setTestMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border-2 border-orange-500 rounded p-4 z-40 shadow-lg">
      <div className="text-sm font-mono">
        <div className="text-orange-400 font-bold mb-2">
          🧪 Chat Test Panel{enabled ? ' ✅ ACTIVE' : ' ❌ DISABLED'}
        </div>
        
        {!enabled && (
          <div className="text-yellow-400 text-xs mb-2">
            Test panel disabled. Start the Questions game to enable.
          </div>
        )}

        {enabled && (
          <div className="space-y-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
              placeholder="Enter test message..."
              className="w-full px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded text-xs"
              disabled={!enabled}
            />
            <button
              onClick={sendTestMessage}
              disabled={!enabled || !testMessage.trim()}
              className="w-full px-2 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded text-xs font-bold"
            >
              Send Test Message
            </button>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-700 max-h-32 overflow-y-auto">
          <div className="text-gray-400 text-xs space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-gray-500">{log}</div>
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-700 text-gray-500 text-xs">
          Session: {sessionId ? `✅ ${sessionId.substring(0, 8)}...` : '❌ missing'}
        </div>
      </div>
    </div>
  );
}
