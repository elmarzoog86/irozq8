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
  const [joinMode, setJoinMode] = useState<'join-only' | 'open' | 'teams' | 'whitelist'>('open');
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
    <div className="w-full h-full flex" dir="rtl" style={{ background: '#0f0f1e' }}>
      {/* LEFT SECTION - System Log (سجل النظام) */}
      <div className="w-80 flex flex-col border-r border-purple-500/20 bg-black/40">
        <div className="px-4 py-3 border-b border-purple-500/20">
          <h3 className="text-sm font-bold text-cyan-300">سجل النظام</h3>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.type === 'system' ? (
                <div className="px-2 py-1 bg-cyan-600/20 rounded text-cyan-300 text-xs border border-cyan-600/30">
                  {msg.message}
                </div>
              ) : (
                <div>
                  <span className="text-pink-400 font-semibold">{msg.user}: </span>
                  <span className="text-gray-300">{msg.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-3 py-3 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="أرسل رسالة..."
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded px-3 py-1 text-xs font-bold transition-all"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* CENTER SECTION - Waiting Area */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 100%)' }}>
        {joinMode === 'open' ? (
          // Open to Everyone Mode
          <>
            <div className="mb-6 text-7xl animate-bounce">👥</div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">في انتظار اللاعبين</h1>
            <p className="text-cyan-300 text-sm mb-8 text-center max-w-md">اضغط للعبة وكن السريع في الإجابة!</p>

            <div className="bg-purple-600/30 border border-purple-500/50 rounded-lg p-6 max-w-md w-full text-center">
              <h3 className="text-cyan-300 font-bold mb-3">خطوات الانضمام إلى اللعبة</h3>
              <div className="bg-purple-700/30 rounded px-4 py-3">
                <p className="text-purple-300 text-sm font-bold">1</p>
                <p className="text-gray-300 text-xs mt-2">أي شخص في الشات يمكنه الإجابة مباشرة</p>
              </div>
            </div>
          </>
        ) : (
          // Join Only Mode
          <>
            <div className="mb-6 text-7xl animate-bounce">🔐</div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Join فقط</h1>
            <p className="text-cyan-300 text-sm mb-8 text-center max-w-md">فقط الذين استخدموا اتفاقية الإدارة</p>

            <div className="bg-purple-600/30 border border-purple-500/50 rounded-lg p-6 max-w-md w-full text-center">
              <h3 className="text-cyan-300 font-bold mb-3">خطوات الانضمام إلى اللعبة</h3>
              <div className="bg-purple-700/30 rounded px-4 py-3">
                <p className="text-purple-300 text-sm font-bold">1</p>
                <p className="text-gray-300 text-xs mt-2">استخدام رمز الانضمام المخصص</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SECTION - Settings */}
      <div className="w-96 flex flex-col border-l border-purple-500/20 bg-black/40 p-4 space-y-4 overflow-y-auto">
        
        {/* Header with Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded font-bold text-sm">
            إعدادات اللعبة
          </button>
        </div>

        {/* Player Count */}
        <div>
          <label className="text-right block text-xs text-gray-300 mb-2">اللاعبون</label>
          <div className="text-right">
            <span className="text-3xl font-bold text-cyan-400">∞</span>
          </div>
          <p className="text-xs text-gray-400 text-right mt-2">غير محدود</p>
        </div>

        {/* Questions Count */}
        <div>
          <label className="text-right block text-xs text-gray-300 mb-3">عدد الأسئلة</label>
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

        {/* Divider */}
        <div className="border-t border-purple-500/20 my-2"></div>

        {/* Join Mode Settings */}
        <div>
          <h3 className="text-sm font-bold text-purple-300 mb-3">طريقة دخول اللعبة</h3>
          <div className="space-y-2">
            {/* Join Only */}
            <button
              onClick={() => setJoinMode('join-only')}
              className={`w-full text-right px-3 py-2 rounded-lg border transition-all text-sm ${
                joinMode === 'join-only'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-end gap-2">
                {joinMode === 'join-only' && <span className="text-lg">✓</span>}
                <div>
                  <p className="font-bold">Join فقط</p>
                  <p className="text-xs text-gray-400">فقط الذين استخدموا اتفاقية الإدارة</p>
                </div>
              </div>
            </button>

            {/* Open to Everyone */}
            <button
              onClick={() => setJoinMode('open')}
              className={`w-full text-right px-3 py-2 rounded-lg border transition-all text-sm ${
                joinMode === 'open'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-end gap-2">
                {joinMode === 'open' && <span className="text-lg">✓</span>}
                <div>
                  <p className="font-bold">مفتوح للجميع</p>
                  <p className="text-xs text-gray-400">أي شخص بيشات يشترك في اللعبة</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/20 my-2"></div>

        {/* Bottom Info */}
        <div className="text-xs text-gray-500 text-right space-y-1">
          <p>الانتقال للسؤال التالي</p>
          <p>أكثر الخاسرين والفائز</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto pt-4 border-t border-purple-500/20">
          <button
            onClick={handleStartGame}
            className="w-full py-3 px-4 rounded-lg font-bold transition-all text-sm bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            ✓ بدء اللعبة
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 px-4 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 text-white transition-all text-sm"
          >
            ← العودة
          </button>

          <button className="w-full py-2 px-4 rounded-lg font-bold bg-red-600/80 hover:bg-red-700 text-white transition-all text-sm">
            إعادة تعيين إلى الإعدادات الافتراضية
          </button>
        </div>
      </div>
    </div>
  );
}
