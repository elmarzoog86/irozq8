'use client';

import React, { useState, useRef } from 'react';

interface ChairsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean}>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
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

export default function ChairsGame({ players, setPlayers, onEndGame }: ChairsGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(1);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [eliminated, setEliminated] = useState<number | null>(null);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // تشغيل الموسيقى
  const startMusic = () => {
    const randomIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    setCurrentTrackIndex(randomIndex);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        console.log('Autoplay restricted');
      });
    }
  };

  // تغيير مستوى الصوت
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // إيقاف الموسيقى
  const stopMusic = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // اختيار لاعب عشوائي للإقصاء
    const active = players.filter(p => !p.eliminated);
    if (active.length > 1) {
      const idx = Math.floor(Math.random() * active.length);
      const eliminatedId = active[idx].id;
      setEliminated(eliminatedId);
      setTimeout(() => {
        const updated = players.map(p =>
          p.id === eliminatedId ? { ...p, eliminated: true } : p
        );
        setPlayers(updated);
        setEliminated(null);
        setRound(r => r + 1);
        // إنهاء اللعبة إذا بقي لاعب واحد
        if (updated.filter(p => !p.eliminated).length === 1) {
          setTimeout(onEndGame, 2000);
        }
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      {/* Game Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-300 mb-2">🪑 جوله كراسي</h1>
        <p className="text-yellow-200 text-lg mb-4">اجلس على الكرسي بعد توقف الموسيقى وقبل بقية اللاعبين</p>
      </div>

      {/* Show waiting state or game state */}
      {!gameStarted ? (
        <div className="bg-gray-950/50 border-2 border-yellow-500/30 rounded-lg p-8 mb-8 text-center">
          {/* Waiting Section */}
          <div className="mb-8">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">في انتظار اللاعبين</h2>
            <p className="text-yellow-200 mb-4">انضم للعبة وكن آخر لاعب يجلس على كرسي!</p>
            <p className="text-yellow-400 font-semibold">يحتاج على الأقل لاعبين اثنين للبدء</p>
          </div>

          {/* Players List */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
            {players.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {players.map(player => (
                  <div
                    key={player.id}
                    className="p-2 bg-yellow-900/30 border border-yellow-500 rounded text-yellow-300 text-sm font-semibold"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">لا يوجد لاعبون حتى الآن</p>
            )}
          </div>

          {/* Game Info */}
          <div className="bg-gray-900/50 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-yellow-300 font-bold mb-3 text-center">📋 قواعد اللعبة</h3>
            <ul className="text-yellow-200 text-sm space-y-2">
              <li>✓ عند بدء الموسيقى، امشِ حول الكراسي مع اللاعبين الآخرين</li>
              <li>✓ عند توقف الموسيقى، يجب أن تجلس بسرعة على كرسي</li>
              <li>✓ في كل جولة، سيتم استبعاد لاعب واحد عشوائياً</li>
              <li>✓ اللاعب الأخير الباقي هو الفائز</li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setGameStarted(true)}
            disabled={players.filter(p => p.joined).length < 2}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
          >
            ✓ بدء اللعبة
          </button>
        </div>
      ) : (
        // Game Playing State
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">🎵 لعبة كراسي - الجولة {round}</h2>
          <p className="text-yellow-200 mb-6 text-sm">امشِ حول الكراسي، عند الإيقاف سيتم استبعاد لاعب عشوائي!</p>

          <audio 
            ref={audioRef} 
            onEnded={() => setIsPlaying(false)}
          >
            <source src={`/music/${MUSIC_TRACKS[currentTrackIndex]}`} type="audio/mpeg" />
          </audio>

          <div className="mb-8 flex justify-center gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg text-lg transition-all disabled:opacity-50"
              onClick={startMusic}
              disabled={isPlaying}
            >
              ▶️ تشغيل الموسيقى
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg text-lg transition-all disabled:opacity-50"
              onClick={stopMusic}
              disabled={!isPlaying}
            >
              ⏹️ إيقاف الموسيقى
            </button>
          </div>

          {/* Volume Control */}
          <div className="mb-8 bg-gray-900/50 border border-yellow-500/30 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-yellow-300 font-bold text-lg">🔊</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  style={{
                    background: `linear-gradient(to right, rgb(234, 179, 8) 0%, rgb(234, 179, 8) ${volume * 100}%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`
                  }}
                />
              </div>
              <span className="text-yellow-300 font-bold text-lg w-12 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {players.map(player => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                  player.eliminated
                    ? 'border-red-500 opacity-50 bg-red-900/20'
                    : 'border-yellow-500 bg-yellow-900/20'
                }`}
              >
                <div className="text-xl font-bold text-yellow-300">{player.name}</div>
                {eliminated === player.id && (
                  <div className="text-red-500 text-lg font-bold animate-bounce mt-2 text-3xl">
                    ❌
                  </div>
                )}
                {player.eliminated && eliminated !== player.id && (
                  <div className="text-red-400 text-sm mt-2 font-bold">مستبعد من اللعبة</div>
                )}
                {!player.eliminated && (
                  <div className="text-yellow-400 text-sm mt-2">🪑 نشيط</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <button
              onClick={() => setGameStarted(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              ← العودة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
