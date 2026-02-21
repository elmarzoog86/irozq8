'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  number?: number;
  lives?: number;
  eliminated: boolean;
  joined: boolean;
  score?: number;
  emoji?: string;
}

interface RouletteGameProps {
  playerCount?: number;
  players: Player[];
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

export default function RouletteGame({
  players,
  setPlayers,
  onEndGame,
}: RouletteGameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [maxLives, setMaxLives] = useState(3);
  const [allowRevive, setAllowRevive] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [shootInput, setShootInput] = useState('');
  const [reviveInput, setReviveInput] = useState('');
  const [actionMode, setActionMode] = useState<'shoot' | 'revive' | null>(null);

  const colors = ['#FF006E', '#00D9FF', '#A855F7', '#FFD700', '#00FF00', '#FF6B35', '#004E89', '#1DB888'];

  // Initialize players with numbers when game starts
  useEffect(() => {
    if (gameStarted && !gameActive) {
      // Reset for new game
      setGameActive(true);
    }
  }, [gameStarted]);

  const activePlayers = players.filter(p => !p.eliminated);

  const handleSpin = () => {
    if (isSpinning || activePlayers.length === 0) return;

    setIsSpinning(true);
    
    const randomPlayer = Math.floor(Math.random() * activePlayers.length);
    const segmentAngle = 360 / activePlayers.length;
    const finalRotation = 360 * (5 + Math.random() * 3) + randomPlayer * segmentAngle;

    setRotation(finalRotation);
    setSpinCount(spinCount + 1);

    setTimeout(() => {
      setSelectedPlayer(activePlayers[randomPlayer]);
      setShootInput('');
      setReviveInput('');
      setActionMode(null);
      setIsSpinning(false);
    }, 4000);
  };

  const handleShoot = (targetNumber: number) => {
    if (!selectedPlayer) return;
    
    const target = players.find(p => p.number === targetNumber && !p.eliminated);
    if (!target) return;

    const updatedPlayers = [...players];
    const targetIndex = updatedPlayers.findIndex(p => p.id === target.id);
    
    if (targetIndex >= 0) {
      updatedPlayers[targetIndex].lives = (updatedPlayers[targetIndex].lives || 0) - 1;
      
      if ((updatedPlayers[targetIndex].lives || 0) <= 0) {
        updatedPlayers[targetIndex].eliminated = true;
      }
    }
    
    setPlayers(updatedPlayers);
    setSelectedPlayer(null);
    setShootInput('');
    setActionMode(null);

    // Check if only one player remains
    const remaining = updatedPlayers.filter(p => !p.eliminated);
    if (remaining.length <= 1) {
      setGameActive(false);
    }
  };

  const handleRevive = (targetNumber: number) => {
    if (!selectedPlayer || !allowRevive) return;
    
    const target = players.find(p => p.number === targetNumber && p.eliminated);
    if (!target) return;

    const updatedPlayers = [...players];
    const targetIndex = updatedPlayers.findIndex(p => p.id === target.id);
    
    if (targetIndex >= 0) {
      updatedPlayers[targetIndex].eliminated = false;
      updatedPlayers[targetIndex].lives = maxLives;
    }
    
    setPlayers(updatedPlayers);
    setSelectedPlayer(null);
    setReviveInput('');
    setActionMode(null);
  };

  const startGame = () => {
    const joinedPlayers = players.filter(p => p.joined);
    const updatedPlayers = joinedPlayers.map((p, index) => ({
      ...p,
      number: index + 1,
      lives: maxLives,
      eliminated: false,
    }));
    
    setPlayers(updatedPlayers);
    setGameStarted(true);
    setGameActive(true);
  };

  const remainingCount = activePlayers.length;

  return (
    <div className="w-full">
      {!gameStarted ? (
        // Settings Screen
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-300 mb-8">🎡 لعبة الروليت</h1>
          
          <div className="bg-gray-950/50 border-2 border-yellow-500/30 rounded-lg p-8 max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">⚙️ إعدادات اللعبة</h2>
            
            {/* Lives Setting */}
            <div className="mb-8">
              <label className="text-yellow-200 font-bold block mb-3">عدد الأرواح (1-5):</label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setMaxLives(Math.max(1, maxLives - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  −
                </button>
                <div className="text-4xl font-bold text-yellow-400 w-12 text-center">{maxLives}</div>
                <button
                  onClick={() => setMaxLives(Math.min(5, maxLives + 1))}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Revive Toggle */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <label className="text-yellow-200 font-bold">تفعيل الإحياء:</label>
              <button
                onClick={() => setAllowRevive(!allowRevive)}
                className={`w-16 h-8 rounded-full transition-all ${
                  allowRevive ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  allowRevive ? 'translate-x-8' : 'translate-x-1'
                }`}></div>
              </button>
              <span className="text-yellow-300 font-bold">{allowRevive ? 'مفعّل ✓' : 'معطّل ✗'}</span>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              disabled={players.filter(p => p.joined).length === 0}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              🎮 ابدأ اللعبة
            </button>
          </div>

          {/* Players waiting */}
          <div className="bg-gray-900/50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-yellow-300 font-bold mb-4">اللاعبون المنتظرون:</h3>
            {players.filter(p => p.joined).length === 0 ? (
              <p className="text-yellow-200">في انتظار انضمام اللاعبين...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {players.filter(p => p.joined).map((p, idx) => (
                  <div key={p.id} className="bg-yellow-900/30 border border-yellow-500 rounded p-2 text-yellow-300 text-center font-bold">
                    #{idx + 1} {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : gameActive ? (
        // Game Playing State
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-300 mb-2">🎡 الروليت - الجولة {spinCount + 1}</h1>
            <p className="text-yellow-200 text-lg">اللاعبون المتبقيون: {remainingCount}/{activePlayers.length + players.filter(p => p.eliminated).length}</p>
          </div>

          {/* Players with Lives */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 text-center ${
                  player.eliminated
                    ? 'border-red-500 opacity-50 bg-red-900/20'
                    : 'border-yellow-500 bg-yellow-900/20'
                }`}
              >
                <div className="text-2xl font-bold text-yellow-300">#{player.number}</div>
                <div className="text-lg font-bold text-yellow-300 mt-1">{player.name}</div>
                <div className="text-yellow-400 mt-2">
                  {'❤️'.repeat(Math.max(0, player.lives || 0))}
                </div>
                {player.eliminated && (
                  <div className="text-red-400 text-sm mt-2 font-bold">مستبعد</div>
                )}
              </div>
            ))}
          </div>

          {/* Roulette Wheel */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div style={{
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '20px solid #FFD700',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}></div>
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
                {activePlayers.length === 0 ? (
                  <circle cx="100" cy="100" r="90" fill="rgba(100,100,100,0.3)" stroke="#666" strokeWidth="2" />
                ) : (
                  activePlayers.map((player, index) => {
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
                            fontSize: '12px',
                            pointerEvents: 'none',
                          }}
                        >
                          <tspan>#{player.number}</tspan>
                        </text>
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
          </div>

          {/* Selected Player & Action */}
          {selectedPlayer && (
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 rounded-lg border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-400 mb-2">🎯 اللاعب المختار!</div>
              <div className="text-2xl font-bold text-yellow-300 mb-2">#{selectedPlayer.number} - {selectedPlayer.name}</div>
              
              <div className="flex gap-4 justify-center flex-wrap mt-6">
                <button
                  onClick={() => setActionMode(actionMode === 'shoot' ? null : 'shoot')}
                  className={`py-3 px-6 rounded-lg font-bold text-white ${
                    actionMode === 'shoot'
                      ? 'bg-red-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  🔫 إطلاق
                </button>
                {allowRevive && (
                  <button
                    onClick={() => setActionMode(actionMode === 'revive' ? null : 'revive')}
                    className={`py-3 px-6 rounded-lg font-bold text-white ${
                      actionMode === 'revive'
                        ? 'bg-green-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    ♻️ إحياء
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedPlayer(null);
                    setShootInput('');
                    setReviveInput('');
                    setActionMode(null);
                  }}
                  className="py-3 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  ⏭️ تخطي
                </button>
              </div>

              {/* Shoot Input */}
              {actionMode === 'shoot' && (
                <div className="mt-6 flex gap-2 justify-center items-center flex-wrap">
                  <input
                    type="number"
                    min="1"
                    max={players.filter(p => !p.eliminated).length}
                    placeholder="رقم اللاعب"
                    value={shootInput}
                    onChange={(e) => setShootInput(e.target.value)}
                    className="bg-gray-900 text-yellow-300 border border-yellow-500 rounded px-4 py-2 w-24 text-center font-bold"
                  />
                  <button
                    onClick={() => shootInput && handleShoot(parseInt(shootInput))}
                    disabled={!shootInput}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                  >
                    تأكيد
                  </button>
                </div>
              )}

              {/* Revive Input */}
              {actionMode === 'revive' && (
                <div className="mt-6 flex gap-2 justify-center items-center flex-wrap">
                  <input
                    type="number"
                    min="1"
                    max={players.length}
                    placeholder="رقم اللاعب"
                    value={reviveInput}
                    onChange={(e) => setReviveInput(e.target.value)}
                    className="bg-gray-900 text-yellow-300 border border-yellow-500 rounded px-4 py-2 w-24 text-center font-bold"
                  />
                  <button
                    onClick={() => reviveInput && handleRevive(parseInt(reviveInput))}
                    disabled={!reviveInput}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                  >
                    تأكيد
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Spin Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleSpin}
              disabled={isSpinning || selectedPlayer !== null}
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
        </>
      ) : (
        // Game Over
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-yellow-300 mb-8">🏆 انتهت اللعبة! 🏆</h2>

          <div className="space-y-4 mb-8">
            {[...players]
              .filter(p => !p.eliminated)
              .map((player) => (
                <div
                  key={player.id}
                  className="p-4 bg-gradient-to-r from-yellow-600/30 to-yellow-600/30 rounded-lg border-2 border-yellow-500"
                >
                  <div className="text-2xl font-bold text-yellow-300">
                    🏆 #{player.number} - {player.name} (الفائز!)
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
