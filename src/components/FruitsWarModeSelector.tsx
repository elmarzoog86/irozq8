'use client';

import { useState } from 'react';

interface FruitsWarModeSelectorProps {
  players: Array<{ id: number; name: string; score: number; eliminated: boolean; joined: boolean; fruit?: string }>;
  setPlayers: (players: any[]) => void;
  onModeSelect: (mode: 'roulette' | 'voting') => void;
  onEndGame: () => void;
  onChatJoin?: (username: string) => void;
}

export default function FruitsWarModeSelector({
  players,
  onModeSelect,
  onEndGame,
}: FruitsWarModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'roulette' | 'voting' | null>(null);

  const joinedPlayers = players.filter(p => p.joined);

  const handleModeSelect = (mode: 'roulette' | 'voting') => {
    setSelectedMode(mode);
    // Delay slightly for visual feedback
    setTimeout(() => {
      onModeSelect(mode);
    }, 300);
  };

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

      {/* Header with Players */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Player Names List */}
        <div className="w-96 bg-gradient-to-b from-purple-950 to-black border-l-2 border-purple-500/30 p-8 overflow-y-auto flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-purple-400 mb-12">حرب الفواكه</h2>
          <div className="text-cyan-300 text-center mb-12 text-lg">
            <p className="mb-4">🎮 أكتب !join في الشات للدخول</p>
            <p className="text-sm text-purple-300">أو اضغط الزر أدناه</p>
          </div>
          <div className="space-y-3 w-full">
            {joinedPlayers.length > 0 ? (
              joinedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-lg border-2 border-purple-500/30 bg-purple-900/20 text-center animate-pulse hover:animate-none transition-all"
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

        {/* Main Game Area - Mode Selector */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="text-8xl text-purple-500 absolute top-10 left-10">🏮</div>
            <div className="text-8xl text-purple-500 absolute top-10 right-10">🏮</div>
            <div className="text-8xl text-purple-500 absolute bottom-10 left-10">⭐</div>
            <div className="text-8xl text-purple-500 absolute bottom-10 right-10">⭐</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-purple-300 mb-4 relative z-10 text-center">حرب الفواكه</h1>
          <p className="text-2xl text-cyan-300 mb-16 relative z-10 text-center">اختر طريقة اللعب</p>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl relative z-10">
            {/* Roulette Mode */}
            <div
              onClick={() => handleModeSelect('roulette')}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedMode === 'roulette'
                  ? 'border-pink-500 bg-pink-900/40 shadow-lg shadow-pink-500/50'
                  : 'border-purple-500/50 bg-purple-900/20 hover:border-pink-500/70 hover:bg-purple-900/40'
              }`}
            >
              <div className="text-6xl mb-4 text-center">🎡</div>
              <h2 className="text-3xl font-bold text-purple-300 mb-4 text-center">روليت</h2>
              <div className="text-cyan-300 text-center space-y-2">
                <p className="mb-4">يتم اختيار لاعب عشوائياً من الروليت</p>
                <div className="bg-black/50 rounded p-4 text-sm">
                  <p className="font-bold text-pink-400 mb-2">كيفية اللعب:</p>
                  <ul className="text-left space-y-1">
                    <li>✓ تدوير الروليت</li>
                    <li>✓ اختيار فاكهة للإقصاء</li>
                    <li>✓ الفائز يبقى في اللعبة</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Voting Mode */}
            <div
              onClick={() => handleModeSelect('voting')}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedMode === 'voting'
                  ? 'border-cyan-500 bg-cyan-900/40 shadow-lg shadow-cyan-500/50'
                  : 'border-purple-500/50 bg-purple-900/20 hover:border-cyan-500/70 hover:bg-purple-900/40'
              }`}
            >
              <div className="text-6xl mb-4 text-center">🗳️</div>
              <h2 className="text-3xl font-bold text-purple-300 mb-4 text-center">تصويت</h2>
              <div className="text-cyan-300 text-center space-y-2">
                <p className="mb-4">التصويت من قبل الشات للإقصاء</p>
                <div className="bg-black/50 rounded p-4 text-sm">
                  <p className="font-bold text-cyan-400 mb-2">كيفية اللعب:</p>
                  <ul className="text-left space-y-1">
                    <li>✓ عرض جميع اللاعبين/الفواكه</li>
                    <li>✓ التصويت في الشات</li>
                    <li>✓ الأعلى أصواتاً يتم إقصاؤه</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-16 text-center relative z-10">
            <p className="text-cyan-400 text-sm">اختر طريقة اللعب لبدء اللعبة</p>
            {joinedPlayers.length < 2 && (
              <p className="text-red-400 text-sm mt-2">يجب أن يكون هناك 2 لاعب على الأقل</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
