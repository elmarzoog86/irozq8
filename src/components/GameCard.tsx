'use client';

import { useRouter } from 'next/navigation';
import { Game } from '@/data/games';

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onSelect: () => void;
  sessionId?: string;
}

// Map game IDs to their SVG images
const gameImages: { [key: string]: string } = {
  'questions': '/games/questions.svg',
  'roulette': '/games/roulette.svg',
  'maze': '/games/maze.svg',
  'chairs': '/games/chairs.svg',
  'fruits-war': '/games/fruits.svg',
  'flags': '/games/flags.svg',
  'capitals': '/games/capitals.svg',
  'asra3': '/games/asra3.svg',
  'blur': '/games/blur.svg',
  'drawing': '/games/drawing.svg',
  'logos': '/games/logos.svg',
  'kalemat': '/games/kalemat.svg',
  'masaqil': '/games/masaqil.svg',
};

export default function GameCard({ game, isSelected, onSelect, sessionId }: GameCardProps) {
  const gameImage = game.image || gameImages[game.id] || '/games/questions.svg';
  const router = useRouter();

  const handlePlayNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = sessionId 
      ? `/games?id=${game.id}&session=${sessionId}`
      : `/games?id=${game.id}`;
    router.push(url);
  };
  
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
        isSelected ? 'border-cyan-400 shadow-lg' : 'border-cyan-500/30'
      }`}
      style={{
        background: isSelected 
          ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(255, 0, 110, 0.2) 100%)'
          : 'linear-gradient(135deg, rgba(3, 217, 255, 0.05) 0%, rgba(255, 0, 110, 0.05) 100%)',
        boxShadow: isSelected ? '0 0 30px rgba(0, 217, 255, 0.3)' : 'none'
      }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <img 
          src={gameImage} 
          alt={game.nameAr}
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">{game.nameAr}</h3>
        <p className="text-cyan-300/60 text-sm mb-4 line-clamp-2">{game.descriptionAr}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-cyan-300/70">
            👥 {game.minPlayers}-{game.maxPlayers} لاعب
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePlayNow}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            style={{boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)'}}
          >
            🎮 ألعب
          </button>
        </div>
      </div>
    </div>
  );
}
