'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  eliminated: boolean;
  joined: boolean;
}

interface Chair {
  id: number;
  number: number;
  position: { x: number; y: number };
  angle: number;
}

interface MusicalChairsGameProps {
  playerCount?: number;
  players: Player[];
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

export default function MusicalChairsGame({
  players,
  setPlayers,
  onEndGame,
}: MusicalChairsGameProps) {
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'reveal' | 'sitting' | 'results' | 'game-over'>('setup');
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [roundResults, setRoundResults] = useState<{[key: number]: {seated: boolean; chairNumber?: number}}>({});
  const [selectedChairs, setSelectedChairs] = useState<{[key: number]: number}>({});

  const activePlayers = players.filter(p => !p.eliminated && p.joined);
  const chairCount = Math.max(activePlayers.length - 1, 1);

  // Initialize game
  useEffect(() => {
    if (gamePhase === 'setup' && activePlayers.length > 0) {
      generateChairs();
    }
  }, [gamePhase, activePlayers.length]);

  // Generate random chairs positioned in circle
  const generateChairs = () => {
    const newChairs: Chair[] = [];
    const radius = 150;
    const centerX = 250;
    const centerY = 200;

    for (let i = 0; i < chairCount; i++) {
      const angle = (i / chairCount) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      newChairs.push({
        id: i,
        number: i + 1,
        position: { x, y },
        angle: (angle * 180) / Math.PI,
      });
    }

    // Shuffle chair numbers
    newChairs.sort(() => Math.random() - 0.5);
    setChairs(newChairs);
    setRoundResults({});
    setSelectedChairs({});
  };

  // Handle game start
  const handleStartRound = () => {
    generateChairs();
    setTimeLeft(10);
    setGamePhase('playing');
  };

  // Timer effect for playing phase
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'playing' && timeLeft === 0) {
      setGamePhase('reveal');
    }
  }, [gamePhase, timeLeft]);

  // Handle player selecting a chair
  const handleSelectChair = (playerId: number, chairNumber: number) => {
    if (gamePhase !== 'sitting') return;

    const updatedSelected = { ...selectedChairs, [playerId]: chairNumber };
    setSelectedChairs(updatedSelected);

    // Check if all players have selected
    if (Object.keys(updatedSelected).length === activePlayers.length) {
      processResults(updatedSelected);
    }
  };

  // Process round results
  const processResults = (selections: {[key: number]: number}) => {
    const results: {[key: number]: {seated: boolean; chairNumber?: number}} = {};
    const usedChairs = new Set<number>();

    // First pass: assign valid chairs (no duplicates)
    Object.entries(selections).forEach(([playerId, chairNumber]) => {
      const playerNum = parseInt(playerId);
      if (chairNumber >= 1 && chairNumber <= chairCount && !usedChairs.has(chairNumber)) {
        results[playerNum] = { seated: true, chairNumber };
        usedChairs.add(chairNumber);
      } else {
        results[playerNum] = { seated: false };
      }
    });

    setRoundResults(results);
    setGamePhase('results');

    // Auto advance after 3 seconds
    setTimeout(() => {
      const eliminated = Object.entries(results)
        .filter(([_, result]) => !result.seated)
        .map(([playerId]) => parseInt(playerId));

      if (eliminated.length > 0) {
        const updatedPlayers = players.map((p: Player) =>
          eliminated.includes(p.id) ? { ...p, eliminated: true } : p
        );
        setPlayers(updatedPlayers);

        const remaining = updatedPlayers.filter((p: Player) => !p.eliminated && p.joined);

        if (remaining.length <= 1) {
          setGamePhase('game-over');
        } else {
          setRound(round + 1);
          setGamePhase('setup');
        }
      } else {
        setRound(round + 1);
        setGamePhase('setup');
      }
    }, 3000);
  };

  // Auto start sitting phase after reveal
  useEffect(() => {
    if (gamePhase === 'reveal') {
      setTimeout(() => setGamePhase('sitting'), 2000);
    }
  }, [gamePhase]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-8 relative overflow-hidden" dir="rtl">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-20"
        style={{ filter: 'blur(4px)' }}
      >
        <source src="/videos/wallpaper.webm" type="video/webm" />
      </video>

      {/* Setup Phase - Show starting players */}
      {gamePhase === 'setup' && (
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-yellow-400 mb-8">🪑 الكراسي الموسيقية</h1>
          <p className="text-2xl text-yellow-300 mb-6">الجولة {round}</p>
          <p className="text-xl text-gray-300 mb-8">
            عدد اللاعبين: {activePlayers.length} | عدد الكراسي: {chairCount}
          </p>

          <div className="mb-8 space-y-2">
            {activePlayers.map((player) => (
              <div key={player.id} className="px-6 py-2 bg-yellow-600/20 border-2 border-yellow-500 rounded-lg text-yellow-100 font-semibold">
                {player.name}
              </div>
            ))}
          </div>

          <button
            onClick={handleStartRound}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all"
          >
            ابدأ الجولة
          </button>
        </div>
      )}

      {/* Playing Phase - Players walk in circle */}
      {gamePhase === 'playing' && (
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">🪑 الكراسي الموسيقية</h1>
          <div className="text-6xl font-bold text-yellow-300 mb-8">{timeLeft}</div>
          <p className="text-xl text-gray-300">اللاعبون يسيرون حول الدائرة...</p>

          {/* Players circle animation */}
          <div className="relative w-96 h-96 mx-auto mt-12">
            <div className="absolute inset-0 border-4 border-yellow-600/30 rounded-full"></div>

            {/* Players positions around circle */}
            {activePlayers.map((player, idx) => {
              const angle = (idx / activePlayers.length) * Math.PI * 2 + (Date.now() / 3000);
              const radius = 180;
              const x = 192 + radius * Math.cos(angle);
              const y = 192 + radius * Math.sin(angle);

              return (
                <div
                  key={player.id}
                  className="absolute w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold text-white shadow-lg"
                  style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                >
                  👤
                </div>
              );
            })}

            {/* Empty center (chairs will be revealed) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400">
              🎵
            </div>
          </div>
        </div>
      )}

      {/* Reveal Phase - Show chairs */}
      {gamePhase === 'reveal' && (
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-yellow-400 mb-8">🪑 تم كشف الكراسي!</h1>

          {/* Chairs circle */}
          <div className="relative w-96 h-96 mx-auto">
            <div className="absolute inset-0 border-4 border-yellow-600/30 rounded-full"></div>

            {/* Display chairs with revealed numbers */}
            {chairs.map((chair) => (
              <div
                key={chair.id}
                className="absolute w-16 h-16 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg border-2 border-yellow-400 font-bold text-white text-2xl shadow-lg"
                style={{
                  left: `${chair.position.x}px`,
                  top: `${chair.position.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {chair.number}
              </div>
            ))}
          </div>

          <p className="text-xl text-yellow-300 mt-12">جاهزين للجلوس...</p>
        </div>
      )}

      {/* Sitting Phase - Players input chair numbers */}
      {gamePhase === 'sitting' && (
        <div className="text-center z-10 w-full max-w-2xl">
          <h1 className="text-5xl font-bold text-yellow-400 mb-8">🪑 اختر كرسيك!</h1>

          {/* Chairs circle */}
          <div className="relative w-96 h-96 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-yellow-600/30 rounded-full"></div>

            {chairs.map((chair) => (
              <div
                key={chair.id}
                className="absolute w-16 h-16 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg border-2 border-yellow-400 font-bold text-white text-2xl shadow-lg"
                style={{
                  left: `${chair.position.x}px`,
                  top: `${chair.position.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {chair.number}
              </div>
            ))}
          </div>

          {/* Players selecting chairs */}
          <div className="space-y-3 mb-8">
            {activePlayers.map((player) => (
              <div key={player.id} className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-yellow-600/30">
                <span className="flex-1 text-right font-bold text-yellow-300">{player.name}</span>
                {selectedChairs[player.id] ? (
                  <div className="px-4 py-2 bg-green-600/40 border border-green-500 rounded text-green-300 font-bold">
                    الكرسي: {selectedChairs[player.id]}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const chairNum = parseInt(prompt(`أي كرسي تريد؟ (1-${chairCount}):`) || '0');
                      if (chairNum >= 1 && chairNum <= chairCount) {
                        handleSelectChair(player.id, chairNum);
                      }
                    }}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition-colors"
                  >
                    اختر
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Phase */}
      {gamePhase === 'results' && (
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold text-yellow-400 mb-8">📊 نتائج الجولة</h1>

          <div className="space-y-3 max-w-2xl">
            {activePlayers.map((player) => {
              const result = roundResults[player.id];
              const seated = result?.seated;

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border-2 font-bold text-lg ${
                    seated
                      ? 'bg-green-600/30 border-green-500 text-green-300'
                      : 'bg-red-600/30 border-red-500 text-red-300'
                  }`}
                >
                  {seated ? '✅' : '❌'} {player.name} {seated ? `- جلس على الكرسي ${result.chairNumber}` : '- تم إقصاؤك!'}
                </div>
              );
            })}
          </div>

          <p className="text-gray-400 mt-8">جاري الانتقال للجولة التالية...</p>
        </div>
      )}

      {/* Game Over Phase */}
      {gamePhase === 'game-over' && (
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-yellow-400 mb-8">🏆 الفائز!</h1>

          {activePlayers.length === 1 && activePlayers[0] && (
            <div className="mb-8 p-8 bg-gradient-to-r from-yellow-600/40 to-yellow-600/40 rounded-lg border-2 border-yellow-500">
              <div className="text-3xl font-bold text-yellow-300 mb-2">👑 {activePlayers[0].name}</div>
              <p className="text-gray-300">تهانينا! أنت الفائز في اللعبة!</p>
            </div>
          )}

          <button
            onClick={onEndGame}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            ← العودة
          </button>
        </div>
      )}
    </div>
  );
}
