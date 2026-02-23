/**
 * Twitch Session Store
 * In-memory session management for Twitch OAuth
 * Works on Vercel and other serverless platforms
 * Note: For production, implement with Redis or database
 */

// Global session storage - declare at module level
declare global {
  var twitchSessions: Map<string, any>;
}

// Initialize or use existing session store
if (!global.twitchSessions) {
  global.twitchSessions = new Map();
  console.log(`🔐 [SESSION STORE INIT] Creating new in-memory session store`);
} else {
  console.log(`🔐 [SESSION STORE INIT] Using existing session store (${global.twitchSessions.size} sessions)`);
}

const sessions = global.twitchSessions;

// Session TTL: 7 days
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

// Cleanup task for expired sessions - only create once
if (!global.sessionCleanupInitialized) {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, sessionData] of sessions.entries()) {
      if (sessionData.expiresAt && sessionData.expiresAt < now) {
        sessions.delete(sessionId);
        cleaned++;
        console.log(`🗑️ [SESSION CLEANUP] Removed expired session: ${sessionId}`);
      }
    }
    
    if (cleaned > 0) {
      console.log(`🗑️ [SESSION CLEANUP] Removed ${cleaned} expired sessions, ${sessions.size} remaining`);
    }
  }, 60 * 60 * 1000); // Run cleanup every hour

  // Prevent the interval from keeping the process alive
  cleanupInterval.unref?.();
  
  global.sessionCleanupInitialized = true;
}

export function storeSession(sessionId: string, data: any) {
  console.log(`🔐 [SESSION STORE] Storing session: ${sessionId}`);
  console.log(`   Data keys:`, Object.keys(data));
  console.log(`   User:`, data.user?.login);
  
  // Store with TTL metadata
  const sessionWithTTL = {
    ...data,
    storedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL,
  };
  
  sessions.set(sessionId, sessionWithTTL);
  console.log(`   ✅ Stored successfully (${sessions.size} sessions in memory)`);
  
  // Verify immediately
  const storedData = sessions.get(sessionId);
  console.log(`   🔍 Verification: session ${storedData ? 'EXISTS ✅' : 'MISSING ❌'} in memory`);
}

export function getSession(sessionId: string) {
  console.log(`🔐 [SESSION RETRIEVE] Looking for session: ${sessionId}`);
  
  const sessionData = sessions.get(sessionId);
  
  if (!sessionData) {
    console.log(`   ❌ Session not found (${sessions.size} sessions in memory)`);
    return undefined;
  }
  
  // Check if session has expired
  if (sessionData.expiresAt && sessionData.expiresAt < Date.now()) {
    console.log(`   ⏰ Session expired, deleting`);
    sessions.delete(sessionId);
    return undefined;
  }
  
  console.log(`   ✅ Found and valid (expires in ${Math.round((sessionData.expiresAt - Date.now()) / 1000)}s)`);
  return sessionData;
}

export function deleteSession(sessionId: string) {
  const existed = sessions.has(sessionId);
  if (existed) {
    sessions.delete(sessionId);
    console.log(`🗑️ [SESSION DELETE] Deleted session: ${sessionId} (${sessions.size} remaining)`);
  } else {
    console.log(`🗑️ [SESSION DELETE] Session not found: ${sessionId}`);
  }
}

export function getAllSessions() {
  console.log(`📊 [SESSION LIST] Total sessions: ${sessions.size}`);
  
  const result: Array<[string, any]> = [];
  const now = Date.now();
  
  for (const [sessionId, sessionData] of sessions.entries()) {
    // Only include non-expired sessions
    if (!sessionData.expiresAt || sessionData.expiresAt > now) {
      result.push([sessionId, sessionData]);
    }
  }
  
  return result;
}

export function clearAllSessions() {
  const count = sessions.size;
  sessions.clear();
  console.log(`🗑️ [SESSION CLEAR] Cleared all ${count} sessions`);
}
