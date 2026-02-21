/**
 * Twitch Session Store
 * File-based session management for Twitch OAuth
 * Uses disk storage to ensure persistence across processes
 */

import * as fs from 'fs';
import * as path from 'path';

const SESSIONS_DIR = path.join(process.cwd(), '.sessions');

// Create sessions directory if it doesn't exist
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  console.log(`🔐 [SESSION STORE INIT] Created sessions directory: ${SESSIONS_DIR}`);
}

export function storeSession(sessionId: string, data: any) {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  const sessionData = JSON.stringify(data, null, 2);
  
  console.log(`🔐 [SESSION STORE] Storing session: ${sessionId}`);
  console.log(`   Path: ${sessionPath}`);
  
  try {
    fs.writeFileSync(sessionPath, sessionData, 'utf-8');
    console.log(`   ✅ Stored successfully`);
  } catch (error) {
    console.error(`   ❌ Failed to store session:`, error);
  }
}

export function getSession(sessionId: string) {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  
  console.log(`� [SESSION RETRIEVE] Looking for session: ${sessionId}`);
  console.log(`   Path: ${sessionPath}`);
  
  try {
    if (fs.existsSync(sessionPath)) {
      const sessionData = fs.readFileSync(sessionPath, 'utf-8');
      const parsed = JSON.parse(sessionData);
      console.log(`   ✅ Found and parsed successfully`);
      return parsed;
    } else {
      console.log(`   ❌ File does not exist`);
      return undefined;
    }
  } catch (error) {
    console.error(`   ❌ Failed to retrieve session:`, error);
    return undefined;
  }
}

export function deleteSession(sessionId: string) {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  try {
    if (fs.existsSync(sessionPath)) {
      fs.unlinkSync(sessionPath);
      console.log(`🗑️ [SESSION DELETE] Deleted session: ${sessionId}`);
    }
  } catch (error) {
    console.error(`🗑️ [SESSION DELETE] Failed to delete session:`, error);
  }
}

export function getAllSessions() {
  try {
    const files = fs.readdirSync(SESSIONS_DIR);
    const sessions: Array<[string, any]> = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const sessionId = file.replace('.json', '');
        const sessionPath = path.join(SESSIONS_DIR, file);
        const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
        sessions.push([sessionId, sessionData]);
      }
    }
    
    return sessions;
  } catch (error) {
    console.error('Failed to get all sessions:', error);
    return [];
  }
}

export function clearAllSessions() {
  try {
    const files = fs.readdirSync(SESSIONS_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(SESSIONS_DIR, file));
      }
    }
    console.log(`🗑️ [SESSION CLEAR] Cleared all sessions`);
  } catch (error) {
    console.error('Failed to clear sessions:', error);
  }
}
