/**
 * Chat Integration Module
 * Allows viewers to join and choose roles via chat commands
 */

class ChatIntegration {
  constructor() {
    this.chatSystem = 'none'; // 'twitch', 'youtube', 'manual', 'none'
    this.chatConnected = false;
    this.pendingJoins = [];
    this.roleSelection = {
      warrior: [],
      healer: [],
      scout: [],
      trickster: [],
    };
  }

  /**
   * Initialize chat system
   * @param {string} platform - 'twitch', 'youtube', or 'manual'
   * @param {string} channelName - Channel name for the platform
   */
  initChat(platform, channelName) {
    this.chatSystem = platform;
    console.log(`🎙️ Initializing ${platform} chat integration for ${channelName}`);

    switch (platform) {
      case 'twitch':
        this.initTwitchChat(channelName);
        break;
      case 'youtube':
        this.initYouTubeChat(channelName);
        break;
      case 'manual':
        this.initManualChat();
        break;
      default:
        console.warn('⚠️ Unknown chat platform');
    }
  }

  /**
   * Initialize Twitch Chat (requires TMI.js library)
   */
  initTwitchChat(channelName) {
    console.log(`🎮 Connecting to Twitch channel: ${channelName}`);
    
    // This requires TMI.js library to be loaded
    // <script src="https://cdn.jsdelivr.net/npm/tmi.js@latest/"></script>
    
    if (typeof tmi === 'undefined') {
      console.error('❌ TMI.js library not loaded. Add: <script src="https://cdn.jsdelivr.net/npm/tmi.js@latest/"></script>');
      return;
    }

    const client = new tmi.Client({
      channels: [channelName],
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
      if (self) return; // Ignore bot's own messages

      const username = tags['display-name'];
      const messageText = message.toLowerCase().trim();

      // Check for join commands
      if (messageText.startsWith('!join')) {
        this.handleChatJoin(username, tags['user-id']);
      }

      // Check for role selection
      if (messageText === '!warrior') {
        this.selectRole(username, 'Warrior');
      } else if (messageText === '!healer') {
        this.selectRole(username, 'Healer');
      } else if (messageText === '!scout') {
        this.selectRole(username, 'Scout');
      } else if (messageText === '!trickster') {
        this.selectRole(username, 'Trickster');
      }

      // Admin commands
      if (tags['badges']?.broadcaster) {
        if (messageText === '!startgame') {
          this.broadcastStartGame();
        } else if (messageText === '!endjoin') {
          this.closeChatJoins();
        } else if (messageText === '!showroles') {
          this.broadcastRoles();
        }
      }
    });

    client.on('connected', () => {
      console.log('✅ Connected to Twitch chat!');
      this.chatConnected = true;
      client.say(channelName, '🎮 Streamer\'s Quest is LIVE! Type !join to play, then pick your role: !warrior !healer !scout !trickster');
    });

    this.twitchClient = client;
  }

  /**
   * Initialize YouTube Chat (requires YouTube API)
   */
  initYouTubeChat(channelName) {
    console.log(`🎮 Connecting to YouTube channel: ${channelName}`);
    
    // This requires YouTube API setup
    console.warn('⚠️ YouTube chat integration requires additional API setup');
    console.log('📖 See: https://developers.google.com/youtube/v3/docs/liveChatMessages/list');
    
    // Placeholder for YouTube integration
    // In production, you would:
    // 1. Get live stream ID
    // 2. Poll for new messages using YouTube API
    // 3. Parse commands similar to Twitch
  }

  /**
   * Manual chat system (for testing)
   * Simulates chat messages for development
   */
  initManualChat() {
    console.log('💬 Manual chat mode - simulate messages below:');
    
    // Add HTML form to page for testing
    this.createManualChatForm();
  }

  /**
   * Create manual chat form for testing
   */
  createManualChatForm() {
    const existingForm = document.getElementById('manualChatForm');
    if (existingForm) existingForm.remove();

    const form = document.createElement('div');
    form.id = 'manualChatForm';
    form.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #ffd700;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      width: 300px;
    `;

    form.innerHTML = `
      <div style="color: #ffd700; font-weight: bold; margin-bottom: 10px;">💬 Manual Chat Simulator</div>
      
      <input type="text" id="chatUsername" placeholder="Username" style="width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
      <input type="text" id="chatMessage" placeholder="Type command..." style="width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
      
      <button onclick="window.chatIntegration.simulateChatMessage()" style="width: 100%; padding: 8px; background: #ffd700; color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 8px;">Send Message</button>
      
      <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 8px;">
        <strong>Commands:</strong><br>
        • !join - Join game<br>
        • !warrior, !healer, !scout, !trickster - Choose role<br>
        • !startgame - Start (admin)<br>
        • !endjoin - Close joins (admin)
      </div>

      <div id="chatLog" style="background: rgba(0,0,0,0.5); padding: 8px; border-radius: 4px; max-height: 150px; overflow-y: auto; font-size: 11px; color: #ecf0f1;"></div>
    `;

    document.body.appendChild(form);
  }

  /**
   * Simulate chat message (for manual testing)
   */
  simulateChatMessage() {
    const username = document.getElementById('chatUsername').value || 'TestViewer';
    const message = document.getElementById('chatMessage').value;

    if (!message) return;

    this.handleChatMessage(username, message);

    // Log the message
    const log = document.getElementById('chatLog');
    const entry = document.createElement('div');
    entry.textContent = `${username}: ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    // Clear input
    document.getElementById('chatMessage').value = '';
  }

