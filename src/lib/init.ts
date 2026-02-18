/**
 * Global initialization - runs when the app starts
 * Ensures session store is initialized on globalThis
 */

// Import to trigger initialization of session store
import '@/lib/twitch-sessions';

// Just importing is enough - the session store will be initialized
if (typeof window === 'undefined') {
  // Server-side only
  console.log('🚀 [INIT] Session store module imported and initialized');
}
