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

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-8xl text-yellow-400 absolute top-10 left-10">🏮</div>
          <div className="text-8xl text-yellow-400 absolute top-10 right-10">🏮</div>
          <div className="text-8xl text-amber-400 absolute bottom-10 left-10">⭐</div>
          <div className="text-8xl text-yellow-400 absolute bottom-10 right-10">⭐</div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-yellow-400 mb-2 relative z-10 text-center">حرب الفواكه</h1>
        <p className="text-2xl text-yellow-300 mb-12 relative z-10 text-center font-semibold">اختر طريقة اللعب</p>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-2 gap-8 max-w-5xl relative z-10 mb-12">
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
        <div className="text-center relative z-10">
          <p className="text-yellow-400 text-sm font-semibold">اختر طريقة اللعب لبدء اللعبة</p>
          {joinedPlayers.length < 2 && (
            <p className="text-yellow-400 text-sm mt-2">يجب أن يكون هناك 2 لاعب على الأقل</p>
          )}
        </div>

        {/* Bottom Section - Player List */}
        <div className="mt-auto pt-8 border-t-2 border-yellow-600/30 w-full relative z-10">
          <div className="text-center">
            <p className="text-yellow-400 font-bold mb-4">👥 اللاعبون المشاركون ({joinedPlayers.length})</p>
            {joinedPlayers.length > 0 ? (
              <div className="flex flex-wrap gap-3 justify-center">
                {joinedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="px-4 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-600/20 text-yellow-100 font-semibold"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-400 text-sm">في انتظار المشاركين... 🎮 أكتب !join في الشات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
