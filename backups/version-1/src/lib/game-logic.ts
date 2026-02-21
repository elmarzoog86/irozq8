/**
 * Game Logic Handlers
 * Contains specific game logic for each game type
 */

import {
  GameSession,
  getGameSession,
  updateGameData,
  updateViewer,
  updateViewerScore,
} from './game-state';
import { sendChatMessage } from './twitch-chat-service';

export interface GameLogicHandler {
  gameId: string;
  initialize: (session: GameSession) => void;
  startRound: (session: GameSession) => Promise<void>;
  endRound: (session: GameSession) => Promise<void>;
  processVote: (session: GameSession, userId: string, vote: string) => Promise<void>;
  processAnswer: (session: GameSession, userId: string, answer: string) => Promise<void>;
}

/**
 * Questions Game Logic
 */
export const questionsGameLogic: GameLogicHandler = {
  gameId: 'questions',

  initialize: (session: GameSession) => {
    const questions = [
      { id: 1, text: 'ما هي عاصمة السعودية؟', options: ['الرياض', 'جدة', 'الدمام'], answer: 'الرياض' },
      { id: 2, text: 'كم عدد قارات العالم؟', options: ['5', '6', '7'], answer: '7' },
      { id: 3, text: 'ما هو أطول نهر في العالم؟', options: ['نيل', 'أمازون', 'يانغتسه'], answer: 'نيل' },
    ];

    updateGameData(session.sessionId, {
      questions,
      currentQuestionIndex: 0,
      answers: new Map(),
      roundStartTime: Date.now(),
    });

    session.currentRound = 1;
  },

  startRound: async (session: GameSession) => {
    const currentQuestion = session.gameData.questions[session.gameData.currentQuestionIndex];
    if (!currentQuestion) {
      await sendChatMessage(`🏁 انتهت جميع الأسئلة! تم اللعب!`);
      return;
    }

    await sendChatMessage(
      `📝 السؤال ${session.currentRound}: ${currentQuestion.text}\nالخيارات: ${currentQuestion.options.join(' | ')}\nأجب بـ !answer <الخيار>`
    );
  },

  endRound: async (session: GameSession) => {
    const currentQuestion = session.gameData.questions[session.gameData.currentQuestionIndex];
    const answers = session.gameData.answers as Map<string, string>;

    let correctCount = 0;
    let correctPlayers: string[] = [];

    session.viewers.forEach(viewer => {
      const userAnswer = answers.get(viewer.userId);
      if (userAnswer?.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        correctCount++;
        correctPlayers.push(viewer.username);
        updateViewerScore(session.sessionId, viewer.userId, 10);
      }
    });

    if (correctPlayers.length > 0) {
      await sendChatMessage(
        `✅ الإجابة الصحيحة: ${currentQuestion.answer}\n🎉 اللاعبون الذين أجابوا بشكل صحيح: ${correctPlayers.join(', ')}`
      );
    } else {
      await sendChatMessage(`❌ لا أحد أجاب بشكل صحيح! الإجابة الصحيحة: ${currentQuestion.answer}`);
    }

    // Move to next question
    session.gameData.currentQuestionIndex++;
    session.gameData.answers.clear();
    session.currentRound = (session.currentRound || 0) + 1;
  },

  processVote: async () => {
    // Not used for questions game
  },

  processAnswer: async (session: GameSession, userId: string, answer: string) => {
    const answers = session.gameData.answers as Map<string, string>;
    answers.set(userId, answer);
  },
};

/**
 * Roulette Game Logic
 */
export const rouletteGameLogic: GameLogicHandler = {
  gameId: 'roulette',

  initialize: (session: GameSession) => {
    updateGameData(session.sessionId, {
      spinInProgress: false,
      winner: null,
      spinHistory: [],
    });
  },

  startRound: async (session: GameSession) => {
    await sendChatMessage(
      `🎡 الجولة ${session.currentRound}: الروليت جاهزة! اللاعبون: ${session.viewers.size}\nأرسل !vote للدخول في الدوران!`
    );
  },

  endRound: async (session: GameSession) => {
    if (session.viewers.size === 0) {
      await sendChatMessage(`❌ لا يوجد لاعبون للعب`);
      return;
    }

    const players = Array.from(session.viewers.values());
    const winner = players[Math.floor(Math.random() * players.length)];

    updateViewerScore(session.sessionId, winner.userId, 5);

    await sendChatMessage(
      `🎊 رقم الفائز: ${players.indexOf(winner) + 1}\n🏆 الفائز: ${winner.username}!`
    );

    session.currentRound = (session.currentRound || 0) + 1;
  },

  processVote: async (session: GameSession, userId: string) => {
    const viewer = session.viewers.get(userId);
    if (!viewer) return;

    await sendChatMessage(`✅ ${viewer.username} انضم إلى دوران الروليت!`);
  },

  processAnswer: async () => {
    // Not used for roulette game
  },
};

/**
 * Fruits War Game Logic
 */
