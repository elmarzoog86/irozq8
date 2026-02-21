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
    <div className="w-screen h-screen flex flex-col fixed inset-0 bg-black" dir="rtl">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onEndGame}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          ← العودة
        </button>
      </div>

      {/* Header with Players */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Player Names List */}
        <div className="w-96 bg-gray-950 border-l-2 border-yellow-500 p-8 overflow-y-auto flex flex-col items-center justify-center shadow-lg shadow-yellow-500/20">
          <h2 className="text-4xl font-bold text-yellow-400 mb-12">حرب الفواكه</h2>
          <div className="text-yellow-400 text-center mb-12 text-lg font-semibold">
            <p className="mb-4">🎮 أكتب !join في الشات للدخول</p>
            <p className="text-sm text-yellow-300">أو اضغط الزر أدناه</p>
          </div>
          <div className="space-y-3 w-full">
            {joinedPlayers.length > 0 ? (
              joinedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-lg border-2 border-yellow-500 bg-yellow-600/30 text-center animate-pulse hover:animate-none transition-all"
                >
                  <div className="font-bold text-yellow-100">{player.name}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-yellow-400 py-12">
                في انتظار المشاركين...
              </div>
            )}
          </div>
        </div>

        {/* Main Game Area - Mode Selector */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="text-8xl text-yellow-400 absolute top-10 left-10">🏮</div>
            <div className="text-8xl text-yellow-400 absolute top-10 right-10">🏮</div>
            <div className="text-8xl text-amber-400 absolute bottom-10 left-10">⭐</div>
            <div className="text-8xl text-yellow-400 absolute bottom-10 right-10">⭐</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-yellow-400 mb-4 relative z-10 text-center">حرب الفواكه</h1>
          <p className="text-2xl text-yellow-400 mb-16 relative z-10 text-center font-semibold">اختر طريقة اللعب</p>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl relative z-10">
            {/* Roulette Mode */}
            <div
              onClick={() => handleModeSelect('roulette')}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedMode === 'roulette'
                  ? 'border-yellow-400 bg-yellow-600/40 shadow-lg shadow-yellow-500/60'
                  : 'border-gray-700 bg-gray-900 hover:border-yellow-500 hover:bg-gray-800'
              }`}
            >
              <div className="text-6xl mb-4 text-center">🎡</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">روليت</h2>
              <div className="text-gray-300 text-center space-y-2">
                <p className="mb-4">يتم اختيار لاعب عشوائياً من الروليت</p>
                <div className="bg-gray-950 rounded p-4 text-sm border border-yellow-500/30">
                  <p className="font-bold text-yellow-400 mb-2">كيفية اللعب:</p>
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
                  ? 'border-yellow-400 bg-yellow-600/40 shadow-lg shadow-yellow-500/60'
                  : 'border-gray-700 bg-gray-900 hover:border-yellow-500 hover:bg-gray-800'
              }`}
            >
              <div className="text-6xl mb-4 text-center">🗳️</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">تصويت</h2>
              <div className="text-gray-300 text-center space-y-2">
                <p className="mb-4">التصويت من قبل الشات للإقصاء</p>
                <div className="bg-gray-950 rounded p-4 text-sm border border-yellow-500/30">
                  <p className="font-bold text-yellow-400 mb-2">كيفية اللعب:</p>
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
            <p className="text-yellow-400 text-sm font-semibold">اختر طريقة اللعب لبدء اللعبة</p>
            {joinedPlayers.length < 2 && (
              <p className="text-yellow-400 text-sm mt-2">يجب أن يكون هناك 2 لاعب على الأقل</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
