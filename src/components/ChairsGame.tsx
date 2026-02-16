'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChairsGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean}>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

const SONGS = [
  { name: 'أغنية 1 - إيقاع سريع', id: 'song1' },
  { name: 'أغنية 2 - موسيقى مرحة', id: 'song2' },
  { name: 'أغنية 3 - إيقاع قوي', id: 'song3' },
];

export default function ChairsGame({ players, setPlayers, onEndGame }: ChairsGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(SONGS[0]);
  const [round, setRound] = useState(1);
  const [eliminated, setEliminated] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // إنشاء سياق صوتي
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // تشغيل الموسيقى باستخدام Web Audio API
  const startMusic = () => {
    setIsPlaying(true);
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // إيقاف أي موجة موجودة
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    gain.connect(ctx.destination);
    osc.connect(gain);

    // تعيين التردد والإيقاع بناءً على الأغنية المختارة
    let frequency = 400;
    let startFreq = 400;
    let endFreq = 600;

    if (currentSong.id === 'song1') {
      frequency = 440; // A4
    } else if (currentSong.id === 'song2') {
      frequency = 523; // C5
    } else if (currentSong.id === 'song3') {
      startFreq = 330;
      endFreq = 659;
    }

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    if (currentSong.id === 'song3') {
      // إيقاع متذبذب
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      for (let i = 0; i < 8; i++) {
        osc.frequency.setTargetAtTime(endFreq, ctx.currentTime + i * 0.2, 0.05);
        osc.frequency.setTargetAtTime(startFreq, ctx.currentTime + (i + 0.5) * 0.2, 0.05);
      }
    } else {
      // نغمة مستقرة مع تغيير طفيف
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.setTargetAtTime(frequency + 50, ctx.currentTime + 0.3, 0.1);
      osc.frequency.setTargetAtTime(frequency - 30, ctx.currentTime + 0.8, 0.1);
      osc.frequency.setTargetAtTime(frequency, ctx.currentTime + 1.2, 0.1);
    }

    osc.start(ctx.currentTime);
    oscillatorRef.current = osc;
    gainRef.current = gain;
  };

  // إيقاف الموسيقى
  const stopMusic = () => {
    setIsPlaying(false);
    if (oscillatorRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      gainRef.current?.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => {
        try {
          oscillatorRef.current?.stop();
        } catch (e) {
          // already stopped
        }
      }, 200);
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
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">🎵 لعبة كراسي - الجولة {round}</h2>
      <p className="text-cyan-200 mb-6 text-sm">امشِ حول الكراسي، عند الإيقاف سيتم استبعاد لاعب عشوائي!</p>

      <div className="mb-6 flex flex-col items-center gap-2">
        <label className="text-cyan-200 font-bold">اختر الأغنية:</label>
        <select
          className="bg-slate-800 text-cyan-300 rounded px-4 py-2 border border-cyan-500"
          value={currentSong.id}
          onChange={e => {
            const song = SONGS.find(s => s.id === e.target.value);
            if (song) setCurrentSong(song);
          }}
          disabled={isPlaying}
        >
          {SONGS.map(song => (
            <option key={song.id} value={song.id}>{song.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-8 rounded-lg text-lg transition-all disabled:opacity-50"
          onClick={startMusic}
          disabled={isPlaying}
        >
          ▶️ تشغيل الموسيقى
        </button>
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-8 rounded-lg text-lg transition-all disabled:opacity-50"
          onClick={stopMusic}
          disabled={!isPlaying}
        >
          ⏹️ إيقاف الموسيقى
        </button>
      </div>

      {isPlaying && (
        <div className="mb-6 text-center">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg">
            🎵 الموسيقى تعزف الآن...
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {players.map(player => (
          <div
            key={player.id}
            className={`p-4 rounded-lg border-2 transition-all duration-500 ${
              player.eliminated
                ? 'border-red-500 opacity-50 bg-red-900/20'
                : 'border-cyan-500 bg-cyan-900/20'
            }`}
          >
            <div className="text-xl font-bold text-cyan-300">{player.name}</div>
            {eliminated === player.id && (
              <div className="text-red-500 text-lg font-bold animate-bounce mt-2 text-3xl">
                ❌
              </div>
            )}
            {player.eliminated && eliminated !== player.id && (
              <div className="text-red-400 text-sm mt-2 font-bold">مستبعد من اللعبة</div>
            )}
            {!player.eliminated && (
              <div className="text-cyan-400 text-sm mt-2">🪑 نشيط</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-cyan-300 text-sm">
        <p>اللاعبون المتبقون: {players.filter(p => !p.eliminated).length}/{players.length}</p>
      </div>
    </div>
  );
}
