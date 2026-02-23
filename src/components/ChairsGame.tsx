'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Chair {
  id: string;
  number: number;
  x: number;
  y: number;
  isTaken: boolean;
  takenBy?: string;
}

interface ChairsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean; profileImage?: string}>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
  onChatJoin?: (username: string) => void;
}

const MUSIC_TRACKS = [
  'توب توب يابحر خليفه سانتو DJ Typhoon Remix (mp3cut.net).mp3',
  'ريمكس اغنية انا زومبي ٣ غناء محمد الحملي ٢٠٢٤ Dj - coccinelle (mp3cut.net) (1).mp3',
  'ريمكس اغنية انا زومبي ٣ غناء محمد الحملي ٢٠٢٤ Dj - coccinelle (mp3cut.net).mp3',
  'فرقة ميامي - يا حلوكم ريمكس (mp3cut.net) (1).mp3',
  'فرقة ميامي - يا حلوكم ريمكس (mp3cut.net) (2).mp3',
  'فرقة ميامي - يا حلوكم ريمكس (mp3cut.net) (3).mp3',
  'فرقة ميامي - يا حلوكم ريمكس (mp3cut.net).mp3',
  'هـــبـــان - ريمكس _ Dj iKwT (mp3cut.net).mp3',
];

type GamePhase = 'lobby' | 'orbit' | 'scramble' | 'input' | 'victory';

