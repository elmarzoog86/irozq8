'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function DebugChatContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const sessionId = searchParams.get('session');
    const gameId = searchParams.get('id');
    
    console.log('=== DEBUG CHAT PAGE ===');
    console.log('Current URL:', window.location.href);
    console.log('Session ID from URL:', sessionId);
    console.log('Game ID from URL:', gameId);
    console.log('Search params:', Object.fromEntries(searchParams));
    console.log('Window.tmi available:', !!window.tmi);
    console.log('========================');
  }, [searchParams]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#00ff00', minHeight: '100vh' }}>
      <h1>🔍 Chat Debug Information</h1>
      <p>Current URL: <code>{typeof window !== 'undefined' ? window.location.href : 'N/A'}</code></p>
      <p>Session ID: <code>{searchParams?.get('session') || 'NOT FOUND'}</code></p>
      <p>Game ID: <code>{searchParams?.get('id') || 'NOT FOUND'}</code></p>
      <p>TMI.js loaded: <code>{typeof window !== 'undefined' && !!window.tmi ? 'YES ✅' : 'NO ❌'}</code></p>
      <hr />
      <h2>Open DevTools Console (F12) to see full debug info</h2>
      <p>The information above has been logged to console.</p>
    </div>
  );
}

export default function DebugChat() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', color: '#00ff00' }}>جاري التحميل...</div>}>
      <DebugChatContent />
    </Suspense>
  );
}
