'use client';

import { useState } from 'react';

interface ChatMessage {
  id: number;
  type: 'system' | 'user';
  user: string;
  message: string;
  timestamp: Date;
}

interface QuestionsLobbyProps {
  onStartGame: (playerCount: number, questionsCount: number) => void;
  onBack: () => void;
}

export default function QuestionsLobby({ onStartGame, onBack }: QuestionsLobbyProps) {
  const [questionsCount, setQuestionsCount] = useState(10);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, type: 'system', user: 'System', message: 'في انتظار اللاعبين...', timestamp: new Date() },
    { id: 2, type: 'system', user: 'System', message: 'اللعبة: سؤال و جواب', timestamp: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        user: 'Streamer',
        message: newMessage,
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
    }
  };

  const handleStartGame = () => {
    const startMsg: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'system',
      user: 'System',
      message: `🎮 بدء اللعبة مع ${questionsCount} أسئلة...`,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, startMsg]);
    onStartGame(999, questionsCount); // 999 represents unlimited players
  };

  return (
    <div className="w-full h-full flex" dir="rtl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a0a2e 50%, #0f172a 100%)' }}>
      {/* LEFT SECTION - System Log (سجل النظام) */}
      <div className="w-80 flex flex-col border-r border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-slate-950/80 shadow-xl">
        <div className="px-4 py-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-600/20 to-pink-600/20">
          <h3 className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-pink-400 bg-clip-text text-transparent">
            ✓ سجل النظام
          </h3>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.type === 'system' ? (
                <div className="px-3 py-2 bg-gradient-to-r from-cyan-600/30 to-cyan-600/10 rounded-lg text-cyan-200 text-xs border border-cyan-500/40 shadow-md">
                  {msg.message}
                </div>
              ) : (
                <div className="px-2 py-1">
                  <span className="text-pink-400 font-bold">{msg.user}: </span>
                  <span className="text-gray-300">{msg.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-3 py-3 border-t border-cyan-500/30 bg-gradient-to-t from-slate-950/50 to-transparent">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="أرسل رسالة..."
              className="flex-1 bg-gray-900/70 border border-cyan-500/40 rounded px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded px-3 py-2 text-xs font-bold transition-all shadow-lg"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* CENTER SECTION - Waiting Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ background: 'linear-gradient(135deg, #0a1f35 0%, #1a0f35 50%, #0a1f35 100%)' }}>
        {/* Open to Everyone Mode */}
        <>
          <div className="mb-8 text-8xl animate-bounce drop-shadow-lg">❓</div>
          <h1 className="text-5xl font-black mb-4 text-center bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
            سؤال و جواب
          </h1>
          <p className="text-lg mb-3 text-center max-w-md bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent font-bold">
            في انتظار اللاعبين...
          </p>
          <p className="text-sm mb-12 text-center max-w-md text-gray-300">كن أسرع من الجميع في الإجابة الصحيحة!</p>

          <div className="relative w-full max-w-md">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-blue-900/40 to-teal-900/40 border border-cyan-500/60 rounded-xl p-8 text-center shadow-2xl">
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-cyan-300 to-pink-400 bg-clip-text text-transparent">
                📋 قواعد اللعبة
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <p className="text-gray-300 text-sm text-right">أجب على الأسئلة بسرعة</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <p className="text-gray-300 text-sm text-right">أول إجابة صحيحة تفوز</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <p className="text-gray-300 text-sm text-right">اكتسب نقاط مع كل إجابة صحيحة</p>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      {/* RIGHT SECTION - Settings */}
      <div className="w-96 flex flex-col border-l border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 space-y-4 overflow-y-auto shadow-xl">
        
        {/* Header with Tabs */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white py-3 px-4 rounded-lg font-bold text-sm text-center shadow-lg">
            ⚙️ إعدادات اللعبة
          </div>
        </div>

        {/* Player Count Card */}
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-600/5 border border-pink-500/40 rounded-lg p-4 shadow-md">
          <label className="text-right block text-xs font-bold text-pink-300 mb-2">👥 اللاعبون</label>
          <div className="text-right">
            <span className="text-4xl font-black bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">∞</span>
          </div>
          <p className="text-xs text-pink-300/70 text-right mt-2">غير محدود - كل من يريد</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gradient-to-r from-cyan-500/30 via-pink-500/30 to-amber-500/30"></div>

        {/* Questions Count Card */}
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-500/40 rounded-lg p-4 shadow-md">
          <label className="text-right block text-xs font-bold text-amber-300 mb-4">📊 عدد الأسئلة</label>
          <div className="grid grid-cols-2 gap-3">
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionsCount(num)}
                className={`py-3 px-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 ${
                  questionsCount === num
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white border-2 border-amber-300 shadow-lg shadow-amber-500/50'
                    : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-gray-300 border border-slate-600/50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gradient-to-r from-cyan-500/30 via-pink-500/30 to-amber-500/30"></div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto pt-4 border-t border-cyan-500/30">
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-4 rounded-lg font-bold transition-all transform hover:scale-105 text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/50"
          >
            🎮 بدء اللعبة
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-lg font-bold bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white transition-all text-sm shadow-md"
          >
            ← العودة
          </button>
        </div>
      </div>
    </div>
  );
}