  /**
   * Handle chat message (generic handler)
   */
  handleChatMessage(username, message) {
    const msg = message.toLowerCase().trim();

    if (msg === '!join') {
      this.handleChatJoin(username, username);
    } else if (msg === '!warrior') {
      this.selectRole(username, 'Warrior');
    } else if (msg === '!healer') {
      this.selectRole(username, 'Healer');
    } else if (msg === '!scout') {
      this.selectRole(username, 'Scout');
    } else if (msg === '!trickster') {
      this.selectRole(username, 'Trickster');
    } else if (msg === '!startgame') {
      this.broadcastStartGame();
    } else if (msg === '!endjoin') {
      this.closeChatJoins();
    } else if (msg === '!showroles') {
      this.broadcastRoles();
    }
  }

  /**
   * Handle viewer joining from chat
   */
  handleChatJoin(username, userId) {
    if (this.pendingJoins.some(j => j.username === username)) {
      console.warn(`⚠️ ${username} already in queue`);
      return;
    }

    this.pendingJoins.push({
      username,
      userId,
      timestamp: Date.now(),
    });

    console.log(`✅ ${username} wants to join! (${this.pendingJoins.length} pending)`);
    this.updateJoinQueue();
  }

  /**
   * Handle role selection from chat
   */
  selectRole(username, role) {
    const roleKey = role.toLowerCase();

    if (!this.roleSelection[roleKey]) {
      console.warn(`⚠️ Invalid role: ${role}`);
      return;
    }

    // Remove from other roles if already selected
    Object.keys(this.roleSelection).forEach(r => {
      this.roleSelection[r] = this.roleSelection[r].filter(u => u !== username);
    });

    // Add to selected role
    if (!this.roleSelection[roleKey].includes(username)) {
      this.roleSelection[roleKey].push(username);
      console.log(`🎭 ${username} selected ${role}!`);
      this.updateRoleDisplay();
    }
  }

  /**
   * Update join queue display
   */
  updateJoinQueue() {
    console.log('📋 Pending joins:');
    this.pendingJoins.forEach((join, index) => {
      console.log(`  ${index + 1}. ${join.username}`);
    });
  }

  /**
   * Update role display
   */
  updateRoleDisplay() {
    console.log('🎭 Current role selection:');
    Object.entries(this.roleSelection).forEach(([role, players]) => {
      if (players.length > 0) {
        console.log(`  ${role}: ${players.join(', ')}`);
      }
    });
  }

  /**
   * Start game - approve all pending joins
   */
  broadcastStartGame() {
    console.log('🎮 Game started!');
    console.log(`✅ Approved ${this.pendingJoins.length} viewers to join`);
    
    // Send to WebSocket if connected
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      this.pendingJoins.forEach(join => {
        window.ws.send(JSON.stringify({
          type: 'chatJoin',
          viewer: join.username,
        }));
      });
    }

    this.pendingJoins = [];
  }

  /**
   * Close chat joins - stop accepting new players
   */
  closeChatJoins() {
    console.log('🔒 Closed chat joins');
    console.log(`✅ Game locked with ${this.pendingJoins.length} players`);
    
    // Disable further joins
    this.pendingJoins = [];
  }

  /**
   * Broadcast current roles to chat
   */
  broadcastRoles() {
    let message = '🎭 Current Roles: ';
    let hasPlayers = false;

    Object.entries(this.roleSelection).forEach(([role, players]) => {
      if (players.length > 0) {
        hasPlayers = true;
        message += `${role.toUpperCase()} (${players.length}) `;
      }
    });

    if (!hasPlayers) {
      message = '🎭 No roles selected yet. Type !warrior !healer !scout or !trickster';
    }

    console.log(message);

    // Send to Twitch chat if connected
    if (this.twitchClient) {
      const channel = Object.keys(this.twitchClient.channels)[0];
      if (channel) {
        this.twitchClient.say(channel, message);
      }
    }
  }

  /**
   * Get player count by role
   */
  getPlayerStats() {
    return {
      total: Object.values(this.roleSelection).reduce((sum, arr) => sum + arr.length, 0),
      warriors: this.roleSelection.warrior.length,
      healers: this.roleSelection.healer.length,
      scouts: this.roleSelection.scout.length,
      tricksters: this.roleSelection.trickster.length,
    };
  }

  /**
   * Export roles as JSON
   */
  exportRoles() {
    return {
      timestamp: new Date().toISOString(),
      stats: this.getPlayerStats(),
      roles: this.roleSelection,
    };
  }
}

// Initialize global chat integration
window.chatIntegration = new ChatIntegration();

// Make it available for easy setup
window.setupChat = function(platform = 'manual', channelName = 'test') {
  window.chatIntegration.initChat(platform, channelName);
};

// Auto-init manual chat on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('💬 Chat integration ready!');
  console.log('📝 To enable chat, call: setupChat("manual") or setupChat("twitch", "channelname")');
  
  // Auto-enable manual chat for testing
  setTimeout(() => {
    window.setupChat('manual', 'test');
  }, 1000);
});
