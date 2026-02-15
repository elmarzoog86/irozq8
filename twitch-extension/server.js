import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { parse } from 'url';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Twitch Extension Data Store
const gameState = {
  players: new Map(),
  currentGame: null,
  isActive: false,
  joinCode: 'join',
  broadcasterConnected: false
};

// Create HTTP Server
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve Twitch Extension Pages
  try {
    if (req.url === '/twitch-extension' || req.url === '/twitch-extension/') {
      const content = await readFile(
        join(__dirname, '../twitch-extension/src/viewer/viewer.html'),
        'utf8'
      );
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } else if (req.url === '/twitch-extension/config') {
      const content = await readFile(
        join(__dirname, '../twitch-extension/src/config/config.html'),
        'utf8'
      );
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } else if (req.url === '/api/game-state') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        players: Array.from(gameState.players.values()),
        currentGame: gameState.currentGame,
        isActive: gameState.isActive,
        joinCode: gameState.joinCode
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = parse(req.url, true);
  const clientType = url.query.type || 'viewer';
  
  let userId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`[${clientType}] Message:`, message);

      if (message.type === 'CONNECT') {
        userId = message.userId;
        
        if (clientType === 'broadcaster') {
          gameState.broadcasterConnected = true;
          console.log('Broadcaster connected:', message.displayName);
          broadcastToAll({
            type: 'BROADCASTER_CONNECTED',
            message: `البث الجديد بدأ من: ${message.displayName}`
          });
        } else {
          // Add player to game
          gameState.players.set(userId, {
            id: userId,
            name: message.displayName || `لاعب ${gameState.players.size + 1}`,
            score: 0,
            joined: new Date(),
            eliminated: false
          });

          console.log(`Player joined: ${message.displayName}`);
          
          // Notify all clients
          broadcastToAll({
            type: 'PLAYER_JOINED',
            player: gameState.players.get(userId),
            totalPlayers: gameState.players.size
          });
        }
      } else if (message.type === 'SEND_MESSAGE') {
        // Broadcasting Message
        broadcastToAll({
          type: 'BROADCAST_MESSAGE',
          message: message.text,
          sender: message.displayName
        });
      } else if (message.type === 'UPDATE_GAME_STATE') {
        gameState.currentGame = message.game;
        gameState.isActive = message.isActive;
        broadcastToAll({
          type: 'GAME_STATE_UPDATED',
          currentGame: gameState.currentGame,
          isActive: gameState.isActive
        });
      } else if (message.type === 'ELIMINATE_PLAYER') {
        const player = gameState.players.get(message.playerId);
        if (player) {
          player.eliminated = true;
          broadcastToAll({
            type: 'PLAYER_ELIMINATED',
            playerId: message.playerId,
            playerName: player.name
          });
        }
      } else if (message.type === 'UPDATE_SCORE') {
        const player = gameState.players.get(message.playerId);
        if (player) {
          player.score = message.score;
          broadcastToAll({
            type: 'PLAYER_SCORE_UPDATED',
            playerId: message.playerId,
            score: message.score
          });
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      gameState.players.delete(userId);
      console.log(`Player disconnected: ${userId}`);
      broadcastToAll({
        type: 'PLAYER_LEFT',
        playerId: userId,
        totalPlayers: gameState.players.size
      });
    }
    if (clientType === 'broadcaster') {
      gameState.broadcasterConnected = false;
      console.log('Broadcaster disconnected');
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast to all connected clients
function broadcastToAll(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
}

// Export for use in main server
export { server as twitchExtensionServer, gameState };

// Start server if run directly
const PORT = process.env.TWITCH_EXT_PORT || 3002;
server.listen(PORT, () => {
  console.log(`🎮 Twitch Extension Server running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
});