export const fruitsWarGameLogic: GameLogicHandler = {
  gameId: 'fruits-war',

  initialize: (session: GameSession) => {
    const fruits = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓', '🍒', '🍑'];
    const assignments = new Map<string, string>();

    let idx = 0;
    session.viewers.forEach((viewer) => {
      assignments.set(viewer.userId, fruits[idx % fruits.length]);
      idx++;
    });

    updateGameData(session.sessionId, {
      assignments,
      eliminated: new Set(),
      fruitCount: Math.min(8, session.viewers.size),
    });
  },

  startRound: async (session: GameSession) => {
    const assignments = session.gameData.assignments as Map<string, string>;

    let message = `🍎 حرب الفواكه جارية!\nاللاعبون:\n`;
    session.viewers.forEach(viewer => {
      const fruit = assignments.get(viewer.userId);
      message += `${fruit} ${viewer.username}\n`;
    });
    message += `\n!vote <اسم_لاعب> لاختيار من تريد إلغاءه!`;

    await sendChatMessage(message);
  },

  endRound: async (session: GameSession) => {
    const votes = new Map<string, number>();

    session.viewers.forEach(viewer => {
      const vote = viewer.role;
      if (vote) {
        votes.set(vote, (votes.get(vote) || 0) + 1);
      }
    });

    if (votes.size === 0) {
      await sendChatMessage(`⚠️ لا توجد تصويتات في هذه الجولة`);
      return;
    }

    let maxVotes = 0;
    let eliminated = '';

    votes.forEach((count, player) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminated = player;
      }
    });

    const eliminatedViewer = Array.from(session.viewers.values()).find(
      v => v.username === eliminated
    );

    if (eliminatedViewer) {
      session.viewers.delete(eliminatedViewer.userId);
      await sendChatMessage(
        `❌ ${eliminatedViewer.username} تم اختياره! عدد اللاعبين المتبقيين: ${session.viewers.size}`
      );
    }

    if (session.viewers.size === 1) {
      const winner = Array.from(session.viewers.values())[0];
      updateViewerScore(session.sessionId, winner.userId, 20);
      await sendChatMessage(`🏆 الفائز: ${winner.username}!`);
    }

    session.currentRound = (session.currentRound || 0) + 1;
  },

  processVote: async (session: GameSession, userId: string, vote: string) => {
    updateViewer(session.sessionId, userId, { role: vote });
  },

  processAnswer: async () => {
    // Not used for fruits war
  },
};

/**
 * Chairs Game Logic
 */
export const chairsGameLogic: GameLogicHandler = {
  gameId: 'chairs',

  initialize: (session: GameSession) => {
    const chairCount = Math.max(1, session.viewers.size - 1);

    updateGameData(session.sessionId, {
      chairCount,
      musicPlaying: false,
      standing: new Set(Array.from(session.viewers.keys())),
    });

    session.currentRound = 1;
  },

  startRound: async (session: GameSession) => {
    const chairCount = session.gameData.chairCount;

    await sendChatMessage(
      `🪑 جولة ${session.currentRound}: ${session.viewers.size} لاعب و ${chairCount} كرسي!\n🎵 بدء الموسيقى!`
    );
  },

  endRound: async (session: GameSession) => {
    const standing = session.gameData.standing as Set<string>;
    const chairCount = session.gameData.chairCount;

    if (standing.size > chairCount) {
      const toLose = standing.size - chairCount;
      let eliminated = 0;

      for (const userId of standing) {
        if (eliminated >= toLose) break;

        const viewer = session.viewers.get(userId);
        if (viewer) {
          await sendChatMessage(`❌ ${viewer.username} لم يجد كرسي!`);
          session.viewers.delete(userId);
          standing.delete(userId);
          eliminated++;
        }
      }

      session.gameData.chairCount = Math.max(1, chairCount - 1);
    }

    if (session.viewers.size === 1) {
      const winner = Array.from(session.viewers.values())[0];
      updateViewerScore(session.sessionId, winner.userId, 25);
      await sendChatMessage(`🏆 الفائز: ${winner.username}!`);
    } else {
      session.currentRound = (session.currentRound || 0) + 1;
    }

    session.gameData.standing.clear();
  },

  processVote: async (session: GameSession, userId: string) => {
    const standing = session.gameData.standing as Set<string>;
    standing.add(userId);
  },

  processAnswer: async () => {
    // Not used for chairs game
  },
};

/**
 * Get game logic handler
 */
export function getGameLogic(gameId: string): GameLogicHandler | null {
  const handlers: Record<string, GameLogicHandler> = {
    questions: questionsGameLogic,
    roulette: rouletteGameLogic,
    'fruits-war': fruitsWarGameLogic,
    chairs: chairsGameLogic,
  };

  return handlers[gameId] || null;
}

/**
 * Initialize game with appropriate logic
 */
export function initializeGame(session: GameSession): void {
  const handler = getGameLogic(session.gameId);
  if (!handler) {
    console.warn(`No game logic found for: ${session.gameId}`);
    return;
  }

  handler.initialize(session);
  console.log(`✓ Game initialized: ${session.gameId}`);
}

/**
 * Start game round
 */
export async function startGameRound(sessionId: string): Promise<void> {
  const session = getGameSession(sessionId);
  if (!session) return;

  const handler = getGameLogic(session.gameId);
  if (!handler) return;

  await handler.startRound(session);
}

/**
 * End game round and calculate scores
 */
export async function endGameRound(sessionId: string): Promise<void> {
  const session = getGameSession(sessionId);
  if (!session) return;

  const handler = getGameLogic(session.gameId);
  if (!handler) return;

  await handler.endRound(session);
}

/**
 * Process player vote
 */
export async function processPlayerVote(
  sessionId: string,
  userId: string,
  vote: string
): Promise<void> {
  const session = getGameSession(sessionId);
  if (!session) return;

  const handler = getGameLogic(session.gameId);
  if (!handler) return;

  await handler.processVote(session, userId, vote);
}

/**
 * Process player answer
 */
export async function processPlayerAnswer(
  sessionId: string,
  userId: string,
  answer: string
): Promise<void> {
  const session = getGameSession(sessionId);
  if (!session) return;

  const handler = getGameLogic(session.gameId);
  if (!handler) return;

  await handler.processAnswer(session, userId, answer);
}
