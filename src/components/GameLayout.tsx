'use client';

import React, { useState } from 'react';

interface GameLayoutProps {
  gameName: string;
  gameDescription: string;
  children: React.ReactNode;
  onBack: () => void;
  players?: Array<{id: number; name: string; score: number; eliminated: boolean}>;
  isGameRunning?: boolean;
  onChatMessage?: (playerIndex: number, playerName: string, message: string) => void;
  playersAnswering?: number[];
}

export default function GameLayout({ gameName, gameDescription, children, onBack, players = [], isGameRunning = false, onChatMessage, playersAnswering = [] }: GameLayoutProps) {
  const [questionsCount, setQuestionsCount] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: number; user: string; message: string}>>([
    { id: 1, user: 'System', message: 'في انتظار اللاعبين...' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // During game, send to game component as answer
      if (isGameRunning && onChatMessage && players.length > 0) {
        // Find "أنت" player (should be first player/streamer)
        const playerIndex = 0; // First player is typically the streamer
        const playerName = players[playerIndex]?.name || 'أنت';
        onChatMessage(playerIndex, playerName, newMessage);
      }

      setChatMessages([...chatMessages, {
        id: chatMessages.length + 1,
        user: 'أنت',
        message: newMessage
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white" dir="rtl">
      {/* Sidebar - Left */}
      <div className="w-80 bg-gray-950 border-r border-purple-500/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30">
          <button 
            onClick={onBack}
            className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 flex items-center gap-2"
          >
            ← العودة
          </button>
          <h2 className="text-lg font-bold text-cyan-300">{gameName}</h2>
          <p className="text-xs text-cyan-300/60 mt-1">{gameDescription}</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 border-b border-purple-500/30">
          {chatMessages.map(msg => (
            <div key={msg.id} className="text-sm">
              <span className="text-purple-400 font-semibold">{msg.user}</span>
              <p className="text-gray-300 text-xs mt-1">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-purple-500/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="أكتب رسالة..."
              className="flex-1 bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm font-semibold"
            >
              إرسال
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-950 border-b border-purple-500/30 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">{gameName}</h1>
            <p className="text-gray-400 text-sm mt-1">{gameDescription}</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-semibold flex items-center gap-2"
          >
            ⚙️ الإعدادات
          </button>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Settings/Leaderboard */}
      <div className="w-80 bg-gray-950 border-l border-purple-500/30 overflow-y-auto">
        <div className="p-6">
          {isGameRunning ? (
            // Leaderboard persists throughout the game - show only players who answered current question
            <>
              <h3 className="text-lg font-bold text-purple-300 mb-6">🏆 لوحة النتائج</h3>
              <div className="space-y-3">
                {playersAnswering.length > 0 ? (
                  <>
                    {[...players]
                      .filter(player => playersAnswering.includes(player.id))
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className="p-4 bg-gradient-to-r from-cyan-600/30 to-pink-600/30 rounded-lg border-2 border-cyan-500"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              {index === 0 && <span className="text-2xl">🥇</span>}
                              {index === 1 && <span className="text-2xl">🥈</span>}
                              {index === 2 && <span className="text-2xl">🥉</span>}
                              {index > 2 && <span className="text-xl">#{index + 1}</span>}
                              <span className="font-bold text-cyan-300">{player.name}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">النقاط:</span>
                            <span className="text-2xl font-bold text-pink-400">{player.score}</span>
                          </div>
                        </div>
                      ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-sm">في انتظار إجابات...</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Settings when game is not running
            <>
              <h3 className="text-lg font-bold text-purple-300 mb-6">⚙️ إعدادات اللعبة</h3>
              
              {/* Questions Count - Button Selection */}
              <div className="mb-8">
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 30, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionsCount(count)}
                      className={`py-2 rounded font-bold text-sm transition-all ${
                        questionsCount === count
                          ? 'bg-purple-600 text-white border-2 border-purple-400'
                          : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Mode Options */}
              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-3">طريقة اللعبة</label>
                <div className="space-y-2">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-semibold text-left">
                    فقط join
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-semibold text-left border border-gray-700">
                    الاسم + الكود
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">عدد الأسئلة:</span>
                    <span className="text-purple-400 font-bold">{questionsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">حالة اللعبة:</span>
                    <span className="text-green-400 font-bold">جاهزة</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">اللاعبون:</span>
                    <span className="text-cyan-400 font-bold">غير محدود ∞</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-bold">
                  ✓ بدء اللعبة
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded font-bold border border-gray-700">
                  🔄 إعادة تشغيل
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
