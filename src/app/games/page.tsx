/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useRef, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';
import QuestionsGame, { type QuestionsGameHandle } from '@/components/QuestionsGame';
import QuestionsLobby from '@/components/QuestionsLobby';
import MusicalChairsGame from '@/components/MusicalChairsGame';
import FruitsWarGame from '@/components/FruitsWarGame';
import ChairsGame from '@/components/ChairsGame';
import { useTwitchChat } from '@/hooks/useTwitchChat';
import { games } from '@/data/games';

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = searchParams.get('id');
  const sessionId = searchParams.get('session');
  
  // Initialize all hooks first, before any conditional returns
  const [playerCount, setPlayerCount] = useState(10);
  const [questionsCount, setQuestionsCount] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean; emoji?: string; number?: number; lives?: number}>>([]);
  const [consoleLogs, setConsoleLogs] = useState<Array<{id: string; message: string; type: 'join' | 'leave' | 'system' | 'action'; timestamp: string}>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{username: string; message: string; timestamp: string}>>([]);
  const usernameToIndexRef = useRef<Map<string, number>>(new Map());
  const questionsGameRef = useRef<QuestionsGameHandle>(null);
  const fruitWarVotingRef = useRef<{handleChatVote: (fruitIndex: number) => void} | null>(null);

  const game = games.find(g => g.id === gameId);

  // Early return after all hooks
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6">لم يتم العثور على اللعبة</h1>
          <button
            onClick={() => {
              if (sessionId) {
                router.push(`/?session=${sessionId}`);
              } else {
                router.push('/');
              }
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Memoize the onAnswer callback to prevent unnecessary re-connections
  const handleChatAnswer = useCallback((playerIndex: number, username: string, answer: string) => {
    console.log(`🎮 [GAMES] handleChatAnswer called: playerIndex=${playerIndex}, username=${username}, answer=${answer}`);
    
    // Auto-assign player index if not provided and username not seen before
    let actualPlayerIndex = playerIndex;
    if (playerIndex === 0 || playerIndex === undefined) {
      // Find if we've seen this username before (use ref to avoid hook re-triggers)
      if (!usernameToIndexRef.current.has(username)) {
        // Assign next available index
        actualPlayerIndex = usernameToIndexRef.current.size;
        usernameToIndexRef.current.set(username, actualPlayerIndex);
        console.log(`  → Assigned new player index: ${actualPlayerIndex} for ${username}`);
      } else {
        actualPlayerIndex = usernameToIndexRef.current.get(username) || 0;
        console.log(`  → Found existing player index: ${actualPlayerIndex} for ${username}`);
      }
    }
    
    console.log(`  → Passing to questionsGameRef.current with actualPlayerIndex=${actualPlayerIndex}`);
    if (questionsGameRef.current) {
      questionsGameRef.current.handleChatAnswer(actualPlayerIndex, username, answer);
      console.log(`  ✅ Called questionsGameRef.current.handleChatAnswer`);
    } else {
      console.log(`  ⚠️ questionsGameRef.current is null!`);
    }
  }, []);

  // Handle all chat messages - display in chat panel
  const handleChatMessage = useCallback((username: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setChatMessages(prevMessages => {
      // Check if the last message is identical to prevent duplicates
      if (prevMessages.length > 0) {
        const lastMsg = prevMessages[prevMessages.length - 1];
        if (lastMsg.username === username && lastMsg.message === message && lastMsg.timestamp === timestamp) {
          // Duplicate detected, don't add it
          console.log(`⏭️  [CHAT] Duplicate message detected: ${username}: ${message}, skipping`);
          return prevMessages;
        }
      }
      // Not a duplicate, add it
      console.log(`💬 [CHAT] Adding message: ${username}: ${message}`);
      return [...prevMessages, {
        username,
        message,
        timestamp,
      }];
    });
  }, []);

  // Handle chat join for Fruits War
  const handleChatJoin = useCallback((username: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Check if player already exists (get from current state to avoid double adds)
    setPlayers(prevPlayers => {
      const alreadyExists = prevPlayers.some(p => p.name === username);
      if (alreadyExists) return prevPlayers;

      // Create a new player with random emoji and profile image
      const emojis = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🥑'];
      // Use a generic Twitch profile URL format - will fallback to initials if not available
      const newPlayer = {
        id: prevPlayers.length + 1,
        name: username,
        score: 0,
        eliminated: false,
        joined: true,
        emoji: emojis[(prevPlayers.length) % emojis.length],
        profileImage: `https://static-cdn.jtvnw.net/jtv_user_pictures/${username.toLowerCase()}.png`,
      };

      return [...prevPlayers, newPlayer];
    });

    // Add to console log separately
    setConsoleLogs(prevLogs => [...prevLogs, {
      id: `join-${username}-${Date.now()}`,
      message: `${username} انضم إلى اللعبة`,
      type: 'join',
      timestamp,
    }]);
  }, []);

  // Handle chat voting for Fruits War voting game
  const handleChatVote = useCallback((voteData: {playerIndex: number; username: string}) => {
    if (fruitWarVotingRef.current) {
      fruitWarVotingRef.current.handleChatVote(voteData.playerIndex);
    }
  }, []);

  // Connect to Twitch chat when game is running
  useTwitchChat({
    sessionId: sessionId || '',
    enabled: gameStarted,
    onAnswer: handleChatAnswer,
    onMessage: handleChatMessage,
    onJoin: handleChatJoin,
    onVote: handleChatVote,
  });

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">لم يتم العثور على اللعبة</h1>
          <button 
            onClick={() => {
              if (sessionId) {
                router.push(`/?session=${sessionId}`);
              } else {
                router.push('/');
              }
            }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    // For Questions game, show the lobby directly
    if (gameId === 'questions') {
      return (
        <div className="w-full h-screen" style={{ background: '#0f0f1e' }}>
          <QuestionsLobby 
            onStartGame={(playerCount, questionsCount) => {
              const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
                id: i + 1,
                name: `لاعب ${i + 1}`,
                score: 0,
                eliminated: false,
                joined: false, // Initially not joined
              }));
              setPlayers(newPlayers);
              setPlayerCount(playerCount);
              setQuestionsCount(questionsCount);
              setGameStarted(true);
            }}
            onBack={() => {
              if (sessionId) {
                router.push(`/?session=${sessionId}`);
              } else {
                router.push('/');
              }
            }}
          />
        </div>
      );
    }

    // For Fruits War game, start immediately without settings
    if (gameId === 'fruits-war') {
      // Start with empty players array - only add when they join via chat
      setPlayers([]);
      setGameStarted(true);
      // Return nothing to let it render the game on next render
      return null;
    }

    // For Chairs game, start immediately with 100 players
    if (gameId === 'chairs') {
      const infinitePlayers = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `لاعب ${i + 1}`,
        score: 0,
        eliminated: false,
        joined: false,
      }));
      setPlayers(infinitePlayers);
      setGameStarted(true);
      // Return nothing to let it render the game on next render
      return null;
    }

    return (
      <GameLayout 
        gameName={game.nameAr}
        gameDescription={game.descriptionAr}
        onBack={() => {
          if (sessionId) {
            router.push(`/?session=${sessionId}`);
          } else {
            router.push('/');
          }
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-yellow-500/30 overflow-hidden bg-gray-950 p-8 aspect-video flex items-center justify-center">
              <img 
                src={`/games/${gameId}.svg`} 
                alt={game.nameAr}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 p-6 bg-gray-950 border border-yellow-500/30 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-300 mb-3">📋 قواعد اللعبة</h3>
              <p className="text-gray-300">{game.descriptionAr}</p>
              <p className="text-sm text-gray-400 mt-4">👥 عدد اللاعبين: {game.minPlayers}-{game.maxPlayers}</p>
            </div>
          </div>

          {/* Pre-Game Settings */}
          <div className="bg-gray-950 border border-yellow-500/30 rounded-lg p-6">
            {gameId !== 'questions' ? (
              // For other games, show settings
              <>
                <h3 className="text-lg font-bold text-yellow-300 mb-6">إعدادات البدء</h3>
                
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-3">عدد اللاعبين</label>
                  <input
                    type="range"
                    min={game.minPlayers}
                    max={game.maxPlayers}
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{game.minPlayers}</span>
                    <span className="text-yellow-400 font-bold">{playerCount}</span>
                    <span>{game.maxPlayers}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
                      id: i + 1,
                      name: `لاعب ${i + 1}`,
                      score: 0,
                      eliminated: false,
                      joined: false,
                    }));
                    setPlayers(newPlayers);
                    setGameStarted(true);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg mb-2"
                >
                  ✓ بدء اللعبة
                </button>
                <button 
                  onClick={() => {
                    if (sessionId) {
                      router.push(`/?session=${sessionId}`);
                    } else {
                      router.push('/');
                    }
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg border border-gray-700"
                >
                  ← العودة
                </button>
              </>
            ) : (
              // Questions game doesn't show pre-game settings
              null
            )}
          </div>
        </div>
      </GameLayout>
    );
  }

  // Render appropriate game component
  const renderGameComponent = () => {
    const gameProps = {
      playerCount,
      players,
      setPlayers,
      onEndGame: () => {
        console.log('🔙 onEndGame called, navigating back...');
        // Navigate back to home while preserving session (do this first)
        if (sessionId) {
          router.push(`/?session=${sessionId}`);
        } else {
          router.push('/');
        }
        // Then set game started to false
        setGameStarted(false);
      },
    };

    switch (gameId) {
      case 'questions':
        return <QuestionsGame 
          ref={questionsGameRef}
          {...gameProps} 
          questionsPerRound={questionsCount}
        />;
      case 'roulette':
        return <MusicalChairsGame {...gameProps} />;
      case 'fruits-war':
        return <FruitsWarGame {...gameProps} onChatJoin={handleChatJoin} />;
      case 'chairs':
        return <ChairsGame {...gameProps} />;
      default:
        return <div className="text-center text-red-400">لعبة غير معروفة</div>;
    }
  };

  return (
    <>
      <GameLayout 
        gameName={game.nameAr}
        gameDescription={game.descriptionAr}
        onBack={() => setGameStarted(false)}
        players={players}
        consoleLogs={consoleLogs}
        chatMessages={chatMessages}
      >
        {renderGameComponent()}
      </GameLayout>
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400">جاري التحميل...</h1>
        </div>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}
