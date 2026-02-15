/**
 * Streamer's Quest - WebSocket Server
 * Real-time collaborative RPG for Twitch streaming
 * Author: Game Developer
 * Version: 1.0.0
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// ============================================================
// GAME STATE MANAGEMENT
// ============================================================

class GameState {
  constructor() {
    this.currentChapter = 0;
    this.heroHealth = 100;
    this.maxHealth = 100;
    this.experience = 0;
    this.supplies = 50;
    this.maxSupplies = 100;
    this.viewers = new Map();
    this.votes = new Map();
    this.gamePhase = 'story'; // story, voting, battle, minigame, victory, defeat
    this.currentChoice = null;
    this.battleStats = {
      enemyHealth: 50,
      maxEnemyHealth: 50,
      damageTaken: 0,
      damageDealt: 0,
    };
    this.inventory = [];
    this.partyComposition = {
      warriors: 0,
      healers: 0,
      scouts: 0,
      tricksters: 0,
    };
  }

  addViewer(id, name) {
    const role = this.assignRole();
    this.viewers.set(id, {
      name,
      role,
      joinedAt: Date.now(),
    });
    return role;
  }

  assignRole() {
    const roles = ['Warrior', 'Healer', 'Scout', 'Trickster'];
    const role = roles[Math.floor(Math.random() * roles.length)];
    this.partyComposition[role.toLowerCase() + 's']++;
    return role;
  }

  addVote(viewerId, choice) {
    if (!this.votes.has(choice)) {
      this.votes.set(choice, []);
    }
    this.votes.get(choice).push(viewerId);
  }

  getWinningChoice() {
    let maxVotes = 0;
    let winningChoice = null;
    
    for (const [choice, voters] of this.votes) {
      if (voters.length > maxVotes) {
        maxVotes = voters.length;
        winningChoice = choice;
      }
    }
    
    return winningChoice;
  }

  resetVotes() {
    this.votes.clear();
  }

  removeViewer(id) {
    if (this.viewers.has(id)) {
      const viewer = this.viewers.get(id);
      this.partyComposition[viewer.role.toLowerCase() + 's']--;
      this.viewers.delete(id);
    }
  }
}

// ============================================================
// STORY CHAPTERS AND BRANCHING LOGIC
// ============================================================

const storyChapters = [
  {
    id: 0,
    title: '🎭 البدايات الغامضة',
    text: `تستيقظ في حانة غامضة محاطة برجال بأرواح شريرة. يقترب منك غريب يرتدي عباءة سوداء ويحمل لفيفة قديمة...\n\n"مرحبا بك أيها الشجاع! مملكة إلدوريا في خطر عظيم!\n\nتم سرقة كريستال النور الأبدي من قبل سادة الظلام. بدونه، ستغطي الظلمة الدائمة العالم كله في غضون 7 أيام.\n\nهل تقبل هذه المهمة الخطيرة؟"`,
    choices: [
      { id: 'accept', text: '⚔️ أقبل المهمة! ', action: 'story', nextChapter: 1 },
      { id: 'decline', text: '🚪 أرفض وأغادر الحانة', action: 'story', nextChapter: 'ending_reject' },
      { id: 'ask', text: '❓ أطلب المزيد من المعلومات', action: 'story', nextChapter: 0.5 },
    ],
    background: 'tavern',
  },
  {
    id: 0.5,
    title: '💭 المزيد من التفاصيل',
    text: `يجلس الغريب ويبدأ بحكايته:\n\n"كريستال النور الأبدي هو مصدر الحياة في عالمنا. وقد تم نقله إلى قلعة سيد الظلام في الشمال.\n\nالطريق خطيرة جداً، لكن هناك قرى يمكنك زيارتها للحصول على معدات وحلفاء:"\n\n1. 🏘️ قرية الحرفيين - اصنع أسلحة قوية\n2. 🏰 حصن الفرسان - التحق بجيش الأبطال\n3. 🌙 معبد الجادين - اكتسب قوى سحرية`,
    choices: [
      { id: 'understand', text: '✅ فهمت! لنبدأ الآن', action: 'story', nextChapter: 1 },
      { id: 'back', text: '↩️ أريد أن أعود للخلف', action: 'story', nextChapter: 0 },
    ],
    background: 'tavern',
  },
  {
    id: 1,
    title: '🛣️ الفصل الأول: رحلة لا تُنسى',
    text: `"رائع! وجهتك الأولى هي غابة الهمسات المحظورة. تقول الأساطير أن ثعلب الخدعة، وهو كائن غامض بصلات مع سادة الظلام، يسكن هناك.\n\nقبل رحيلك، يقدم لك الحكيم القديم خيارات ثلاثة:"`,
    choices: [
      { id: 'sword', text: '⚔️ خذ سيف أسطوري قوي', action: 'story', nextChapter: 2, effect: { supplies: -10, health: 5 } },
      { id: 'potion', text: '🧪 خذ 5 جرعات علاج سحرية', action: 'story', nextChapter: 2, effect: { supplies: -15, health: 20 } },
      { id: 'map', text: '🗺️ خذ خريطة سحرية توجهك', action: 'story', nextChapter: 2, effect: { supplies: -5, health: 0 } },
    ],
    background: 'forest',
  },
  {
    id: 2,
    title: '🦊 الفصل الثاني: مواجهة الثعلب الخادع',
    text: `تخترق غابة الهمسات المحظورة. الأشجار القديمة الملتوية تحيط بك من كل جانب...\n\nفجأة! ⚡ يظهر ثعلب من الظلام! له تسعة ذيول تتوهج باللون الأزرق الشبحي!\n\n"مرحباً بك أيها الجريء! لدي لغز لك:\nإذا أجبت بشكل صحيح، سأعطيك معلومات ثمينة عن سيد الظلام.\nوإذا أخطأت... فسنتقاتل حتى الموت!"\n\n❓ اللغز: أتحدث بدون فم وأسمع بدون آذان، وليس لدي جسد لكنني أحيا مع الريح. من أنا؟`,
    choices: [
      { id: 'riddle_echo', text: '🎤 صدى الصوت', action: 'minigame', minigameType: 'riddle', correct: true, nextChapter: 3 },
      { id: 'riddle_wind', text: '💨 الريح', action: 'minigame', minigameType: 'riddle', correct: false, nextChapter: 3 },
      { id: 'riddle_fight', text: '⚔️ قاتل مباشرة بدون حل اللغز', action: 'battle', enemyHealth: 60, nextChapter: 3 },
    ],
    background: 'forest-dark',
  },
  {
    id: 3,
    title: '🏘️ الفصل الثالث: القرية المسحورة',
    text: `بعد مغادرتك الغابة، تصل إلى قرية صغيرة محاطة بضباب غريب.\n\nالسكان يبدون حزينين ومكتئبين. تقترب منك عجوز:\n\n"هلا بك أيها الغريب! قريتنا ملعونة! وحش قديم يعيش في جبالنا ويسرق محاصيلنا كل ليلة!\n\nإذا ساعدتنا في التخلص من هذا الوحش، سنزودك بمعدات قيمة جداً للمعركة القادمة!"\n\nماذا تفعل؟`,
    choices: [
      { id: 'help_village', text: '🤝 ساعد القرية والقضاء على الوحش', action: 'battle', enemyHealth: 80, nextChapter: 3.5 },
      { id: 'leave_village', text: '🚶 تابع رحلتك دون مساعدتهم', action: 'story', nextChapter: 4 },
      { id: 'negotiate_village', text: '💬 حاول التفاوض مع الوحش', action: 'minigame', minigameType: 'negotiation', nextChapter: 4 },
    ],
    background: 'village-gloomy',
  },
  {
    id: 3.5,
    title: '🎁 مكافأة القرية',
    text: `بعد هزيمة الوحش، تحتفل القرية بفرح عظيم!\n\nتقدم العجوز لك هدايا ثمينة:\n\n✨ درع الحماية الذهبي (يزيد الدفاع +30)\n🗡️ سيف القسم (يزيد الهجوم +25)\n🧴 إكسير النشاط (استعدة 50 صحة)\n🎁 نقود ذهبية (تساعدك في الشراء)\n\nتشعر بقوة جديدة تملأ جسدك! الآن أنت مستعد لمواجهة سيد الظلام!\n\nتابع رحلتك نحو القلعة المظلمة...`,
    choices: [
      { id: 'continue', text: '➡️ اتجه نحو القلعة', action: 'story', nextChapter: 4 },
    ],
    background: 'village-happy',
  },
  {
    id: 4,
    title: '🏰 الفصل الرابع: أسوار القلعة المحظورة',
    text: `تقترب من قلعة سيد الظلام. أسوارها السوداء تلتهب بنيران خضراء غريبة.\n\nعند البوابة الرئيسية، تقف ثلاثة حراس رهيبة:\n\n1. 🖤 فارس الظلام - مسلح بسيف من الظلام النقي\n2. 🔮 الساحرة اللعنة - تهمس تعاويذ غامضة\n3. 👹 الشيطان - عينوه تتوهجان بنيران الجحيم\n\nكيف تريد أن تمضي قدماً؟`,
    choices: [
      { id: 'sneak', text: '🤫 التسلل بحذر (دور الكشاف)', action: 'minigame', minigameType: 'stealth', roleBonus: 'Scout', nextChapter: 5 },
      { id: 'charge', text: '⚔️ هجوم مباشر (دور المحارب)', action: 'battle', enemyHealth: 100, nextChapter: 5, roleBonus: 'Warrior' },
      { id: 'magic', text: '� هجوم سحري (دور الساحر)', action: 'minigame', minigameType: 'magic', roleBonus: 'Mage', nextChapter: 5 },
    ],
    background: 'castle',
  },
  {
    id: 5,
    title: '👑 الفصل الخامس: عرش الظلام',
    text: `تخترق أسوار القلعة! ممرات طويلة مظلمة تقودك إلى قاعة العرش الكبرى.\n\nهناك! على عرش من الهيماتيت الأسود يجلس سيد الظلام بكل فخره!\n\nأمامه مباشرة، يطفو كريستال النور الأبدي، ينبض بطاقة خانقة مظلمة.\n\n"آه... بطل جريء قد جاء!" يضحك بشكل مرعب. "دعنا نرى ما إذا كنت قوياً بما يكفي لمواجهتي!\"\n\nمعركتك الأخيرة قد بدأت!`,
    choices: [
      { id: 'final_battle', text: '⚔️ معركة نهائية! - هاجم مباشرة', action: 'battle', enemyHealth: 150, nextChapter: 6 },
      { id: 'sacrifice', text: '💫 ضحّ بنفسك لختم الظلام', action: 'story', nextChapter: 'ending_sacrifice' },
      { id: 'talk', text: '💬 حاول التواصل معه قبل القتال', action: 'minigame', minigameType: 'negotiation', nextChapter: 6 },
    ],
    background: 'castle-throne',
  },
  {
    id: 6,
    title: '✨ النصر! تم إنقاذ المملكة!',
    text: `بضربة أخيرة قوية، يتحول سيد الظلام إلى رماد وغبار!\n\n⚡ يرتفع كريستال النور الأبدي في الهواء! ✨\n\nيغمر النور الذهبي الساحر كلها والمملكة بأكملها!\n\n🎉 اللعنة مكسورة! مملكة إلدوريا محررة!\n\nتخرج من القلعة وتجد الناس يستقبلونك كبطل أسطوري!\n\nاسمك سيُتذكر إلى الأبد في التاريخ! 👑\n\nهنيئاً بك أيها البطل! لقد أنقذت العالم!`,
    choices: [
      { id: 'restart', text: '🔄 ابدأ مغامرة جديدة', action: 'story', nextChapter: 0 },
      { id: 'credits', text: '🎬 اعرض الشهادات', action: 'story', nextChapter: 'credits' },
    ],
    background: 'victory',
  },
  {
    id: 'ending_sacrifice',
    title: '😔 النهاية الحزينة: التضحية النهائية',
    text: `تقترب خطوة تلو الخطوة من كريستال النور الأبدي.\n\nتشعر بقوة سادة الظلام تحاول سحبك للداخل، لكنك تقاوم!\n\nتمسك بالكريستال وتضحي بحياتك كي تخترق اللعنة!\n\n✨ في لحظة من الضياء الأبدي، تختفي الظلمة للأبد!\n\nقد ضحيت بنفسك من أجل الملايين! سيتم الاحتفال بك كقديس!`,
    choices: [
      { id: 'restart', text: '🔄 ابدأ من جديد', action: 'story', nextChapter: 0 },
    ],
    background: 'sacrifice',
  },
  {
    id: 'ending_reject',
    title: '🚪 تركت الحانة',
    text: `تترك الحانة دون قبول المهمة.\n\nبينما تغادر المدينة، تبدأ الظلام بالزحف على المملكة...\n\nبعد أسابيع، تسمع أن مملكة إلدوريا سقطت تحت سيطرة سادة الظلام!\n\nهل حقاً كانت هذه النهاية التي تريدها؟`,
    choices: [
      { id: 'restart', text: '🔄 جرب مرة أخرى', action: 'story', nextChapter: 0 },
    ],
    background: 'dark-ending',
  },
  {
    id: 'credits',
    title: '🎬 شهادات',
    text: `شكراً لتلعب Streamer's Quest!\n\nتم تطوير هذه اللعبة بواسطة:\n👨‍💻 فريق التطوير\n🎨 فريق التصميم  \n🎵 فريق الموسيقى\n\nشكراً لمتابعيك على الدعم المستمر!\n\nنتطلع لرؤيتك في مغامرات جديدة قريباً! 🚀`,
    choices: [
      { id: 'restart', text: '🔄 لعب مرة أخرى', action: 'story', nextChapter: 0 },
    ],
    background: 'credits',
  },
];

// ============================================================
// MINI-GAME IMPLEMENTATIONS (بالعربية!)
// ============================================================

const miniGames = {
  riddle: [
    {
      question: '❓ أتحدث بدون فم وأسمع بدون آذان، وليس لدي جسد لكنني أحيا مع الريح. من أنا؟',
      answers: ['صدى', 'echo', 'صدى الصوت'],
      correctAnswer: 'صدى',
      hint: '💡 فكر في الأصوات التي تعود إليك من الجبال!',
      reward: 50,
    },
    {
      question: '❓ لدي مفاتيح لكن لا توجد أقفال. لدي مساحة لكن لا يوجد أثاث. لدي مدخل لكن بدون باب. ما أنا؟',
      answers: ['لوحة المفاتيح', 'keyboard', 'لوحة'],
      correctAnswer: 'لوحة المفاتيح',
      hint: '💡 أنا ضروري للكتابة والعمل على الحاسوب!',
      reward: 50,
    },
    {
      question: '❓ كلما أخذت منها، كلما زادت. ما أنا؟',
      answers: ['الحفرة', 'hole', 'البئر'],
      correctAnswer: 'الحفرة',
      hint: '💡 كلما حفرت أعمق، زاد عمق الحفرة!',
      reward: 50,
    },
    {
      question: '❓ أنا حية لكن ليس لدي روح. أتنفس لكن ليس لدي رئة. أنجب الأطفال لكن ليس لدي قلب. ما أنا؟',
      answers: ['النار', 'fire'],
      correctAnswer: 'النار',
      hint: '💡 أضيء الظلام وأدفئ البرد!',
      reward: 75,
    },
    {
      question: '❓ لدي مدن ولكن لا توجد منازل. لدي جبال لكن لا تنمو أشجار. لدي ماء لكن لا توجد أسماك. ما أنا؟',
      answers: ['الخريطة', 'map'],
      correctAnswer: 'الخريطة',
      hint: '💡 تستخدمني للتنقل والسفر!',
      reward: 50,
    },
  ],
  
  stealth: {
    description: 'اختبر براعتك في التسلل!',
    challenges: [
      { text: '🕷️ تجنب الحارس الأول - اضغط الفراغ في التوقيت المناسب!', difficulty: 'easy', reward: 30 },
      { text: '🕷️🕷️ تجنب حارسين - توقيت مزدوج!', difficulty: 'medium', reward: 50 },
      { text: '🕷️🕷️🕷️ تجنب ثلاثة حراس - تحدٍ صعب!', difficulty: 'hard', reward: 100 },
    ],
  },
  
  magic: {
    description: 'اطلق القوى السحرية!',
    spells: [
      { name: '🔥 كرة النار', damage: 30, cost: 20, cooldown: 2 },
      { name: '🧊 عاصفة الجليد', damage: 25, cost: 15, cooldown: 1 },
      { name: '⚡ البرق الأبدي', damage: 40, cost: 35, cooldown: 3 },
      { name: '🌙 ظل القمر', damage: 20, cost: 10, cooldown: 1 },
      { name: '💚 شفاء القلب', damage: 0, heal: 40, cost: 25, cooldown: 3 },
    ],
  },
  
  negotiation: {
    dialogues: [
      {
        npc: 'فارس الظلام',
        text: '"لماذا لا تنضم إلينا بدلاً من القتال؟ لدينا قوة لا نهاية لها!"',
        options: [
          { text: '❌ لا! سأحمي المملكة!', success: true, reward: 50 },
          { text: '❓ دعني أفكر...', success: false, reward: 0 },
          { text: '✅ قد يكون لديك نقطة...', success: false, reward: -30 },
        ],
      },
      {
        npc: 'الساحرة اللعنة',
        text: '"السلام أفضل من الحرب... ما رأيك؟"',
        options: [
          { text: '✅ أوافق تماماً!', success: true, reward: 40 },
          { text: '❌ الحرب لا مفر منها!', success: false, reward: 0 },
          { text: '❓ هل يمكننا الوصول لاتفاق؟', success: true, reward: 60 },
        ],
      },
    ],
  },

  battle: {
    actionTypes: [
      { name: 'الهجوم العادي', damage: 15, energy: 10, description: '💥 هاجم بكل قوتك!' },
      { name: 'الضربة القوية', damage: 30, energy: 25, description: '⚔️ ضربة مميتة!' },
      { name: 'الدفاع', damage: 0, energy: 10, defense: 20, description: '🛡️ حماية نفسك!' },
      { name: 'الشفاء', damage: 0, energy: 20, heal: 30, description: '💚 تعافي!' },
      { name: 'الهجوم السحري', damage: 40, energy: 40, description: '🔥 هجوم سحري!' },
    ],
  },
};

// ============================================================
// GAME STATE INSTANCE
// ============================================================

const gameState = new GameState();
const clients = new Set();

// ============================================================
// WEBSOCKET EVENT HANDLERS
// ============================================================

wss.on('connection', (ws) => {
  console.log('New viewer connected');
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Viewer disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(ws, data) {
  switch (data.type) {
    case 'join':
      handleJoin(ws, data.viewer);
      break;
    case 'vote':
      handleVote(ws, data);
      break;
    case 'action':
      handleAction(ws, data);
      break;
    case 'streamerCommand':
      handleStreamerCommand(data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

/**
 * Handle viewer joining
 */
