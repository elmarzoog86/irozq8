'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import ComingSoonPage from '@/components/ComingSoonPage';
import { games } from '@/data/games';

interface TwitchUser {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  email: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');
  const gameParam = searchParams.get('game');
  
  const [selectedGame, setSelectedGame] = useState<string | null>(gameParam || null);
  const [user, setUser] = useState<TwitchUser | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [gameRunning, setGameRunning] = useState(!!gameParam);
  const [playerCount, setPlayerCount] = useState(0);
  const [_gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [isMainDomain, setIsMainDomain] = useState(false);
  
  // Check if coming soon mode is enabled (for env variable)
  const isComingSoonEnv = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  
  // Check if we're on the main domain (irozq8.com)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isMain = hostname === 'irozq8.com' || hostname === 'www.irozq8.com';
      setIsMainDomain(isMain);
    }
  }, []);
  
  // Show coming soon only on main domain
  const isComingSoon = isComingSoonEnv || isMainDomain;
  
  useEffect(() => {
    if (sessionId) {
      // User is logged in, fetch their info
      fetchUserInfo();
      // If game is selected from URL, start the game
      if (gameParam) {
        setTimeout(() => {
          setGameRunning(true);
          setPlayerCount(0);
          setGameSessionId(`session_${Date.now()}`);
        }, 500);
      }
    } else {
      setLoading(false);
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
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = (gameId: string) => {
    // Navigate to the games page with game ID and session parameter
    if (sessionId) {
      router.push(`/games?id=${gameId}&session=${sessionId}`);
    }
  };

  const handleEndGame = () => {
    setGameRunning(false);
    setSelectedGame(null);
    setPlayerCount(0);
    setGameSessionId(null);
  };

  const handleLogout = async () => {
    if (sessionId) {
      await fetch(`/api/twitch/session?action=logout&session=${sessionId}`);
    }
    setUser(null);
    setSelectedGame(null);
    setGameRunning(false);
    router.push('/');
  };
  
  if (isComingSoon) {
    return <ComingSoonPage />;
  }

  // If user is logged in and game is running, show dashboard with game
  if (user && gameRunning && selectedGame && sessionId) {
    return (
      <div style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'}} className="min-h-screen">
        <Header />
        <DashboardGameView 
          user={user}
          sessionId={sessionId}
          selectedGame={selectedGame}
          playerCount={playerCount}
          onEndGame={handleEndGame}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}} className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Streamer Login Banner - Only show if not logged in AND no session in URL AND not loading */}
        {!user && !loading && !sessionId && (
          <div className="mb-8 rounded-lg border-2 border-yellow-600/50 p-6 text-center" style={{background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)'}}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">🎮 هل أنت مذيع؟</h3>
                <p className="text-yellow-400/70">استخدم لوحة التحكم الكاملة للتحكم بالألعاب والتفاعل مع جمهورك على Twitch</p>
              </div>
              <a 
                href="/twitch/login"
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-bold rounded-lg transition-all duration-300 whitespace-nowrap"
                style={{boxShadow: '0 0 15px rgba(217, 119, 6, 0.4)'}}
              >
                دخول Twitch
              </a>
            </div>
          </div>
        )}

        {/* Welcome message if logged in */}
        {user && (
          <div className="mb-8 text-center flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">مرحباً {user.displayName} 👋</h2>
              <p className="text-yellow-400/70">اختر لعبة لتبدأ البث المباشر</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              تسجيل خروج
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            اختر اللعبة المفضلة لديك
          </h1>
          <p className="text-xl text-yellow-400/70">
            مجموعة متنوعة من الفوازير والألعاب التفاعلية لإبقاء متابعيك مستمتعين ومتفاعلين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div key={game.id} onClick={() => user ? handleSelectGame(game.id) : null}>
              <GameCard
                game={game}
                isSelected={selectedGame === game.id}
                onSelect={() => user ? handleSelectGame(game.id) : null}
                sessionId={sessionId || undefined}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

  // Simple game view component for showing the game
function DashboardGameView({ 
  user, 
  sessionId, 
  selectedGame, 
  playerCount, 
  onEndGame, 
  onLogout 
}: {
  user: TwitchUser;
  sessionId: string;
  selectedGame: string;
  playerCount: number;
  onEndGame: () => void;
  onLogout: () => void;
}) {
  const gameData = games.find(g => g.id === selectedGame);
  const gameEmojis: { [key: string]: string } = {
    'questions': '❓',
    'roulette': '🎡',
    'fruits-war': '🍎',
    'maze': '🗺️',
    'chairs': '🪑',
    'logos': '🎯',
    'words': '📝',
    'mosaics': '🎨',
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">{gameData?.nameAr || selectedGame}</h1>
          <p className="text-yellow-400/70 text-sm mt-1">👥 اللاعبين: {playerCount}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onEndGame}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
          >
            إنهاء اللعبة
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      {/* Game display area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Game canvas - 2/3 width */}
        <div className="col-span-2">
          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border-2 border-yellow-600/30 rounded-lg p-6 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">{gameEmojis[selectedGame] || '🎮'}</div>
              <h2 className="text-2xl text-yellow-400 font-bold mb-2">{gameData?.nameAr}</h2>
              <p className="text-yellow-400/70">{gameData?.descriptionAr}</p>
            </div>
          </div>
        </div>

        {/* Info panel - 1/3 width */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border-2 border-yellow-600/30 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <p className="text-yellow-400/70 text-sm">المذيع</p>
                <p className="text-white font-bold">{user.displayName}</p>
              </div>
              <div>
                <p className="text-yellow-400/70 text-sm">الجلسة</p>
                <p className="text-white font-mono text-xs">{sessionId.substring(0, 8)}...</p>
              </div>
              <div>
                <p className="text-cyan-300/70 text-sm">اللاعبون النشطون</p>
                <p className="text-white font-bold text-xl">{playerCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <HomeContent />
    </Suspense>
  );
}