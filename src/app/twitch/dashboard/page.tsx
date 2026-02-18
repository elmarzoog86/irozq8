'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface TwitchUser {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  email: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');
  const gameParam = searchParams.get('game');

  const [user, setUser] = useState<TwitchUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameRunning, setGameRunning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(gameParam || 'questions');
  const [playerCount, setPlayerCount] = useState(0);
  const [_gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [_error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Fetch user info
    fetchUserInfo();
    
    // If game is selected from URL, start the game
    if (gameParam) {
      setTimeout(() => {
        setGameRunning(true);
        setPlayerCount(0);
        setGameSessionId(`session_${Date.now()}`);
      }, 500);
    }
  }, [sessionId, gameParam]);

  const fetchUserInfo = async () => {
    try {
      console.log('Fetching user info for session:', sessionId);
      const response = await fetch(`/api/twitch/session?action=user&session=${sessionId}`);
      const data = await response.json();

      console.log('User info response:', data);
      if (data.success) {
        setUser(data.user);
      } else {
        console.error('Failed to get user:', data.error);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`/api/twitch/session?action=logout&session=${sessionId}`);
    router.push('/');
  };

  const handleStartGame = () => {
    setGameRunning(true);
    setPlayerCount(0);
    setGameSessionId(`session_${Date.now()}`);
    setError('');
  };

  const handleEndGame = () => {
    setGameRunning(false);
    setGameSessionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <p className="text-2xl text-cyan-300">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-400">حدث خطأ، يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}} className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            🎮 لوحة تحكم المذيع
          </h1>
          <p className="text-xl text-cyan-300/70">مرحباً {user.displayName} 👋</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* User Profile Card */}
          <div className="col-span-1 rounded-lg border-2 border-cyan-500/50 p-6" style={{background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)'}}>
            <div className="text-center">
              <img 
                src={user.profileImageUrl} 
                alt={user.displayName}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-500"
              />
              <h2 className="text-2xl font-bold text-cyan-300 mb-2">{user.displayName}</h2>
              <p className="text-cyan-300/70 mb-4">@{user.login}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Game Control Panel */}
          <div className="col-span-2 rounded-lg border-2 border-pink-500/50 p-6" style={{background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)'}}>
            <h3 className="text-2xl font-bold text-pink-400 mb-6">🎮 التحكم باللعبة</h3>

            <div className="mb-6">
              <label className="block text-cyan-300 font-bold mb-2">اختر اللعبة:</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                disabled={gameRunning}
                className="w-full bg-slate-800 border-2 border-cyan-500 text-white p-3 rounded-lg disabled:opacity-50"
              >
                <option value="questions">🎯 جولة أسئلة</option>
                <option value="roulette">🎡 الروليت</option>
                <option value="fruits-war">🍌 حرب الفواكه</option>
                <option value="chairs">🪑 لعبة كراسي</option>
              </select>
            </div>

            <div className="flex gap-4">
              {!gameRunning ? (
                <button
                  onClick={handleStartGame}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                  style={{boxShadow: '0 0 20px rgba(68, 255, 68, 0.3)'}}
                >
                  ▶️ بدء اللعبة
                </button>
              ) : (
                <button
                  onClick={handleEndGame}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                  style={{boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)'}}
                >
                  ⏹️ إنهاء اللعبة
                </button>
              )}
            </div>

            {gameRunning && (
              <div className="mt-6 p-4 bg-green-900/30 border-2 border-green-500 rounded-lg">
                <p className="text-green-400 font-bold">✓ اللعبة قيد التشغيل</p>
                <p className="text-green-300 text-sm">عدد اللاعبين المتصلين: {playerCount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Integration */}
        <div className="rounded-lg border-2 border-cyan-500/50 p-6" style={{background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)'}}>
          <h3 className="text-2xl font-bold text-cyan-400 mb-6">💬 اتصال Twitch Chat</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Chat Status */}
            <div className="p-4 bg-slate-800 rounded-lg border-2 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 font-bold">متصل بـ Twitch Chat</span>
              </div>
              <p className="text-cyan-300/70 text-sm">جاهز للتفاعل مع المشاهدين في الشات</p>
            </div>

            {/* Features */}
            <div className="p-4 bg-slate-800 rounded-lg border-2 border-cyan-500/30">
              <h4 className="text-cyan-300 font-bold mb-3">المميزات:</h4>
              <ul className="text-cyan-300/70 text-sm space-y-1">
                <li>✓ قراءة الرسائل من الشات</li>
                <li>✓ إرسال إعلانات للعبة</li>
                <li>✓ إدارة اللاعبين من الشات</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="rounded-lg p-6 bg-gradient-to-br from-cyan-900/30 to-cyan-900/50 border-2 border-cyan-500/50 text-center">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-cyan-300/70">اللاعبون المتصلون</p>
            <p className="text-3xl font-bold text-cyan-400">{playerCount}</p>
          </div>

          <div className="rounded-lg p-6 bg-gradient-to-br from-pink-900/30 to-pink-900/50 border-2 border-pink-500/50 text-center">
            <div className="text-4xl mb-2">🎮</div>
            <p className="text-pink-300/70">الحالة</p>
            <p className="text-3xl font-bold text-pink-400">{gameRunning ? '🟢 جاري' : '⚪ متوقفة'}</p>
          </div>

          <div className="rounded-lg p-6 bg-gradient-to-br from-amber-900/30 to-amber-900/50 border-2 border-amber-500/50 text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <p className="text-amber-300/70">وقت الجلسة</p>
            <p className="text-3xl font-bold text-amber-400">جارية</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TwitchDashboard() {
  return (
    <Suspense fallback={
      <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">جاري التحميل...</h1>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
