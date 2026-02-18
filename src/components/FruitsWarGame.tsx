'use client';

import { useState, useRef } from 'react';
import FruitsWarModeSelector from './FruitsWarModeSelector';
import FruitsWarVotingGame from './FruitsWarVotingGame';

interface FruitsWarGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean; fruit?: string}>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
  onChatJoin?: (username: string) => void;
}

export default function FruitsWarGame({
  players,
  setPlayers,
  onEndGame,
  onChatJoin,
}: FruitsWarGameProps) {
  const [gameMode, setGameMode] = useState<'roulette' | 'voting' | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<{id: number; name: string; eliminated: boolean} | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const votingGameRef = useRef<{handleChatVote: (fruitIndex: number) => void} | null>(null);

  // Get only joined players
  const joinedPlayers = players.filter(p => p.joined);

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinning || joinedPlayers.length === 0) return;

    setIsSpinning(true);
    setSelectedPlayer(null);

    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const randomIndex = Math.floor(Math.random() * joinedPlayers.length);
    const sliceDegree = 360 / joinedPlayers.length;
    const newRotation = rotation + 360 * spins + randomIndex * sliceDegree;

    setRotation(newRotation);

    // After spin completes, show selected player
    setTimeout(() => {
      const selected = joinedPlayers[randomIndex];
      setSelectedPlayer({
        id: selected.id,
        name: selected.name,
        eliminated: selected.eliminated,
      });
      setIsSpinning(false);
    }, 3000);
  };

  const handleEliminateSelected = () => {
    if (!selectedPlayer) return;

    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.id === selectedPlayer.id);
    if (playerIndex >= 0) {
      updatedPlayers[playerIndex].eliminated = true;
      updatedPlayers[playerIndex].score += 5;
      setPlayers(updatedPlayers);
      setSelectedPlayer(null);
    }
  };

  // Show mode selector if no mode selected yet
  if (!gameMode) {
    return (
      <FruitsWarModeSelector
        players={players}
        setPlayers={setPlayers}
        onModeSelect={setGameMode}
        onEndGame={onEndGame}
        onChatJoin={onChatJoin}
      />
    );
  }

  // Show voting game if voting mode selected
  if (gameMode === 'voting') {
    return (
      <FruitsWarVotingGame
        ref={votingGameRef}
        players={players}
        setPlayers={setPlayers}
        onEndGame={onEndGame}
      />
    );
  }

  // Roulette mode (original implementation)
  return (
    <div className="w-screen h-screen flex flex-col fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950" dir="rtl">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onEndGame}
          className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
        >
          ← العودة
        </button>
      </div>

      {/* Game Screen with Wheel and Players - Main Lobby */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Player Names List */}
        <div className="w-96 bg-gradient-to-b from-purple-950/50 to-slate-950/50 border-l-2 border-cyan-500/30 p-8 overflow-y-auto flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-12">حرب الفواكه</h2>
          <div className="text-cyan-400 text-center mb-12 text-lg font-semibold">
            <p>أكتب !join للدخول</p>
          </div>
          <div className="space-y-3 w-full">
            {joinedPlayers.length > 0 ? (
              joinedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-lg border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-600/20 to-pink-600/20 text-center hover:from-cyan-600/30 hover:to-pink-600/30 transition-all"
                >
                  <div className="font-bold text-cyan-300">{player.name}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-purple-400 py-12">
                في انتظار المشاركين...
              </div>
            )}
          </div>
        </div>

        {/* Main Game Area - Wheel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="text-8xl text-cyan-400 absolute top-10 left-10">🏮</div>
            <div className="text-8xl text-pink-400 absolute top-10 right-10">🏮</div>
            <div className="text-8xl text-amber-400 absolute bottom-10 left-10">⭐</div>
            <div className="text-8xl text-cyan-400 absolute bottom-10 right-10">⭐</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-12 relative z-10">حرب الفواكه - روليت</h1>

          {/* Wheel Container */}
          <div className="relative w-96 h-96 mb-12 z-10">
            {/* Pointer at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-cyan-400"></div>
            </div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-8 border-pink-500/50 relative overflow-hidden transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? '3s' : '0s',
                transitionTimingFunction: isSpinning ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'linear',
                background: 'conic-gradient(from 0deg, #ec4899, #a855f7, #ec4899, #a855f7, #ec4899, #a855f7, #ec4899, #a855f7)',
              }}
            >
              {/* Center Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-black border-4 border-cyan-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-300">لف</span>
                </div>
              </div>

              {/* Player Names */}
              {players.map((player) => {
                const angle = (360 / players.length) * players.indexOf(player) + (360 / players.length) / 2;
                const distance = 120;
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * distance;
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * distance;

                return (
                  <div
                    key={player.id}
                    className="absolute text-white font-bold text-sm"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                    }}
                  >
                    {player.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 z-10">
            <button
              onClick={handleSpin}
              disabled={isSpinning || players.filter(p => !p.eliminated).length === 0}
              className={`font-bold py-4 px-16 rounded-lg text-xl transition-all ${
                isSpinning || players.filter(p => !p.eliminated).length === 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white cursor-pointer shadow-lg shadow-cyan-500/50'
              }`}
            >
              {isSpinning ? '⏳ يدور...' : '🎡 ابدأ الدوران'}
            </button>

            {selectedPlayer && !selectedPlayer.eliminated && (
              <button
                onClick={handleEliminateSelected}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg"
              >
                ❌ استبعد {selectedPlayer.name}
              </button>
            )}

            {selectedPlayer && selectedPlayer.eliminated && (
              <div className="text-red-400 text-lg font-bold">
                تم استبعاد {selectedPlayer.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
