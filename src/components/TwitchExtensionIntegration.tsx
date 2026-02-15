'use client';

import { useEffect, useState } from 'react';

interface TwitchPlayer {
  id: string;
  name: string;
  score: number;
  eliminated: boolean;
}

export default function TwitchExtensionIntegration({ gameId }: { gameId: string }) {
  const [twitchPlayers, setTwitchPlayers] = useState<TwitchPlayer[]>([]);
  const [isTwitchMode, setIsTwitchMode] = useState(false);

  useEffect(() => {
    const twitchWindow = window as any;
    if (twitchWindow.Twitch?.ext) {
      setIsTwitchMode(true);
      loadTwitchPlayers();

      const interval = setInterval(loadTwitchPlayers, 5000);
      return () => clearInterval(interval);
    }
  }, [gameId]);

  const loadTwitchPlayers = async () => {
    try {
      const response = await fetch(`/api/twitch?action=get-players&gameId=${gameId}`);
      const data = await response.json();
      if (data.success) {
        setTwitchPlayers(data.players || []);
      }
    } catch (error) {
      console.error('Error loading Twitch players:', error);
    }
  };

  if (!isTwitchMode) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/30 to-pink-900/30 rounded-lg border border-cyan-500/50">
      <h3 className="text-lg font-bold text-cyan-300 mb-4">
        🎮 لاعبو Twitch ({twitchPlayers.length})
      </h3>
      
      {twitchPlayers.length === 0 ? (
        <p className="text-cyan-300/70 text-center py-4">
          لا يوجد لاعبون من Twitch حالياً
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {twitchPlayers.map((player) => (
            <div
              key={player.id}
              className={`p-3 rounded-lg border-2 text-center ${
                player.eliminated
                  ? 'border-red-500 opacity-50'
                  : 'border-cyan-500'
              }`}
              style={{
                background: player.eliminated
                  ? 'rgba(255,0,0,0.1)'
                  : 'rgba(0,217,255,0.1)'
              }}
            >
              <div className="text-sm font-bold text-cyan-300">{player.name}</div>
              <div className="text-xs text-pink-400 mt-1">💯 {player.score}</div>
              {player.eliminated && (
                <div className="text-xs text-red-400 mt-1">مستبعد ❌</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-cyan-900/20 rounded border border-cyan-500/50 text-xs text-cyan-300">
        <p>💡 المشاهدون يستطيعون كتابة &quot;join&quot; في الشات للانضمام للعبة!</p>
      </div>
    </div>
  );
}
