'use client';

import { useState } from 'react';

interface FruitsWarGameProps {
  playerCount: number;
  players: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean; fruit?: string}>;
  setPlayers: (players: any[]) => void;
  onEndGame: () => void;
}

const fruits = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🥝', '🍉', '🍈', '🍑'];

export default function FruitsWarGame({
  playerCount,
  players,
  setPlayers,
  onEndGame,
}: FruitsWarGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  // Assign fruits to players
  const handleStartGame = () => {
    const updatedPlayers = [...players].map((player, index) => ({
      ...player,
      fruit: fruits[index % fruits.length],
    }));
    setPlayers(updatedPlayers);
    setGameStarted(true);
    setGameActive(true);
  };

  // Handle player elimination
  const handleEliminatePlayer = (playerId: number) => {
    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
    if (playerIndex >= 0 && !updatedPlayers[playerIndex].eliminated) {
      updatedPlayers[playerIndex].eliminated = true;
      updatedPlayers[playerIndex].score -= 5;
      setPlayers(updatedPlayers);

      // Check if game should end
      const remaining = updatedPlayers.filter(p => !p.eliminated).length;
      if (remaining <= 1) {
        setGameActive(false);
      }
    }
  };

  const activePlayers = players.filter(p => !p.eliminated);

  return (
    <div className="w-full">
      {!gameStarted ? (
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-cyan-300 mb-8">🍎 حرب الفواكه 🍎</h2>
          <p className="text-xl text-cyan-200 mb-8">
            تم تعيين فاكهة لكل لاعب. انقر على اللاعبين لاستبعادهم!
          </p>
          
          {/* Preview of assigned fruits */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="p-6 rounded-lg border-2 border-cyan-500 bg-cyan-900/20"
              >
                <div className="text-5xl mb-3">{fruits[index % fruits.length]}</div>
                <div className="font-bold text-cyan-300">{player.name}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-12 rounded-lg text-lg"
            style={{boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'}}
          >
            ▶️ ابدأ اللعبة
          </button>
        </div>
      ) : gameActive ? (
        <div>
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-cyan-300 mb-4">
              🍎 تنافس من أجل البقاء! 🍎
            </div>
            <div className="text-lg text-cyan-200">
              اللاعبون المتبقيون: {activePlayers.length}/{playerCount}
            </div>
          </div>

          {/* Game Arena - Click players to eliminate */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {players.map((player) => (
              <div
                key={player.id}
                onClick={() => !player.eliminated && handleEliminatePlayer(player.id)}
                className={`p-6 rounded-lg border-2 text-center transition-all cursor-pointer transform hover:scale-105 ${
                  player.eliminated
                    ? 'border-red-500 opacity-50 bg-red-900/20 cursor-not-allowed'
                    : 'border-cyan-500 bg-cyan-900/20 hover:bg-cyan-800/30 hover:shadow-lg hover:shadow-cyan-500/50'
                }`}
              >
                <div className="text-6xl mb-3 transform hover:scale-110 transition-transform">
                  {player.fruit}
                </div>
                <div className="font-bold text-cyan-300 mb-2">{player.name}</div>
                <div className="text-xl font-bold text-pink-400 mb-3">{player.score} نقاط</div>
                {player.eliminated ? (
                  <div className="text-red-400 font-bold">مستبعد ❌</div>
                ) : (
                  <div className="text-cyan-300 text-sm">انقر للاستبعاد</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setGameActive(false);
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg"
            >
              ⏹️ إنهاء اللعبة
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-cyan-300 mb-8">🏆 انتهت اللعبة! 🏆</h2>

          {/* Final Rankings */}
          <div className="space-y-4 mb-8">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 bg-gradient-to-r from-cyan-600/30 to-pink-600/30 rounded-lg border-2 border-cyan-500"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {player.fruit} {player.name}
                    </div>
                    <div className="text-3xl font-bold text-pink-400">{player.score}</div>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={onEndGame}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            ← العودة للألعاب
          </button>
        </div>
      )}
    </div>
  );
}
