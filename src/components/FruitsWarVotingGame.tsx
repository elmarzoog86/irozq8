'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface FruitsWarVotingGameProps {
  players: Array<{ id: number; name: string; score: number; eliminated: boolean; joined: boolean; fruit?: string }>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

const FRUITS = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍', '🥭', '🍅', '🥒', '🌽'];

const FruitsWarVotingGame = forwardRef<
  { handleChatVote: (fruitIndex: number) => void },
  FruitsWarVotingGameProps
>(({
  players,
  setPlayers,
  onEndGame,
}, ref) => {
  const [votes, setVotes] = useState<Map<number, number>>(new Map());
  const [roundNumber, setRoundNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'voting' | 'results' | 'elimination'>('voting');

  const joinedPlayers = players.filter(p => p.joined && !p.eliminated);
  const remainingPlayers = joinedPlayers.length;

  // Expose chat vote handler through ref
  useImperativeHandle(ref, () => ({
    handleChatVote: (fruitIndex: number) => {
      if (gamePhase !== 'voting') return;
      if (fruitIndex < 0 || fruitIndex >= joinedPlayers.length) return;

      const targetPlayer = joinedPlayers[fruitIndex];
      if (targetPlayer) {
        handleVote(targetPlayer.id);
      }
    },
  }), [gamePhase, joinedPlayers]);

  // Assign fruits to players if not already assigned
  useEffect(() => {
    const updatedPlayers = [...players];
    let fruitIndex = 0;

    updatedPlayers.forEach((player, index) => {
      if (player.joined && !player.fruit) {
        updatedPlayers[index].fruit = FRUITS[fruitIndex % FRUITS.length];
        fruitIndex++;
      }
    });

    setPlayers(updatedPlayers);
  }, []);

  // Timer logic
  useEffect(() => {
    if (gamePhase === 'voting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'voting' && timeLeft === 0) {
      // End voting phase
      setGamePhase('results');
    }
  }, [timeLeft, gamePhase]);

  // Results display timer
  useEffect(() => {
    if (gamePhase === 'results') {
      const timer = setTimeout(() => {
        if (remainingPlayers > 2) {
          setGamePhase('elimination');
        } else {
          setGamePhase('voting'); // Final vote between last 2
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, remainingPlayers]);

  // Handle vote command from chat (simulated)
  const handleVote = (playerId: number) => {
    if (gamePhase !== 'voting') return;

    const newVotes = new Map(votes);
    newVotes.set(playerId, (newVotes.get(playerId) || 0) + 1);
    setVotes(newVotes);
  };

  // Get player with most votes
  const getMostVoted = (): number | null => {
    if (votes.size === 0) return null;

    let maxVotes = 0;
    let mostVotedId: number | null = null;

    votes.forEach((voteCount, playerId) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        mostVotedId = playerId;
      }
    });

    return mostVotedId;
  };

  // Eliminate player with most votes
  const eliminatePlayer = () => {
    const mostVotedId = getMostVoted();
    if (!mostVotedId) return;

    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.id === mostVotedId);
    if (playerIndex >= 0) {
      updatedPlayers[playerIndex].eliminated = true;
      updatedPlayers[playerIndex].score += 5;
      setPlayers(updatedPlayers);
    }

    // Reset for next round
    setVotes(new Map());
    setTimeLeft(30);
    setRoundNumber(roundNumber + 1);
    setGamePhase('voting');
  };

  // Handle elimination phase
  useEffect(() => {
    if (gamePhase === 'elimination' && remainingPlayers > 2) {
      const timer = setTimeout(() => {
        eliminatePlayer();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'elimination' && remainingPlayers === 2) {
      const timer = setTimeout(() => {
        setGamePhase('voting');
        setTimeLeft(20);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, remainingPlayers]);

  const mostVotedId = getMostVoted();
  const mostVotedPlayer = joinedPlayers.find(p => p.id === mostVotedId);

  if (remainingPlayers === 1) {
    return (
      <div className="w-screen h-screen flex flex-col fixed inset-0" dir="rtl" style={{ background: '#0f0f1e' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4">🏆 الفائز! 🏆</h1>
            <p className="text-4xl font-bold text-cyan-300 mb-8">{joinedPlayers[0]?.name}</p>
            <p className="text-2xl text-purple-300 mb-8">{joinedPlayers[0]?.fruit}</p>
            <button
              onClick={onEndGame}
              className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-lg text-xl"
            >
              العودة للألعاب
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col fixed inset-0" dir="rtl" style={{ background: '#0f0f1e' }}>
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onEndGame}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          ← العودة
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b-2 border-purple-500/50 p-6">
        <div className="flex justify-between items-center max-w-full">
          <div className="text-left">
            <p className="text-cyan-400 text-lg font-bold">الجولة #{roundNumber}</p>
            <p className="text-purple-300 text-sm">لاعبين متبقيين: {remainingPlayers}</p>
          </div>
          <h1 className="text-4xl font-bold text-purple-300 flex-1 text-center">حرب الفواكه - تصويت</h1>
          <div className="text-right">
            <p className="text-cyan-400 text-lg font-bold">
              {gamePhase === 'voting' ? `⏱️ ${timeLeft}s` : gamePhase === 'results' ? '📊 النتائج' : '❌ الإقصاء'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Vote Counter */}
        <div className="w-80 bg-gradient-to-b from-purple-950 to-black border-l-2 border-purple-500/30 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">الأصوات</h2>
          <div className="text-cyan-300 text-center mb-6 text-sm">
            <p className="mb-2">🎮 أكتب !join للدخول</p>
            <p className="text-xs text-purple-300">صوّت برقم الفاكهة 1-{joinedPlayers.length}</p>
          </div>
          <div className="space-y-3">
            {joinedPlayers.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  player.id === mostVotedId
                    ? 'border-red-500 bg-red-900/40 shadow-lg shadow-red-500/50'
                    : 'border-purple-500/30 bg-purple-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{player.fruit}</span>
                  <div className="text-right flex-1 mx-2">
                    <p className="font-bold text-cyan-300 text-sm">{player.name}</p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {votes.get(player.id) || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="text-8xl text-purple-500 absolute top-10 left-10">🏮</div>
            <div className="text-8xl text-purple-500 absolute top-10 right-10">🏮</div>
            <div className="text-8xl text-purple-500 absolute bottom-10 left-10">⭐</div>
            <div className="text-8xl text-purple-500 absolute bottom-10 right-10">⭐</div>
          </div>

          {gamePhase === 'voting' && (
            <div className="text-center relative z-10">
              <h2 className="text-5xl font-bold text-cyan-300 mb-12">صوّت للإقصاء!</h2>
              <div className="grid grid-cols-3 gap-6 mb-12">
                {joinedPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handleVote(player.id)}
                    className="p-6 rounded-2xl border-2 border-purple-500/50 bg-purple-900/30 cursor-pointer hover:border-cyan-500 hover:bg-purple-900/50 transition-all transform hover:scale-110"
                  >
                    <div className="text-7xl mb-4">{player.fruit}</div>
                    <p className="text-cyan-300 font-bold text-lg">{player.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-purple-400 text-lg">اكتب في الشات: !vote {Math.floor(Math.random() * joinedPlayers.length) + 1}</p>
            </div>
          )}

          {gamePhase === 'results' && mostVotedPlayer && mostVotedId !== null && (
            <div className="text-center relative z-10 animate-bounce">
              <h2 className="text-5xl font-bold text-red-400 mb-8">الأعلى أصواتاً</h2>
              <div className="text-9xl mb-8">{mostVotedPlayer.fruit}</div>
              <p className="text-3xl font-bold text-red-300 mb-4">{mostVotedPlayer.name}</p>
              <p className="text-2xl font-bold text-yellow-400">{votes.get(mostVotedId) || 0} أصوات</p>
            </div>
          )}

          {gamePhase === 'elimination' && mostVotedPlayer && (
            <div className="text-center relative z-10">
              <h2 className="text-5xl font-bold text-red-500 mb-8 animate-pulse">تم الإقصاء!</h2>
              <div className="text-9xl mb-8">{mostVotedPlayer.fruit}</div>
              <p className="text-3xl font-bold text-red-300">{mostVotedPlayer.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FruitsWarVotingGame.displayName = 'FruitsWarVotingGame';

export default FruitsWarVotingGame;