export default function ChairsGame({ players, setPlayers, onEndGame, onChatJoin }: ChairsGameProps) {
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [round, setRound] = useState(1);
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [rotation, setRotation] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [clockText, setClockText] = useState('0:00');
  const [inputTimer, setInputTimer] = useState(10);
  const [gameLog, setGameLog] = useState<Array<{id: string; message: string; type: 'join' | 'claim' | 'eliminate' | 'round' | 'winner'}>>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const inputTimerRef = useRef<NodeJS.Timeout>();
  const claimedChairsRef = useRef<Set<string>>(new Set()); // Track who claimed chairs THIS ROUND

  // Get only joined and not eliminated players
  const activePlayers = players.filter(p => p.joined && !p.eliminated);

  // Add to game log
  const addLog = useCallback((message: string, type: 'join' | 'claim' | 'eliminate' | 'round' | 'winner') => {
    setGameLog(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type
    }]);
  }, []);

  // Generate chairs: N-1 chairs where N = number of active players
  const generateChairs = () => {
    const numChairs = Math.max(1, activePlayers.length - 1);
    const ARENA_RADIUS = 140;
    const newChairs: Chair[] = [];
    claimedChairsRef.current.clear();

    for (let i = 0; i < numChairs; i++) {
      const angle = Math.random() * Math.PI * 2;
      const randomRadius = Math.random() * (ARENA_RADIUS * 0.7);
      const x = randomRadius * Math.cos(angle);
      const y = randomRadius * Math.sin(angle);
      const number = Math.floor(Math.random() * 99) + 1;

      newChairs.push({
        id: `chair-${i}`,
        number,
        x,
        y,
        isTaken: false,
        takenBy: undefined,
      });
    }

    setChairs(newChairs);
    addLog(`🪑 جولة جديدة: ${numChairs} كرسي لـ ${activePlayers.length} لاعب`, 'round');
  };

  const startGame = () => {
    if (activePlayers.length < 2) return;
    setRound(1);
    setGameLog([]);
    addLog(`🎮 بدء اللعبة مع ${activePlayers.length} لاعب`, 'round');
    setPhase('orbit');
    startOrbit();
  };

  const startOrbit = () => {
    generateChairs();
    setRotation(0);
    const duration = Math.random() * 10 + 5;
    
    const randomIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    setCurrentTrackIndex(randomIndex);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = 1;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Orbit music playing');
            startTimeRef.current = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTimeRef.current;
              
              if (elapsed > duration * 1000) {
                setPhase('scramble');
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                addLog('⏸️ توقفت الموسيقى - ظهرت الكراسي!', 'round');
                return;
              }

              setRotation((elapsed / 5000) * 360);
              
              const secondsLeft = Math.ceil((duration * 1000 - elapsed) / 1000);
              const mins = Math.floor(secondsLeft / 60);
              const secs = secondsLeft % 60;
              setClockText(`${mins}:${secs.toString().padStart(2, '0')}`);

              animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);
          })
          .catch((error) => {
            console.error('❌ Music playback failed:', error);
            setTimeout(() => setPhase('scramble'), 3000);
          });
      }
    }
  };

  // Handle chair claim via chat message
  const handleChairClaim = useCallback((playerName: string, chairNumber: number) => {
    console.log(`🪑 ${playerName} trying to claim chair #${chairNumber}`);
    
    setChairs(prevChairs => {
      const updatedChairs = prevChairs.map(chair => {
        if (chair.number === chairNumber && !chair.isTaken) {
          console.log(`✅ ${playerName} claimed chair #${chairNumber}`);
          addLog(`✅ ${playerName} جلس على الكرسي #${chairNumber}`, 'claim');
          return { ...chair, isTaken: true, takenBy: playerName };
        }
        return chair;
      });

      // Check if all chairs are taken
      const allTaken = updatedChairs.every(chair => chair.isTaken);
      if (allTaken && phase === 'input') {
        handleRoundEnd(updatedChairs);
      }

      return updatedChairs;
    });
  }, [phase, addLog]);

  // Expose chair claim to window for chat integration
  useEffect(() => {
    (window as any).__chairsGameClaimChair = handleChairClaim;
  }, [handleChairClaim]);

  // Handle round end
  const handleRoundEnd = useCallback((finalChairs: Chair[]) => {
    const playersWithChairs = new Set(finalChairs.map(c => c.takenBy));
    const eliminated = activePlayers.find(p => !playersWithChairs.has(p.name));

    if (eliminated) {
      addLog(`❌ ${eliminated.name} تم استبعاده!`, 'eliminate');
      
      const updated = players.map(p =>
        p.id === eliminated.id ? { ...p, eliminated: true } : p
      );
      setPlayers(updated);

      const remaining = updated.filter(p => p.joined && !p.eliminated);
      if (remaining.length === 1) {
        setPhase('victory');
        addLog(`🏆 الفائز: ${remaining[0].name}!`, 'winner');
      } else if (remaining.length > 1) {
        setTimeout(() => {
          setRound(r => r + 1);
          setRotation(0);
          setPhase('orbit');
          startOrbit();
        }, 2000);
      }
    }
  }, [players, activePlayers, addLog, setPlayers]);

  // Input phase timer
  useEffect(() => {
    if (phase === 'input') {
      setInputTimer(10);
      
      inputTimerRef.current = setInterval(() => {
        setInputTimer(prev => {
          if (prev <= 1) {
            clearInterval(inputTimerRef.current);
            handleRoundEnd(chairs);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(inputTimerRef.current);
    }
  }, [phase, chairs, handleRoundEnd]);

  // Transition to input phase after scramble
  useEffect(() => {
    if (phase === 'scramble') {
      const timer = setTimeout(() => {
        addLog('📢 اكتبوا رقم الكرسي في الشات!', 'round');
        setPhase('input');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, addLog]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // ============ LOBBY PHASE ============
  if (phase === 'lobby') {
    return (
      <div className="w-full h-full flex flex-col bg-black relative overflow-hidden" dir="rtl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          style={{ filter: 'blur(8px)', opacity: 0.6 }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-8 relative z-10">
          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-8">🪑 جوله كراسي</h1>

            <div className="bg-gray-900/50 border-2 border-yellow-500/40 rounded-lg p-8 mb-8 max-w-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center">📋 قواعد اللعبة</h3>
              <ul className="text-yellow-200 text-lg space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl mt-1">✓</span>
                  <span>اكتب !join في الشات لكي تنضم للعبة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl mt-1">✓</span>
                  <span>عند بدء الموسيقى، تدور الأيقونات حول دائرة الكرسي</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl mt-1">✓</span>
                  <span>عند توقف الموسيقى، اكتب رقم الكرسي بسرعة في الشات</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl mt-1">✓</span>
                  <span>من لم يجلس على كرسي سيتم استبعاده!</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={startGame}
                disabled={activePlayers.length < 2}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-lg text-2xl transition-all shadow-lg hover:shadow-green-500/50"
              >
                ✓ بدء اللعبة
              </button>

              <button
                onClick={() => {
                  console.log('🔙 Back button clicked');
                  onEndGame();
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-10 rounded-lg text-xl transition-all shadow-lg hover:shadow-blue-500/50"
              >
                ← العودة للرئيسية
              </button>
            </div>
          </div>

          {/* Right Sidebar - Game Log */}
          <div className="w-full lg:w-96 bg-gray-900/50 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm max-h-96 overflow-y-auto">
            <h3 className="text-yellow-300 font-bold text-lg mb-4">📊 سجل اللعبة</h3>
            <div className="space-y-2">
              {gameLog.length === 0 ? (
                <p className="text-yellow-200/60 text-sm">في انتظار اللاعبين...</p>
              ) : (
                gameLog.slice(-10).reverse().map(log => (
                  <div key={log.id} className={`text-sm p-2 rounded ${
                    log.type === 'join' ? 'bg-green-900/30 text-green-300' :
                    log.type === 'claim' ? 'bg-blue-900/30 text-blue-300' :
                    log.type === 'eliminate' ? 'bg-red-900/30 text-red-300' :
                    log.type === 'winner' ? 'bg-yellow-900/30 text-yellow-300' :
                    'bg-gray-900/30 text-gray-300'
                  }`}>
                    {log.message}
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-yellow-500/20">
              <p className="text-yellow-200/60 text-sm mb-2">اللاعبون الموصولين: {activePlayers.length}</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {activePlayers.map(player => (
                  <div key={player.id} className="flex items-center gap-2 text-sm text-yellow-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ORBIT PHASE ============
  if (phase === 'orbit') {
    return (
      <div className="w-full h-full flex flex-col bg-black relative overflow-hidden" dir="rtl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          style={{ filter: 'blur(8px)', opacity: 0.6 }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

        {/* Top info bar */}
        <div className="flex justify-between items-center p-4 relative z-10">
          <div className="text-yellow-300 font-bold text-lg">الجولة {round}</div>
          <div className="text-2xl font-bold text-yellow-300">⏱️ {clockText}</div>
          <div className="text-yellow-300 font-bold text-lg">اللاعبون: {activePlayers.length}</div>
        </div>

        {/* Main game area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Circle Arena */}
          <div className="relative w-full h-full max-w-7xl max-h-7xl flex items-center justify-center">
            <div className="relative w-4/5 h-4/5" style={{ aspectRatio: '1/1' }}>
              {/* Circle background */}
              <div className="absolute inset-0 rounded-full border-8 border-yellow-600/60 bg-gradient-to-b from-yellow-950/40 to-black/60 shadow-2xl"></div>

              {/* Orbiting players */}
              <div
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'none',
                }}
                className="absolute inset-0"
              >
                {activePlayers.map((player, idx) => {
                  const angle = (idx / activePlayers.length) * Math.PI * 2;
                  const x = Math.cos(angle) * 160;
                  const y = Math.sin(angle) * 160;

                  return (
                    <div
                      key={player.id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      {/* Player avatar */}
                      <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 border-3 border-yellow-400 overflow-hidden shadow-lg relative">
                        {player.profileImage ? (
                          <>
                            <img
                              src={player.profileImage}
                              alt={player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="text-lg absolute">{player.name.charAt(0).toUpperCase()}</span>
                          </>
                        ) : (
                          <span className="text-lg">{player.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Player name */}
                      <div className="text-white font-bold text-sm text-center max-w-24 truncate bg-black/40 px-2 py-1 rounded">
                        {player.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-7xl font-bold text-yellow-400/30 mb-4">🎵</div>
                  <div className="text-yellow-300 text-xl">تدوير...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume control */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 relative z-10">
          <span className="text-yellow-300 font-bold">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            style={{
              background: `linear-gradient(to right, rgb(234, 179, 8) 0%, rgb(234, 179, 8) ${
                volume * 100
              }%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`,
            }}
          />
          <span className="text-yellow-300 font-bold w-12">{Math.round(volume * 100)}%</span>
        </div>

        {/* Audio element */}
        <audio ref={audioRef} crossOrigin="anonymous" preload="auto">
          <source src={`/music/${MUSIC_TRACKS[currentTrackIndex]}`} type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  // ============ SCRAMBLE PHASE ============
  if (phase === 'scramble') {
    return (
      <div className="w-full h-full flex flex-col bg-black relative overflow-hidden" dir="rtl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          style={{ filter: 'blur(8px)', opacity: 0.6 }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

        {/* Top info bar */}
        <div className="flex justify-between items-center p-4 relative z-10">
          <div className="text-yellow-300 font-bold text-lg">الجولة {round}</div>
          <div className="text-yellow-300 font-bold text-lg">الكراسي: {chairs.length}</div>
          <div className="text-yellow-300 font-bold text-lg">اللاعبون: {activePlayers.length}</div>
        </div>

        {/* Main game area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 pb-20">
          {/* Circle Arena */}
          <div className="relative w-full h-full max-w-7xl max-h-7xl flex items-center justify-center">
            <div className="relative w-4/5 h-4/5" style={{ aspectRatio: '1/1' }}>
              {/* Circle background */}
              <div className="absolute inset-0 rounded-full border-8 border-yellow-600/60 bg-gradient-to-b from-yellow-950/40 to-black/60 shadow-2xl"></div>

              {/* Stationary players on border */}
              <div className="absolute inset-0">
                {activePlayers.map((player, idx) => {
                  const angle = (idx / activePlayers.length) * Math.PI * 2;
                  const x = Math.cos(angle) * 160;
                  const y = Math.sin(angle) * 160;

                  return (
                    <div
                      key={player.id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 border-3 border-yellow-400 overflow-hidden shadow-lg relative">
                        {player.profileImage ? (
                          <>
                            <img
                              src={player.profileImage}
                              alt={player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="text-lg absolute">{player.name.charAt(0).toUpperCase()}</span>
                          </>
                        ) : (
                          <span className="text-lg">{player.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="text-white font-bold text-sm text-center max-w-24 truncate bg-black/40 px-2 py-1 rounded">
                        {player.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chairs */}
              <div className="absolute inset-0">
                {chairs.map((chair) => (
                  <div
                    key={chair.id}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${chair.x}px), calc(-50% + ${chair.y}px))`,
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* Chair */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 shadow-lg ${
                      chair.isTaken
                        ? 'bg-green-600 border-green-400'
                        : 'bg-red-600 border-red-400 animate-bounce'
                    }`}>
                      🪑
                    </div>
                    {/* Number */}
                    <div className="text-3xl font-bold text-yellow-300 bg-black/60 rounded-full w-12 h-12 flex items-center justify-center border-2 border-yellow-400">
                      {chair.number}
                    </div>
                    {/* Taken by */}
                    {chair.isTaken && chair.takenBy && (
                      <div className="text-white text-xs font-bold bg-green-600/80 px-2 py-1 rounded">
                        {chair.takenBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-400/50">اكتبوا رقم الكرسي!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume control */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 relative z-10">
          <span className="text-yellow-300 font-bold">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            style={{
              background: `linear-gradient(to right, rgb(234, 179, 8) 0%, rgb(234, 179, 8) ${
                volume * 100
              }%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`,
            }}
          />
          <span className="text-yellow-300 font-bold w-12">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    );
  }

  // ============ INPUT PHASE ============
  if (phase === 'input') {
    return (
      <div className="w-full h-full flex flex-col bg-black relative overflow-hidden" dir="rtl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          style={{ filter: 'blur(8px)', opacity: 0.6 }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

        {/* Top info bar */}
        <div className="flex justify-between items-center p-4 relative z-10">
          <div className="text-yellow-300 font-bold text-lg">الجولة {round}</div>
          <div className={`text-3xl font-bold ${inputTimer > 5 ? 'text-yellow-300' : 'text-red-400'} animate-pulse`}>
            ⏱️ {inputTimer}s
          </div>
          <div className="text-yellow-300 font-bold text-lg">المتبقيين: {activePlayers.length}</div>
        </div>

        {/* Main game area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 pb-20">
          {/* Circle Arena */}
          <div className="relative w-full h-full max-w-7xl max-h-7xl flex items-center justify-center">
            <div className="relative w-4/5 h-4/5" style={{ aspectRatio: '1/1' }}>
              {/* Circle background */}
              <div className="absolute inset-0 rounded-full border-8 border-yellow-600/60 bg-gradient-to-b from-yellow-950/40 to-black/60 shadow-2xl"></div>

              {/* Stationary players */}
              <div className="absolute inset-0">
                {activePlayers.map((player, idx) => {
                  const angle = (idx / activePlayers.length) * Math.PI * 2;
                  const x = Math.cos(angle) * 160;
                  const y = Math.sin(angle) * 160;

                  return (
                    <div
                      key={player.id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 border-3 border-yellow-400 overflow-hidden shadow-lg relative">
                        {player.profileImage ? (
                          <>
                            <img
                              src={player.profileImage}
                              alt={player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="text-lg absolute">{player.name.charAt(0).toUpperCase()}</span>
                          </>
                        ) : (
                          <span className="text-lg">{player.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="text-white font-bold text-sm text-center max-w-24 truncate bg-black/40 px-2 py-1 rounded">
                        {player.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chairs with taken status */}
              <div className="absolute inset-0">
                {chairs.map((chair) => (
                  <div
                    key={chair.id}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${chair.x}px), calc(-50% + ${chair.y}px))`,
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* Chair */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 shadow-lg transition-all ${
                      chair.isTaken
                        ? 'bg-green-600 border-green-400 scale-110'
                        : 'bg-red-600 border-red-400'
                    }`}>
                      🪑
                    </div>
                    {/* Number */}
                    <div className={`text-3xl font-bold rounded-full w-12 h-12 flex items-center justify-center border-2 ${
                      chair.isTaken
                        ? 'text-green-300 bg-green-900/60 border-green-400'
                        : 'text-yellow-300 bg-black/60 border-yellow-400'
                    }`}>
                      {chair.number}
                    </div>
                    {/* Taken by */}
                    {chair.isTaken && chair.takenBy && (
                      <div className="text-white text-xs font-bold bg-green-600/80 px-2 py-1 rounded">
                        {chair.takenBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Center: Taken chairs counter */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-400">{chairs.filter(c => c.isTaken).length}/{chairs.length}</div>
                  <div className="text-yellow-300 text-xl mt-4">كراسي مأخوذة</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume control */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 relative z-10">
          <span className="text-yellow-300 font-bold">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            style={{
              background: `linear-gradient(to right, rgb(234, 179, 8) 0%, rgb(234, 179, 8) ${
                volume * 100
              }%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`,
            }}
          />
          <span className="text-yellow-300 font-bold w-12">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    );
  }

  // ============ VICTORY PHASE ============
  if (phase === 'victory') {
    const winner = activePlayers[0];
    return (
      <div className="w-full h-full flex flex-col bg-black relative overflow-hidden" dir="rtl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          style={{ filter: 'blur(8px)', opacity: 0.6 }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Golden victory circle */}
          <div className="relative w-80 h-80 flex items-center justify-center mb-8">
            {/* Glowing circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50"></div>

            {/* Winner circle - inner */}
            <div className="relative w-72 h-72 rounded-full bg-gradient-to-b from-yellow-400/20 to-yellow-600/20 border-4 border-yellow-500 flex flex-col items-center justify-center overflow-hidden">
              {winner?.profileImage ? (
                <img
                  src={winner.profileImage}
                  alt={winner.name}
                  className="w-56 h-56 rounded-full object-cover border-4 border-yellow-400"
                />
              ) : (
                <div className="w-56 h-56 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 border-4 border-yellow-400 flex items-center justify-center text-8xl font-bold text-white">
                  {winner?.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Trophy and winner text */}
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">الفائز!</h1>
          {winner && (
            <h2 className="text-4xl font-bold text-yellow-300 mb-8">{winner.name}</h2>
          )}

          {/* End game button */}
          <button
            onClick={onEndGame}
            className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl transition-all shadow-lg hover:shadow-blue-500/50"
          >
            ← العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return null;
}
