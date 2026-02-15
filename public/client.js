/**
 * Streamer's Quest - Client JavaScript
 * WebSocket connection and real-time game updates
 */

// ============================================================
// GLOBALS
// ============================================================

let ws;
let viewerId;
let playerRole = 'Unknown';
let gameState = {};
let votingTimer = null;
let typewriterQueue = [];
let isTypewriting = false;

const CONFIG = {
  WS_URL: `ws://${window.location.hostname}:${window.location.port || 3000}`,
  TYPEWRITER_SPEED: 30, // ms per character
  VOTING_TIME: 30, // seconds
};

// ============================================================
// CONNECTION & INITIALIZATION
// ============================================================

/**
 * Initialize WebSocket connection
 */
function initializeConnection() {
  console.log('🔌 Initializing WebSocket connection...');
  
  ws = new WebSocket(CONFIG.WS_URL);

  ws.addEventListener('open', () => {
    console.log('✅ Connected to server');
    updateConnectionStatus(true);
    joinGame();
  });

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      handleServerMessage(data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.addEventListener('close', () => {
    console.log('❌ Disconnected from server');
    updateConnectionStatus(false);
    setTimeout(initializeConnection, 3000);
  });

  ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(connected) {
  const dot = document.getElementById('connectionStatus').querySelector('.status-dot');
  
  if (connected) {
    dot.classList.remove('disconnected');
    dot.classList.add('connected');
  } else {
    dot.classList.remove('connected');
    dot.classList.add('disconnected');
  }
}

/**
 * Join game and send viewer name
 */
function joinGame() {
  const viewerName = prompt('ما هو اسمك؟', 'Viewer') || 'Viewer';
  
  ws.send(JSON.stringify({
    type: 'join',
    viewer: viewerName,
  }));
}

// ============================================================
// SERVER MESSAGE HANDLERS
// ============================================================

/**
 * Handle different message types from server
 */
function handleServerMessage(data) {
  switch (data.type) {
    case 'joinConfirm':
      handleJoinConfirm(data);
      break;
    case 'gameStateUpdate':
      handleGameStateUpdate(data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

/**
 * Handle join confirmation
 */
function handleJoinConfirm(data) {
  viewerId = data.viewerId;
  playerRole = data.role;
  
  console.log(`✨ You are a ${playerRole}!`);
  document.getElementById('roleBadge').textContent = `دور: ${getRoleEmoji(playerRole)} ${playerRole}`;
  
  // Update game state
  gameState = data.gameState;
  updateUI();
}

/**
 * Handle game state update
 */
function handleGameStateUpdate(data) {
  gameState = data.gameState;
  updateUI();
}

// ============================================================
// UI UPDATES
// ============================================================

/**
 * Main UI update function
 */
function updateUI() {
  updateStats();
  updateChapter();
  updateVoting();
  updatePartyComposition();
  updateGamePhase();
}

/**
 * Update hero stats display
 */
function updateStats() {
  // Health bar
  const healthPercent = (gameState.heroHealth / gameState.maxHealth) * 100;
  document.getElementById('healthBar').style.width = healthPercent + '%';
  document.getElementById('healthValue').textContent = 
    `${gameState.heroHealth}/${gameState.maxHealth}`;

  // Supplies bar
  const suppliesPercent = (gameState.supplies / gameState.maxSupplies) * 100;
  document.getElementById('suppliesBar').style.width = suppliesPercent + '%';
  document.getElementById('suppliesValue').textContent = 
    `${gameState.supplies}/${gameState.maxSupplies}`;

  // Viewer count
  document.getElementById('viewerCount').textContent = gameState.viewerCount;
}

/**
 * Update chapter and story display
 */
function updateChapter() {
  const chapter = gameState.chapter;
  
  if (chapter) {
    document.getElementById('chapterTitle').textContent = chapter.title;
    document.getElementById('chapterNum').textContent = `الفصل: ${chapter.id}`;
    
    // Typewriter effect for story text
    typewriteText('storyText', chapter.text);
    
    // Update choices
    updateChoices(chapter.choices);
  }
}

/**
 * Typewriter text animation - displays words instead of characters
 */
async function typewriteText(elementId, text) {
  const element = document.getElementById(elementId);
  element.textContent = '';
  
  isTypewriting = true;
  
  // Split text into words while preserving newlines
  const lines = text.split('\n');
  let displayText = '';
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      displayText += words[i];
      element.textContent = displayText;
      
      // Faster word-based typing (50ms per word instead of per character)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (i < words.length - 1) {
        displayText += ' ';
      }
    }
    
    // Add newline between paragraphs with a slight pause
    if (lineIdx < lines.length - 1) {
      displayText += '\n';
      element.textContent = displayText;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  isTypewriting = false;
}

/**
 * Update choice buttons
 */
function updateChoices(choices) {
  const container = document.getElementById('choicesContainer');
  container.innerHTML = '';
  
  if (choices && gameState.gamePhase === 'story') {
    choices.forEach(choice => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.textContent = choice.text;
      button.onclick = () => sendVote(choice.id);
      button.disabled = gameState.gamePhase === 'voting';
      
      container.appendChild(button);
    });
  }
}

/**
 * Update voting display
 */
function updateVoting() {
  const resultsDiv = document.getElementById('voteResults');
  resultsDiv.innerHTML = '';
  
  if (gameState.votes && gameState.votes.length > 0) {
    gameState.votes.forEach(vote => {
      const option = document.createElement('div');
      option.className = 'vote-option';
      option.innerHTML = `
        <div class="vote-option-text">${vote.choice}</div>
        <div class="vote-option-count">${vote.voteCount}</div>
      `;
      resultsDiv.appendChild(option);
    });
  }
}

/**
 * Update party composition
 */
function updatePartyComposition() {
  const composition = gameState.partyComposition;
  
  if (composition) {
    document.getElementById('warriors').textContent = composition.warriors || 0;
    document.getElementById('healers').textContent = composition.healers || 0;
    document.getElementById('scouts').textContent = composition.scouts || 0;
    document.getElementById('tricksters').textContent = composition.tricksters || 0;
  }
}

/**
 * Update game phase (story, battle, minigame, etc)
 */
function updateGamePhase() {
  const storyPanel = document.querySelector('.story-panel');
  const battleSection = document.getElementById('battleSection');
  const minigameSection = document.getElementById('minigameSection');
  const choicesContainer = document.getElementById('choicesContainer');
  
  // Hide all sections
  if (battleSection) battleSection.style.display = 'none';
  if (minigameSection) minigameSection.style.display = 'none';
  if (choicesContainer) choicesContainer.style.display = 'flex';
  
  const phase = gameState.gamePhase;
  
  switch (phase) {
    case 'story':
      // Story is already displayed
      if (choicesContainer) choicesContainer.style.display = 'flex';
      break;
    
    case 'voting':
      startVotingTimer();
      if (choicesContainer) choicesContainer.style.display = 'flex';
      break;
    
    case 'battle':
      displayBattle();
      if (choicesContainer) choicesContainer.style.display = 'none';
      if (battleSection) battleSection.style.display = 'block';
      break;
    
    case 'minigame':
      displayMinigame();
      if (choicesContainer) choicesContainer.style.display = 'none';
      if (minigameSection) minigameSection.style.display = 'block';
      break;
    
    case 'victory':
    case 'defeat':
      // Show endgame screen
      if (choicesContainer) choicesContainer.style.display = 'flex';
      break;
  }
}

/**
 * Display mini-game challenges
 */
function displayMinigame() {
  const minigameSection = document.getElementById('minigameSection') || document.querySelector('.minigame-section');
  
  if (!minigameSection) {
    console.warn('Mini-game section not found!');
    return;
  }
  
  // Create riddle game
  const riddleGame = `
    <div class="minigame-container" style="padding: 20px; background: rgba(0,0,0,0.7); border-radius: 10px;">
      <h2 style="color: #ffd700; margin-bottom: 20px;">🧩 لغز غامض!</h2>
      <div id="riddleDisplay" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p id="riddleText" style="font-size: 18px; color: #fff; margin: 10px 0;"></p>
      </div>
      <div id="riddleOptions" style="display: grid; gap: 10px;"></div>
      <p id="riddleHint" style="color: #ffd700; margin-top: 15px; font-style: italic;"></p>
    </div>
  `;
  
  minigameSection.innerHTML = riddleGame;
}

/**
 * Display battle interface
 */
function displayBattle() {
  const battleSection = document.getElementById('battleSection') || createBattleSection();
  
  const battleHTML = `
    <div class="battle-container" style="padding: 20px; background: linear-gradient(135deg, #8B0000, #000); border-radius: 10px;">
      <h2 style="color: #ff4444; text-align: center; margin-bottom: 20px;">⚔️ معركة حامية!</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- Hero Stats -->
        <div style="background: rgba(100,200,100,0.3); padding: 15px; border-radius: 5px;">
          <h3 style="color: #4CAF50;">👤 أنت</h3>
          <div class="health-bar" style="margin: 10px 0;">
            <div style="width: 100%; height: 20px; background: #333; border-radius: 10px; overflow: hidden;">
              <div style="width: ${(gameState.heroHealth / gameState.maxHealth) * 100}%; height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); transition: width 0.3s;"></div>
            </div>
            <p style="color: #fff; margin-top: 5px;">الصحة: ${gameState.heroHealth}/${gameState.maxHealth}</p>
          </div>
        </div>
        
        <!-- Enemy Stats -->
        <div style="background: rgba(200,50,50,0.3); padding: 15px; border-radius: 5px;">
          <h3 style="color: #f44336;">👹 العدو</h3>
          <div class="health-bar" style="margin: 10px 0;">
            <div style="width: 100%; height: 20px; background: #333; border-radius: 10px; overflow: hidden;">
              <div style="width: ${(gameState.battleStats.enemyHealth / gameState.battleStats.maxEnemyHealth) * 100}%; height: 100%; background: linear-gradient(90deg, #f44336, #e91e63); transition: width 0.3s;"></div>
            </div>
            <p style="color: #fff; margin-top: 5px;">الصحة: ${gameState.battleStats.enemyHealth}/${gameState.battleStats.maxEnemyHealth}</p>
          </div>
        </div>
      </div>
      
      <div id="battleActions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button onclick="sendBattleAction('attack')" style="padding: 10px; background: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">💥 هجوم عادي</button>
        <button onclick="sendBattleAction('heavy')" style="padding: 10px; background: #ff8800; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">⚔️ ضربة قوية</button>
        <button onclick="sendBattleAction('defend')" style="padding: 10px; background: #4488ff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🛡️ دفاع</button>
        <button onclick="sendBattleAction('heal')" style="padding: 10px; background: #44ff44; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">💚 شفاء</button>
      </div>
    </div>
  `;
  
  battleSection.innerHTML = battleHTML;
}

/**
 * Send battle action to server
 */
function sendBattleAction(action) {
  ws.send(JSON.stringify({
    type: 'battleAction',
    action: action,
    viewerId: viewerId,
  }));
  
  // Visual feedback
  const button = event.target;
  button.style.opacity = '0.5';
  setTimeout(() => { button.style.opacity = '1'; }, 500);
}

/**
 * Create battle section if it doesn't exist
 */
function createBattleSection() {
  const section = document.createElement('div');
  section.id = 'battleSection';
  section.className = 'battle-section';
  document.querySelector('.game-main').appendChild(section);
  return section;
}

// ============================================================
// BATTLE SYSTEM
// ============================================================

/**
 * Display battle interface
 */
function displayBattle() {
  const battleSection = document.getElementById('battleSection');
  battleSection.style.display = 'flex';
  
  const stats = gameState.battleStats;
  
  // Update hero health
  const heroHealthPercent = (gameState.heroHealth / gameState.maxHealth) * 100;
  document.getElementById('heroHealthBattle').style.width = heroHealthPercent + '%';
  document.getElementById('heroHealthText').textContent = 
    `${gameState.heroHealth}/${gameState.maxHealth}`;
  
  // Update enemy health
  const enemyHealthPercent = (stats.enemyHealth / stats.maxEnemyHealth) * 100;
  document.getElementById('enemyHealthBattle').style.width = enemyHealthPercent + '%';
  document.getElementById('enemyHealthText').textContent = 
    `${stats.enemyHealth}/${stats.maxEnemyHealth}`;
}

/**
 * Handle battle action
 */
function battleAction(actionType) {
  const battleLog = document.getElementById('battleLog');
  const logEntry = document.createElement('div');
  logEntry.className = 'battle-log-entry';
  
  let damage = 0;
  let message = '';
  
  switch (actionType) {
    case 'attack':
      damage = Math.floor(Math.random() * 20) + 10;
      message = `⚔️ هجوم قوي! -{damage} HP للعدو`;
      break;
    
    case 'defend':
      message = `🛡️ دفاع محكم! -25% الضرر التالي`;
      break;
    
    case 'special':
      damage = Math.floor(Math.random() * 40) + 20;
      message = `✨ مهارة خاصة! -{damage} HP للعدو`;
      break;
  }
  
  logEntry.textContent = message;
  battleLog.appendChild(logEntry);
  battleLog.scrollTop = battleLog.scrollHeight;
  
  // Send action to server
  ws.send(JSON.stringify({
    type: 'action',
    action: actionType,
  }));
}

// ============================================================
// MINI-GAME SYSTEM
// ============================================================

/**
 * Display mini-game interface
 */
function displayMinigame() {
  const minigameSection = document.getElementById('minigameSection');
  minigameSection.style.display = 'flex';
  
  const gameType = gameState.currentChoice;
  
  if (gameType === 'riddle') {
    displayRiddleGame();
  }
}

/**
 * Display riddle mini-game
 */
function displayRiddleGame() {
  const title = document.getElementById('minigameTitle');
  const content = document.getElementById('minigameContent');
  const buttons = document.getElementById('minigameButtons');
  
  title.textContent = '🧩 لغز الثعلب الماكر';
  content.textContent = 'أنا أتحدث بدون فم وأسمع بدون أذنين. ليس لدي جسد، لكن أحيا من خلال الريح. ما أنا؟';
  
  buttons.innerHTML = `
    <button class="minigame-btn" onclick="answerRiddle('echo')">صدى</button>
    <button class="minigame-btn" onclick="answerRiddle('sound')">صوت</button>
    <button class="minigame-btn" onclick="answerRiddle('voice')">صراخ</button>
    <button class="minigame-btn" onclick="answerRiddle('wind')">ريح</button>
  `;
}

/**
 * Submit riddle answer
 */
function answerRiddle(answer) {
  const isCorrect = ['echo', 'sound', 'voice'].includes(answer.toLowerCase());
  
  const battleLog = document.getElementById('battleLog');
  const logEntry = document.createElement('div');
  logEntry.className = 'battle-log-entry';
  
  if (isCorrect) {
    logEntry.textContent = `✅ إجابة صحيحة! +20 ضرر للعدو`;
  } else {
    logEntry.textContent = `❌ إجابة خاطئة! تحملت -10 HP`;
  }
  
  // Send answer to server
  ws.send(JSON.stringify({
    type: 'minigameAnswer',
    answer,
    isCorrect,
  }));
}

// ============================================================
// VOTING SYSTEM
// ============================================================

/**
 * Send vote/choice to server
 */
function sendVote(choice) {
  console.log(`🗳️ Voting for: ${choice}`);
  
  // Check if WebSocket is ready
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('❌ WebSocket not connected!');
    alert('خطأ: لم يتم الاتصال بالسيرفر!');
    return;
  }
  
  ws.send(JSON.stringify({
    type: 'vote',
    choice: choice,
    viewerId: viewerId,
  }));
  
  console.log(`✅ Choice sent: ${choice}`);
  
  // Disable choice buttons after voting
  document.querySelectorAll('.choice-button').forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
  
  // Show loading state
  const loadingSpinner = document.getElementById('loadingSpinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'flex';
  }
}

/**
 * Start voting countdown timer
 */
function startVotingTimer() {
  const timerElement = document.getElementById('votingTimer');
  let timeLeft = CONFIG.VOTING_TIME;
  
  if (votingTimer) clearInterval(votingTimer);
  
  votingTimer = setInterval(() => {
    timerElement.textContent = timeLeft.toString();
    
    if (timeLeft <= 0) {
      clearInterval(votingTimer);
      // Auto-submit votes
    }
    
    timeLeft--;
  }, 1000);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get emoji for role
 */
function getRoleEmoji(role) {
  const roleEmojis = {
    'Warrior': '⚔️',
    'Healer': '💚',
    'Scout': '🔍',
    'Trickster': '🎭',
  };
  
  return roleEmojis[role] || '👤';
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================
// PAGE LIFECYCLE
// ============================================================

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Streamer\'s Quest - Game Client Loaded');
  
  // Set RTL direction
  document.documentElement.dir = 'rtl';
  
  // Initialize connection
  initializeConnection();
  
  // Set background
  setRandomBackground();
});

/**
 * Set random background image
 */
function setRandomBackground() {
  const backgrounds = [
    'linear-gradient(135deg, rgba(15, 52, 96, 0.8) 0%, rgba(22, 33, 62, 0.9) 100%)',
    'linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(15, 52, 96, 0.95) 100%)',
  ];
  
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.getElementById('backgroundLayer').style.background = bg;
}

/**
 * Handle page visibility change (pause/resume updates)
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('⏸️ Game paused (tab hidden)');
  } else {
    console.log('▶️ Game resumed (tab visible)');
  }
});

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  if (ws) {
    ws.close();
  }
});

// ============================================================
// CONSOLE UTILITIES (for debugging)
// ============================================================

/**
 * Debug function to check game state
 */
function checkGameState() {
  console.table({
    'Player ID': viewerId,
    'Player Role': playerRole,
    'Game Phase': gameState.gamePhase,
    'Chapter': gameState.chapter?.id,
    'Hero Health': gameState.heroHealth,
    'Viewers': gameState.viewerCount,
    'Votes Cast': gameState.votes?.length || 0,
  });
}

// Make it available in console
window.checkGameState = checkGameState;
window.gameState = gameState;

console.log('💡 Tip: Use checkGameState() to debug the game state');