function handleJoin(ws, viewerName) {
  const viewerId = Math.random().toString(36).substr(2, 9);
  const role = gameState.addViewer(viewerId, viewerName || `Viewer_${viewerId}`);
  
  ws.viewerId = viewerId;
  ws.send(JSON.stringify({
    type: 'joinConfirm',
    viewerId,
    role,
    gameState: getPublicGameState(),
  }));

  broadcastUpdate();
}

/**
 * Handle viewer voting
 */
function handleVote(ws, data) {
  console.log(`📨 Vote received from viewer: ${data.choice}`);
  
  // Accept votes in story or voting phase
  if ((gameState.gamePhase === 'voting' || gameState.gamePhase === 'story') && ws.viewerId) {
    gameState.addVote(ws.viewerId, data.choice);
    console.log(`✅ Vote processed: ${data.choice}`);
    broadcastUpdate();

    // In story mode, immediately process the choice instead of waiting for voting
    if (gameState.gamePhase === 'story') {
      // Get the winning choice (just the first/only choice in story mode)
      processVotingResults();
    } else {
      // In voting mode, check if voting threshold is reached
      const totalVotes = Array.from(gameState.votes.values()).reduce((sum, votes) => sum + votes.length, 0);
      if (totalVotes >= gameState.viewers.size * 0.8) {
        // 80% of viewers have voted - execute choice
        processVotingResults();
      }
    }
  } else {
    console.warn(`⚠️ Vote rejected - phase: ${gameState.gamePhase}, viewerId: ${ws.viewerId}`);
  }
}

