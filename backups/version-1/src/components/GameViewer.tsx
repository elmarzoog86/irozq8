'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export interface GameViewerProps {
  gameId: string;
  channelName: string;
}

export default function GameViewerComponent({ gameId, channelName }: GameViewerProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const searchParams = useSearchParams();

  // Fetch game state
  const fetchGameState = useCallback(async () => {
    try {
      // In production, this would fetch the actual session
      // For now, we'll use polling with a mock state
      console.log(`Fetching game state for ${channelName} playing ${gameId}`);
    } catch (err) {
      console.error('Failed to fetch game state:', err);
    }
  }, [channelName, gameId]);

  useEffect(() => {
    // Check for session in URL
    const sessionId = searchParams.get('session');
    if (sessionId) {
      fetchGameState();
      const interval = setInterval(fetchGameState, 2000);
      return () => clearInterval(interval);
    }
  }, [searchParams, fetchGameState]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleJoinGame = async () => {
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    try {
      setLoading(true);
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setUserId(newUserId);

      // Store locally for now
      sessionStorage.setItem('game_username', username);
      sessionStorage.setItem('game_user_id', newUserId);

      setIsJoined(true);
      setError('');

      // Simulate joining game
      await new Promise(resolve => setTimeout(resolve, 500));

      // Send join command to chat
      await fetch('/api/game/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: searchParams.get('session'),
          username,
          userId: newUserId,
          message: '!join',
        }),
      });
    } catch (err) {
      setError('Failed to join game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isJoined) return;

    try {
      await fetch('/api/game/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: searchParams.get('session'),
          username,
          userId,
          message: inputValue,
        }),
      });

      setInputValue('');
    } catch (err) {
      console.error('Failed to send command:', err);
    }
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-950 px-4">
        <div className="bg-gray-900/50 border-2 border-yellow-500 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2 text-center">
            فوازير روز
          </h1>
          <p className="text-yellow-300/70 text-center mb-6">
            {`البث المباشر: #${channelName}`}
          </p>

          <div className="mb-6">
            <p className="text-yellow-300 mb-4 text-center text-sm">
              أدخل اسم المستخدم الخاص بك للانضمام إلى اللعبة
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
              placeholder="اسمك"
              className="w-full px-4 py-3 bg-gray-800 border border-yellow-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 mb-4"
              disabled={loading}
            />
            <button
              onClick={handleJoinGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-yellow-600 hover:to-yellow-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded transition-all duration-300"
            >
              {loading ? 'جاري الدخول...' : 'انضم إلى اللعبة'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              اتبع إرشادات الستريمر لاستخدام الأوامر أثناء اللعب
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
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
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 -z-10"></div>

      {/* Header */}
      <div className="bg-gray-900/80 border-b border-yellow-500/30 px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">
            {gameId === 'questions' && '📝 لعبة الأسئلة'}
            {gameId === 'roulette' && '🎡 الروليت'}
            {gameId === 'fruits-war' && '🍎 حرب الفواكه'}
            {gameId === 'chairs' && '🪑 لعبة الكراسي'}
          </h1>
          <div className="text-right">
            <p className="text-yellow-300 text-sm">أنت: {username}</p>
            <p className="text-gray-400 text-xs">البث: #{channelName}</p>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="bg-gray-900/50 border-2 border-yellow-500/30 rounded-lg p-8 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">
            {gameId === 'questions' && '❓'}
            {gameId === 'roulette' && '🎡'}
            {gameId === 'fruits-war' && '🍎'}
            {gameId === 'chairs' && '🪑'}
          </div>
          <p className="text-yellow-300 mb-4 text-lg">
            اتبع تعليمات الستريمر وأرسل الأوامر أدناه
          </p>
          <div className="bg-gray-950/50 rounded p-4 text-sm text-gray-300">
            <p>استخدم أوامر مثل:</p>
            <p className="text-yellow-400 mt-2">
              !join - !vote - !answer - !ready - !leave
            </p>
          </div>
        </div>
      </div>

      {/* Command Input */}
      <div className="bg-gray-900/80 border-t border-yellow-500/30 px-6 py-4">
        <form onSubmit={handleSendCommand} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="أرسل أمر... (مثل: !vote option)"
            className="flex-1 px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-yellow-600 hover:to-yellow-600 text-white font-bold px-6 py-2 rounded transition-all duration-300"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}
