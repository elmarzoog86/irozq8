'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FRUITS_DATA, getFruitIndexByNameAr } from '@/data/fruits';

interface FruitsWarVotingGameProps {
  players: Array<{ id: number; name: string; score: number; eliminated: boolean; joined: boolean; fruit?: string }>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

const FruitsWarVotingGame = forwardRef<
  { handleChatVote: (fruitName: string) => void },
  FruitsWarVotingGameProps
>(({
  players,
  setPlayers,
  onEndGame,
}, ref) => {
  const [votes, setVotes] = useState<Map<number, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState(60);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'voting' | 'results' | 'finished'>('waiting');
  const [voteChatLog, setVoteChatLog] = useState<Array<{username: string; fruit: string}>>([]);

  const joinedPlayers = players.filter(p => p.joined && !p.eliminated);

  // Assign fruits to players if not already assigned
  useEffect(() => {
    const updatedPlayers = [...players];
    let fruitIndex = 0;

    updatedPlayers.forEach((player, index) => {
      if (player.joined && !player.fruit) {
        updatedPlayers[index].fruit = FRUITS_DATA[fruitIndex % FRUITS_DATA.length].emoji;
        fruitIndex++;
      }
    });

    setPlayers(updatedPlayers);
  }, []);

  // Expose chat vote handler through ref - now takes fruit name in Arabic
  useImperativeHandle(ref, () => ({
    handleChatVote: (fruitName: string) => {
      if (gamePhase !== 'voting') return;
      
      // Find player by fruit name
      const fruitIndex = getFruitIndexByNameAr(fruitName);
      if (fruitIndex < 0) return;

      const targetPlayer = joinedPlayers[fruitIndex];
      if (targetPlayer) {
        handleVote(targetPlayer.id);
        setVoteChatLog(prev => [...prev.slice(-9), {username: 'chat', fruit: fruitName}]);
      }
    },
  }), [gamePhase, joinedPlayers]);

  // Timer logic
  useEffect(() => {
    if (gamePhase === 'voting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'voting' && timeLeft === 0) {
      // End voting phase and show results
      setGamePhase('results');
      setTimeout(() => eliminateTopVoted(), 2000);
    }
  }, [timeLeft, gamePhase]);

  // Start voting round
  const handleStartRound = () => {
    setVotes(new Map());
    setTimeLeft(60);
    setGamePhase('voting');
    setVoteChatLog([]);
  };

  // Handle vote
  const handleVote = (playerId: number) => {
    if (gamePhase !== 'voting') return;

    const newVotes = new Map(votes);
    newVotes.set(playerId, (newVotes.get(playerId) || 0) + 1);
    setVotes(newVotes);
  };

  // Get player with most votes
  const getMostVoted = (): { playerId: number; voteCount: number } | null => {
    if (votes.size === 0) return null;

    let maxVotes = 0;
    let mostVotedId: number | null = null;

    votes.forEach((voteCount, playerId) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        mostVotedId = playerId;
      }
    });

    return mostVotedId ? { playerId: mostVotedId, voteCount: maxVotes } : null;
  };

  // Eliminate player with most votes
  const eliminateTopVoted = () => {
    const mostVoted = getMostVoted();
    if (!mostVoted) return;

    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.id === mostVoted.playerId);
    if (playerIndex >= 0) {
      updatedPlayers[playerIndex].eliminated = true;
      setPlayers(updatedPlayers);
    }

    // Check if game should end
    const remainingAfterElimination = updatedPlayers.filter(p => p.joined && !p.eliminated).length;
    if (remainingAfterElimination === 1) {
      setGamePhase('finished');
    } else {
      // Reset for next round
      setVotes(new Map());
      setTimeLeft(60);
      setVoteChatLog([]);
      setGamePhase('voting');
    }
  };

  // Game over
  const winner = joinedPlayers.length === 1 ? joinedPlayers[0] : null;

  if (gamePhase === 'waiting') {
    return (
      <div className="w-screen h-screen flex flex-col fixed inset-0 bg-black items-center justify-center" dir="rtl">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-yellow-400">حرب الفواكه - التصويت</h1>
          <p className="text-2xl text-yellow-300">اختر من كل فاكهة لتصويت عليها</p>
          <button
            onClick={handleStartRound}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-lg text-2xl"
          >
            ▶️ ابدأ الجولة
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished' && winner) {
    return (
      <div className="w-screen h-screen flex flex-col fixed inset-0 bg-black items-center justify-center" dir="rtl">
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={onEndGame}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            ← العودة
          </button>
        </div>
        <div className="text-center space-y-12">
          <div className="text-8xl mb-8">🏆</div>
          <h1 className="text-7xl font-bold text-yellow-400">الفائز!</h1>
          <div className="text-5xl font-bold text-yellow-300 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 px-12 py-8 rounded-lg border-4 border-yellow-500">
            {winner.name}
          </div>
          <button
            onClick={onEndGame}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-lg text-2xl"
          >
            ← العودة للألعاب
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col fixed inset-0 bg-black" dir="rtl">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onEndGame}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          ← العودة
        </button>
      </div>

      {/* Title & Timer */}
      <div className="p-4 border-b-2 border-yellow-500 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400">حرب الفواكه - التصويت</h1>
        <div className="text-3xl font-bold text-yellow-300">
          ⏱️ {timeLeft}s
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <p className="text-2xl text-yellow-300 mb-2">اختر من تصوت عليه لاستبعاده</p>
          <p className="text-yellow-200">اكتب اسم الفاكهة في الدردشة للتصويت</p>
        </div>

        {/* Fruits Grid */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {joinedPlayers.map((player) => {
            const fruitEmoji = player.fruit || '🍎';
            const fruitData = FRUITS_DATA.find(f => f.emoji === fruitEmoji);
            const voteCount = votes.get(player.id) || 0;

            return (
              <div key={player.id} className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="text-8xl">{fruitEmoji}</div>
                  {voteCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {voteCount}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-yellow-300 font-bold text-lg">{fruitData?.nameAr}</p>
                  <p className="text-gray-400 text-sm">{player.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vote Chat Log */}
        {voteChatLog.length > 0 && (
          <div className="max-w-2xl w-full">
            <p className="text-yellow-300 font-bold mb-2">التصويتات:</p>
            <div className="bg-gray-900/50 border-2 border-yellow-500 rounded-lg p-4 space-y-1 max-h-32 overflow-y-auto">
              {voteChatLog.map((vote, idx) => (
                <div key={idx} className="text-yellow-200 text-sm">
                  صوت على: <span className="font-bold text-yellow-300">{vote.fruit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FruitsWarVotingGame.displayName = 'FruitsWarVotingGame';

export default FruitsWarVotingGame;