/**
 * Handle general player actions
 */
function handleAction(ws, data) {
  // Placeholder for future action handling
  console.log('Player action:', data.action);
}

/**
 * Handle streamer commands (for control panel)
 */
function handleStreamerCommand(data) {
  switch (data.command) {
    case 'skipVoting':
      processVotingResults();
      break;
    case 'restartGame':
      gameState.gamePhase = 'story';
      gameState.currentChapter = 0;
      gameState.heroHealth = gameState.maxHealth;
      gameState.votes.clear();
      broadcastUpdate();
      break;
    case 'healHero':
      gameState.heroHealth = Math.min(gameState.heroHealth + 20, gameState.maxHealth);
      broadcastUpdate();
      break;
    case 'damageEnemy':
      gameState.battleStats.enemyHealth = Math.max(0, gameState.battleStats.enemyHealth - 10);
      broadcastUpdate();
      break;
    default:
      console.log('Unknown command:', data.command);
  }
}

/**
 * Process voting results and move to next choice
 */
function processVotingResults() {
  const winner = gameState.getWinningChoice();
  
  if (winner) {
    gameState.currentChoice = winner;
    gameState.gamePhase = 'processing';
    
    setTimeout(() => {
      executeChoice(winner);
      gameState.resetVotes();
      gameState.gamePhase = 'story';
      broadcastUpdate();
    }, 2000);
  }
}

