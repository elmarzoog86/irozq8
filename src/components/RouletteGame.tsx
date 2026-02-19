'use client';

import { useState, useRef } from 'react';
// رابط صوت الاستبعاد (يمكنك استبداله لاحقاً)
const ELIMINATE_SOUND = '/games/eliminate.mp3';

interface Player {
  id: number;
  name: string;
  score: number;
  eliminated: boolean;
  joined: boolean;
  lives?: number;
}

interface RouletteGameProps {
  playerCount: number;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onEndGame: () => void;
}

export default function RouletteGame({
  playerCount,
  players,
  setPlayers,
  onEndGame,
}: RouletteGameProps) {

  // تحديث: منطق الأرواح والاستبعاد
  // إذا lives > 1، عند الاستبعاد يتم إنقاص الأرواح، وإذا revive=true يمكن إعادة اللاعب للحياة
  const [isSpinning, setIsSpinning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const colors = ['#FF006E', '#00D9FF', '#A855F7', '#FFD700', '#00FF00', '#FF6B35', '#004E89', '#1DB888'];

  const handleSpin = () => {
    if (isSpinning || !gameActive) return;

    setIsSpinning(true);
    const activePlayers = players.filter(p => !p.eliminated);
    
    if (activePlayers.length === 0) {
      setGameActive(false);
      setIsSpinning(false);
      return;
    }

    // Random spin between 5-8 full rotations plus final position
    const randomPlayer = Math.floor(Math.random() * activePlayers.length);
    const segmentAngle = 360 / activePlayers.length;
    const finalRotation = 360 * (5 + Math.random() * 3) + randomPlayer * segmentAngle;

    setRotation(finalRotation);
    setSpinCount(spinCount + 1);

    // Reveal winner after spin completes
    setTimeout(() => {
      setSelectedPlayer(activePlayers[randomPlayer].name);
      const updatedPlayers = [...players];
      const winnerIndex = updatedPlayers.findIndex(p => p.name === activePlayers[randomPlayer].name);
      if (winnerIndex >= 0) {
        updatedPlayers[winnerIndex].score += 10;
        setPlayers(updatedPlayers);
      }
      setIsSpinning(false);
    }, 4000);
  };

  const handleEliminateWinner = () => {
    if (!selectedPlayer) return;
    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.name === selectedPlayer);
    if (playerIndex >= 0) {
      // إذا كان لديه أرواح
      if (typeof updatedPlayers[playerIndex].lives === 'number' && updatedPlayers[playerIndex].lives > 1) {
        updatedPlayers[playerIndex].lives -= 1;
      } else {
        updatedPlayers[playerIndex].eliminated = true;
        // تشغيل صوت الاستبعاد
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }
      updatedPlayers[playerIndex].score -= 5; // عقوبة
    }
    setPlayers(updatedPlayers);
    setSelectedPlayer(null);

    const activePlayers = updatedPlayers.filter(p => !p.eliminated);
    if (activePlayers.length <= 1) {
      setGameActive(false);
    }
  };

  const activePlayers = players.filter(p => !p.eliminated);
  const remainingCount = activePlayers.length;

  return (
    <div className="w-full">
      {gameActive ? (
        <>
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-yellow-300 mb-4">
              🎡 الروليت - الجولة {spinCount + 1}
            </div>
            <div className="text-lg text-yellow-200">
              اللاعبون المتبقيون: {remainingCount}/{playerCount}
            </div>
          </div>

          {/* قائمة اللاعبين مع الأرواح */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 ${player.eliminated ? 'border-red-500 opacity-50' : 'border-yellow-500'}`}
                style={{ background: player.eliminated ? 'rgba(255,0,0,0.1)' : 'rgba(0,217,255,0.2)' }}
              >
                <div className="text-xl font-bold text-yellow-300">{player.name}</div>
                <div className="text-lg text-yellow-400 mt-2">النقاط: {player.score}</div>
                {typeof player.lives === 'number' && !player.eliminated && (
                  <div className="text-yellow-200 mt-2">الأرواح: <span className="font-bold">{player.lives}</span></div>
                )}
                {player.eliminated && (
                  <div className="flex flex-col items-center mt-2">
                    <div className="text-red-400 text-sm mb-1">مستبعد نهائياً ❌</div>
                    {/* أنيميشن عصا الشخص */}
                    <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* الرأس */}
                      <circle cx="24" cy="14" r="10" fill="#fff" stroke="#f00" strokeWidth="2"/>
                      {/* الجسم */}
                      <rect x="22" y="24" width="4" height="18" rx="2" fill="#f00">
                        <animate attributeName="y" values="24;28;24" dur="0.7s" repeatCount="indefinite"/>
                        <animate attributeName="height" values="18;14;18" dur="0.7s" repeatCount="indefinite"/>
                      </rect>
                      {/* اليد اليمنى */}
                      <line x1="24" y1="28" x2="38" y2="40" stroke="#f00" strokeWidth="3">
                        <animate attributeName="y2" values="40;44;40" dur="0.7s" repeatCount="indefinite"/>
                      </line>
                      {/* اليد اليسرى */}
                      <line x1="24" y1="28" x2="10" y2="40" stroke="#f00" strokeWidth="3">
                        <animate attributeName="y2" values="40;44;40" dur="0.7s" repeatCount="indefinite"/>
                      </line>
                      {/* الرجل اليمنى */}
                      <line x1="24" y1="42" x2="36" y2="60" stroke="#f00" strokeWidth="3">
                        <animate attributeName="y2" values="60;64;60" dur="0.7s" repeatCount="indefinite"/>
                      </line>
                      {/* الرجل اليسرى */}
                      <line x1="24" y1="42" x2="12" y2="60" stroke="#f00" strokeWidth="3">
                        <animate attributeName="y2" values="60;64;60" dur="0.7s" repeatCount="indefinite"/>
                      </line>
                    </svg>
                    {/* عنصر صوتي مخفي */}
                    <audio ref={audioRef} src={ELIMINATE_SOUND} preload="auto" style={{ display: 'none' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Roulette Wheel */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-6 border-r-6 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400"
                     style={{
                       borderLeft: '12px solid transparent',
                       borderRight: '12px solid transparent',
                       borderTop: '20px solid #FFD700',
                       filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                     }}>
                </div>
              </div>

              {/* Wheel */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.98)' : 'none',
                }}
              >
                {activePlayers.map((player, index) => {
                  const startAngle = (index * 360) / activePlayers.length;
                  const endAngle = ((index + 1) * 360) / activePlayers.length;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 100 + 100 * Math.cos(startRad);
                  const y1 = 100 + 100 * Math.sin(startRad);
                  const x2 = 100 + 100 * Math.cos(endRad);
                  const y2 = 100 + 100 * Math.sin(endRad);
                  
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                  const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  
                  return (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={colors[index % colors.length]}
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <text
                        x={100 + 60 * Math.cos((startRad + endRad) / 2)}
                        y={100 + 60 * Math.sin((startRad + endRad) / 2)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold fill-white"
                        style={{
                          fontSize: '11px',
                          pointerEvents: 'none',
                          transform: `translate(0, 0)`,
                        }}
                      >
                        <tspan>{player.name}</tspan>
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected Player Display */}
          {selectedPlayer && (
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 rounded-lg border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-400 mb-4">🎯 الفائز!</div>
              <div className="text-2xl font-bold text-yellow-300 mb-6">{selectedPlayer}</div>
              <button
                onClick={handleEliminateWinner}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg"
              >
                ❌ استبعد هذا اللاعب
              </button>
            </div>
          )}

          {/* Spin Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleSpin}
              disabled={isSpinning || !selectedPlayer === false}
              className={`text-white font-bold py-4 px-12 rounded-lg text-lg transition-all ${
                isSpinning || selectedPlayer
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 cursor-pointer'
              }`}
              style={{
                boxShadow: !isSpinning && !selectedPlayer ? '0 0 20px rgba(0, 217, 255, 0.4)' : 'none'
              }}
            >
              {isSpinning ? '⏳ جاري الدوران...' : '🎡 أدر العجلة'}
            </button>
          </div>

          {/* Players List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 text-center ${
                  player.eliminated
                    ? 'border-red-500 opacity-50 bg-red-900/20'
                    : 'border-yellow-500 bg-yellow-900/20'
                }`}
              >
                <div className="font-bold text-yellow-300">{player.name}</div>
                <div className="text-2xl font-bold text-yellow-400 mt-2">{player.score}</div>
                {player.eliminated && <div className="text-red-400 text-sm mt-2">مستبعد</div>}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-yellow-300 mb-8">🏆 انتهت اللعبة! 🏆</h2>

          {/* Final Rankings */}
          <div className="space-y-4 mb-8">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 rounded-lg border-2 border-yellow-500"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-yellow-300">
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      {player.name}
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{player.score}</div>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={onEndGame}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            ← العودة للألعاب
          </button>
        </div>
      )}
    </div>
  );
}
