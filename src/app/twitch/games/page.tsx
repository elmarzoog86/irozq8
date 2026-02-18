'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  icon: string;
  color: string;
}

const GAMES: Game[] = [
  {
    id: 'questions',
    name: 'جولة أسئلة',
    emoji: '📝',
    description: 'اختبر معرفة المشاهدين بأسئلة متعددة الخيارات',
    icon: '❓',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'roulette',
    name: 'الروليت',
    emoji: '🎡',
    description: 'اختر فائز عشوائي من المشاهدين',
    icon: '🎰',
    color: 'from-pink-600 to-pink-800'
  },
  {
    id: 'fruits-war',
    name: 'حرب الفواكه',
    emoji: '🍎',
    description: 'لعبة تصفية فواكه بالتصويت',
    icon: '🍌',
    color: 'from-yellow-600 to-yellow-800'
  },
  {
    id: 'chairs',
    name: 'لعبة الكراسي',
    emoji: '🪑',
    description: 'لعبة الموسيقى والكراسي الكلاسيكية',
    icon: '🎵',
    color: 'from-purple-600 to-purple-800'
  }
];

function GameSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Fetch user info
    fetchUserInfo();
  }, [sessionId]);

  const fetchUserInfo = async () => {
    try {
      console.log('Fetching user info for session:', sessionId);
      const response = await fetch(`/api/twitch/session?action=user&session=${sessionId}`);
      const data = await response.json();

      console.log('User info response:', data);
      if (data.success && data.user) {
        setUserName(data.user.displayName);
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

  const handleSelectGame = (gameId: string) => {
    router.push(`/twitch/dashboard?session=${sessionId}&game=${gameId}`);
  };

  const handleLogout = async () => {
    await fetch(`/api/twitch/session?action=logout&session=${sessionId}`);
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-2xl text-cyan-300 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }} className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            🎮 اختر اللعبة
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300/70">مرحباً {userName} 👋</p>
          <p className="text-lg text-cyan-300/50 mt-2">اختر اللعبة التي تريد تشغيلها للمشاهدين</p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {GAMES.map((game) => (
            <div
              key={game.id}
              onClick={() => handleSelectGame(game.id)}
              className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl border-4 border-cyan-400/50 cursor-pointer hover:border-pink-400 hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
              style={{
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.3), inset 0 0 30px rgba(255, 0, 110, 0.1)'
              }}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{game.emoji}</div>
                <h2 className="text-4xl font-bold text-white mb-3">{game.name}</h2>
                <p className="text-white/80 text-lg mb-6">{game.description}</p>
                
                {/* Stats */}
                <div className="bg-black/30 rounded-lg p-4 mb-6">
                  <p className="text-white/60 text-sm">اضغط للبدء</p>
                </div>

                <button
                  className="w-full bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-cyan-200 transition-all duration-300 text-xl"
                >
                  ▶️ ابدأ {game.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-2 border-cyan-500/50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-cyan-300 mb-4">💡 نصائح</h3>
          <ul className="space-y-3 text-cyan-300/80">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>جميع الألعاب تدعم الآلية والمشاهدين</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>يمكن للمشاهدين الانضمام من خلال رابط اللعبة</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>استخدم أوامر الشات للتحكم في اللعبة</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>يمكنك تغيير اللعبة في أي وقت</span>
            </li>
          </ul>
        </div>

        {/* Footer with Logout */}
        <div className="text-center mb-8">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            تسجيل الخروج
          </button>
        </div>
      </main>
    </div>
  );
}

export default function GameSelection() {
  return (
    <Suspense fallback={
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">جاري التحميل...</h1>
        </div>
      </div>
    }>
      <GameSelectionContent />
    </Suspense>
  );
}