/**
 * Execute the chosen action
 */
function executeChoice(choiceId) {
  const chapter = storyChapters[gameState.currentChapter];
  const choice = chapter.choices.find(c => c.id === choiceId);
  
  if (choice) {
    // Apply effects
    if (choice.effect) {
      if (choice.effect.supplies) gameState.supplies += choice.effect.supplies;
      if (choice.effect.health) gameState.heroHealth += choice.effect.health;
    }

    // Move to next chapter or action
    if (choice.action === 'story') {
      gameState.currentChapter = choice.nextChapter;
    } else if (choice.action === 'battle') {
      gameState.gamePhase = 'battle';
      gameState.battleStats.enemyHealth = choice.enemyHealth;
      gameState.battleStats.maxEnemyHealth = choice.enemyHealth;
    } else if (choice.action === 'minigame') {
      gameState.gamePhase = 'minigame';
      gameState.currentChoice = choice.minigameType;
    }
  }
}

/**
 * Get public game state (visible to all clients)
 */
function getPublicGameState() {
  return {
    chapter: storyChapters[gameState.currentChapter],
    heroHealth: gameState.heroHealth,
    maxHealth: gameState.maxHealth,
    experience: gameState.experience,
    supplies: gameState.supplies,
    maxSupplies: gameState.maxSupplies,
    viewerCount: gameState.viewers.size,
    partyComposition: gameState.partyComposition,
    gamePhase: gameState.gamePhase,
    votes: Array.from(gameState.votes.entries()).map(([choice, voters]) => ({
      choice,
      voteCount: voters.length,
    })),
    battleStats: gameState.battleStats,
  };
}

/**
 * Broadcast game state update to all connected clients
 */
function broadcastUpdate() {
  const gameStateJson = JSON.stringify({
    type: 'gameStateUpdate',
    gameState: getPublicGameState(),
    timestamp: Date.now(),
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(gameStateJson);
    }
  });
}

// ============================================================
// REST API ENDPOINTS (for streamer control panel)
// ============================================================

app.get('/api/game-state', (req, res) => {
  res.json(getPublicGameState());
});

app.post('/api/streamer-command', (req, res) => {
  handleStreamerCommand(req.body);
  res.json({ success: true });
});

// ============================================================
// SERVER START
// ============================================================

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Streamer's Quest - Game Server       ║
║   Version 1.0.0                        ║
╚════════════════════════════════════════╝

🎮 Server running on http://localhost:${PORT}
📡 WebSocket ready for real-time updates
🎯 Ready for streaming!
  `);
});

module.exports = { gameState, broadcastUpdate };
