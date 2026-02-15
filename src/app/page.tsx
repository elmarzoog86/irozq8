'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import ComingSoonPage from '@/components/ComingSoonPage';
import { games } from '@/data/games';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  // Check if coming soon mode is enabled
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  
  if (isComingSoon) {
    return <ComingSoonPage />;
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%)'}} className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Streamer Login Banner */}
        <div className="mb-8 rounded-lg border-2 border-purple-500/50 p-6 text-center" style={{background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)'}}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-300 mb-2">🎮 هل أنت مذيع؟</h3>
              <p className="text-purple-300/70">استخدم لوحة التحكم الكاملة للتحكم بالألعاب والتفاعل مع جمهورك على Twitch</p>
            </div>
            <a 
              href="/twitch/login"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 whitespace-nowrap"
              style={{boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'}}
            >
              دخول Twitch
            </a>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            اختر اللعبة المفضلة لديك
          </h1>
          <p className="text-xl text-cyan-300/70">
            مجموعة متنوعة من الفوازير والألعاب التفاعلية لإبقاء متابعيك مستمتعين ومتفاعلين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={selectedGame === game.id}
              onSelect={() => setSelectedGame(game.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
