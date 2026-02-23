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
    <div className="w-full h-full flex relative" dir="rtl">
      {/* Wallpaper Background */}
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
      
      {/* Dark overlay with golden tint */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-yellow-950/40 to-black/75 -z-10"></div>

      {/* LEFT SECTION - System Log (سجل النظام) */}
      <div className="w-80 flex flex-col border-r-2 border-yellow-600/50 bg-gradient-to-b from-black/90 to-gray-950/90 shadow-2xl relative z-10">
        <div className="px-4 py-3 border-b border-yellow-600/30 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20">
          <h3 className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            ✓ سجل النظام
          </h3>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.type === 'system' ? (
                <div className="px-3 py-2 bg-gradient-to-r from-yellow-600/30 to-yellow-600/10 rounded-lg text-yellow-200 text-xs border border-yellow-600/40 shadow-md">
                  {msg.message}
                </div>
              ) : (
                <div className="px-2 py-1">
                  <span className="text-yellow-400 font-bold">{msg.user}: </span>
                  <span className="text-gray-300">{msg.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-3 py-3 border-t border-yellow-600/30 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="أرسل رسالة..."
              className="flex-1 bg-gray-900/70 border border-yellow-600/40 rounded px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black rounded px-3 py-2 text-xs font-bold transition-all shadow-lg"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* CENTER SECTION - Waiting Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Open to Everyone Mode */}
        <>
          <div className="mb-8 text-8xl animate-bounce drop-shadow-lg">❓</div>
          <h1 className="text-5xl font-black mb-4 text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
            سؤال و جواب
          </h1>
          <p className="text-lg mb-3 text-center max-w-md bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent font-bold">
            في انتظار اللاعبين...
          </p>
          <p className="text-sm mb-12 text-center max-w-md text-gray-300">كن أسرع من الجميع في الإجابة الصحيحة!</p>

          <div className="relative w-full max-w-md">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border border-yellow-600/60 rounded-xl p-8 text-center shadow-2xl">
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
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
      <div className="w-96 flex flex-col border-l-2 border-yellow-600/50 bg-gradient-to-b from-black/90 to-gray-950/90 p-4 space-y-4 overflow-y-auto shadow-2xl relative z-10">
        
        {/* Header with Tabs */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-3 px-4 rounded-lg font-bold text-sm text-center shadow-lg">
            ⚙️ إعدادات اللعبة
          </div>
        </div>

        {/* Player Count Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/40 rounded-lg p-4 shadow-md">
          <label className="text-right block text-xs font-bold text-yellow-300 mb-2">👥 اللاعبون</label>
          <div className="text-right">
            <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">∞</span>
          </div>
          <p className="text-xs text-yellow-300/70 text-right mt-2">غير محدود - كل من يريد</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gradient-to-r from-yellow-600/30 via-yellow-600/30 to-yellow-600/30"></div>

        {/* Questions Count Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/40 rounded-lg p-4 shadow-md">
          <label className="text-right block text-xs font-bold text-yellow-300 mb-4">📊 عدد الأسئلة</label>
          <div className="grid grid-cols-2 gap-3">
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionsCount(num)}
                className={`py-3 px-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 ${
                  questionsCount === num
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black border-2 border-yellow-300 shadow-lg shadow-yellow-500/50'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300 border border-gray-600/50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gradient-to-r from-yellow-600/30 via-yellow-600/30 to-yellow-600/30"></div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto pt-4 border-t border-yellow-600/30">
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-4 rounded-lg font-bold transition-all transform hover:scale-105 text-sm bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black shadow-lg shadow-yellow-600/50"
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
