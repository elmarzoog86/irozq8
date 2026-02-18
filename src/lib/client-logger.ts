'use client';

/**
 * Client-side logging that sends critical messages to server
 */

const clientLogs: string[] = [];

export function logToServer(message: string, level: 'info' | 'error' | 'warning' = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${level.toUpperCase()}] ${timestamp} - ${message}`;

  // Log to console
  if (level === 'error') {
    console.error(logMessage);
  } else if (level === 'warning') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }

  // Store locally
  clientLogs.push(logMessage);

  // Send to server (fire and forget)
  try {
    fetch('/api/debug/client-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: logMessage, level }),
    }).catch(() => {
      // Silently fail - don't break the app if logging fails
    });
  } catch {
    // Silently fail
  }
}

export function getCLientLogs() {
  return clientLogs;
}
