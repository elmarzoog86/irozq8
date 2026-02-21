'use client';

import React, { useEffect, useRef, useState } from 'react';

interface GameLayoutProps {
  gameName: string;
  gameDescription: string;
  children: React.ReactNode;
  onBack: () => void;
  players?: Array<{id: number; name: string; score: number; eliminated: boolean; joined: boolean; emoji?: string}>;
  consoleLogs?: Array<{id: string; message: string; type: 'join' | 'leave' | 'system' | 'action'; timestamp: string}>;
  chatMessages?: Array<{username: string; message: string; timestamp: string}>;
}

export default function GameLayout({ 
  gameName, 
  gameDescription, 
  children, 
  onBack, 
  players = [], 
  consoleLogs = [],
  chatMessages = []
}: GameLayoutProps) {
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [minimizedConsole, setMinimizedConsole] = useState(false);
  const [minimizedChat, setMinimizedChat] = useState(false);
  const [minimizedPlayers, setMinimizedPlayers] = useState(false);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const joinedPlayers = players.filter(p => p.joined);

  return (
    <div className="flex h-screen text-white overflow-hidden relative" dir="rtl">
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

      {/* LEFT SIDE COLLAPSE BUTTONS - Always visible */}
      {(minimizedConsole || minimizedChat) && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-r-lg p-2 shadow-lg">
          {minimizedConsole && (
            <button
              onClick={() => setMinimizedConsole(false)}
              className="hover:bg-yellow-500 rounded px-2 py-3 transition-colors text-xs font-bold text-white"
              title="فتح سجل النظام"
            >
              📋
            </button>
          )}
          {minimizedChat && (
            <button
              onClick={() => setMinimizedChat(false)}
              className="hover:bg-yellow-500 rounded px-2 py-3 transition-colors text-xs font-bold text-white"
              title="فتح الدردشة"
            >
              💬
            </button>
          )}
        </div>
      )}

      {/* LEFT PANEL: Console + Chat */}
      <div className={`${minimizedConsole && minimizedChat ? 'w-0' : 'w-1/4'} flex flex-col gap-4 p-4 overflow-hidden relative z-10 transition-all duration-300`}>
        {/* Console Log */}
        <div className={`${minimizedConsole ? 'h-auto flex-none' : 'flex-1'} flex flex-col border border-yellow-500 rounded-lg overflow-hidden shadow-lg shadow-yellow-500/30 relative`}>
          {/* Wallpaper for console */}
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(8px)', opacity: 0.4 }}
            >
              <source src="/videos/wallpaper.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-b border-yellow-400 px-4 py-2 font-bold text-white text-sm flex items-center justify-between relative z-10">
            <span className="flex items-center gap-2">
              <span>📋</span>
              <span>سجل النظام</span>
            </span>
            <button
              onClick={() => setMinimizedConsole(!minimizedConsole)}
              className="hover:bg-yellow-600 rounded px-2 py-1 transition-colors text-xs font-bold"
              title={minimizedConsole ? 'استعادة' : 'تصغير'}
            >
              {minimizedConsole ? '▶' : '◀'}
            </button>
          </div>
          {!minimizedConsole && (
            <div className="flex-1 overflow-y-auto space-y-1 p-3 relative z-10">
              {consoleLogs.length === 0 ? (
                <div className="text-gray-300 text-xs text-center py-4">لا توجد أحداث حتى الآن</div>
              ) : (
                consoleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`text-xs py-1 px-2 rounded border-r-2 font-mono ${
                      log.type === 'join'
                        ? 'bg-yellow-900/60 border-yellow-400 text-yellow-200'
                        : log.type === 'leave'
                          ? 'bg-yellow-900/60 border-yellow-400 text-yellow-200'
                          : log.type === 'action'
                            ? 'bg-amber-900/60 border-amber-400 text-amber-200'
                            : 'bg-gray-800/50 border-gray-400 text-gray-200'
                    }`}
                  >
                    <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          )}
        </div>

        {/* Chat */}
        <div className={`${minimizedChat ? 'h-auto flex-none' : 'flex-1'} flex flex-col border border-yellow-500 rounded-lg overflow-hidden shadow-lg shadow-yellow-500/30 relative`}>
          {/* Wallpaper for chat */}
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(8px)', opacity: 0.4 }}
            >
              <source src="/videos/wallpaper.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-b border-yellow-400 px-4 py-2 font-bold text-white text-sm flex items-center justify-between relative z-10">
            <span className="flex items-center gap-2">
              <span>💬</span>
              <span>دردشة البث</span>
            </span>
            <button
              onClick={() => setMinimizedChat(!minimizedChat)}
              className="hover:bg-yellow-600 rounded px-2 py-1 transition-colors text-xs font-bold"
              title={minimizedChat ? 'استعادة' : 'تصغير'}
            >
              {minimizedChat ? '▶' : '◀'}
            </button>
          </div>
          {!minimizedChat && (
            <div className="flex-1 overflow-y-auto space-y-2 p-3 relative z-10">
              {chatMessages.length === 0 ? (
                <div className="text-gray-300 text-xs text-center py-4">لا توجد رسائل حتى الآن</div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="text-xs bg-gray-800/50 rounded p-2 border-r-2 border-yellow-500">
                    <div className="font-bold text-yellow-300">{msg.username}</div>
                    <div className="text-gray-200 mt-1 break-words">{msg.message}</div>
                    <div className="text-gray-500 text-xs mt-1">{msg.timestamp}</div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* CENTER PANEL: Game Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gray-950 border-b border-yellow-500 px-6 py-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/50"
            >
              ← الخروج
            </button>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">{gameName}</h1>
              <p className="text-yellow-300 text-sm mt-1">{gameDescription}</p>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Players List - Floating Restore Button */}
      {minimizedPlayers && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-gradient-to-l from-yellow-600 to-yellow-700 rounded-l-lg p-2 shadow-lg">
          <button
            onClick={() => setMinimizedPlayers(false)}
            className="hover:bg-yellow-500 rounded px-2 py-3 transition-colors text-xs font-bold text-white"
            title="فتح اللاعبون"
          >
            👥
          </button>
        </div>
      )}

      {/* RIGHT PANEL: Players List */}
      <div className={`${minimizedPlayers ? 'w-0' : 'w-1/4'} flex flex-col relative z-10 overflow-hidden shadow-lg shadow-yellow-500/30 border-r border-yellow-500 transition-all duration-300`}>
        {/* Wallpaper Background for this panel */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(8px)', opacity: 0.4 }}
          >
            <source src="/videos/wallpaper.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-b border-yellow-400 px-4 py-3 font-bold text-white text-sm flex items-center justify-between relative z-10">
          <span className={`flex items-center gap-2 ${minimizedPlayers ? 'hidden' : ''}`}>
            <span>👥</span>
            <span>اللاعبون</span>
          </span>
          <div className="flex items-center gap-2">
            <span className={`bg-yellow-700/80 px-2 py-1 rounded text-xs ${minimizedPlayers ? 'hidden' : ''}`}>({joinedPlayers.length})</span>
            <button
              onClick={() => setMinimizedPlayers(!minimizedPlayers)}
              className="hover:bg-yellow-600 rounded px-2 py-1 transition-colors text-xs font-bold"
              title={minimizedPlayers ? 'استعادة' : 'تصغير'}
            >
              {minimizedPlayers ? '▶' : '◀'}
            </button>
          </div>
        </div>
        {!minimizedPlayers && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
            {joinedPlayers.length === 0 ? (
              <div className="text-gray-300 text-sm text-center py-12">
                <div className="text-3xl mb-2">🎮</div>
                <div>لم ينضم أحد بعد</div>
                <div className="text-xs mt-2">في انتظار اللاعبين...</div>
              </div>
            ) : (
              joinedPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-3 border transition-all ${
                    player.eliminated
                      ? 'bg-gray-800 border-red-500/50 opacity-60'
                      : 'bg-gradient-to-r from-yellow-600/40 to-yellow-600/40 border-yellow-500 hover:from-yellow-600/60 hover:to-yellow-600/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{player.emoji || '👤'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm truncate">{player.name}</div>
                      <div className="text-xs text-yellow-300">#{idx + 1}</div>
                    </div>
                    {player.score > 0 && (
                      <div className="bg-amber-600 text-amber-100 px-2 py-1 rounded text-xs font-bold">
                        {player.score}
                      </div>
                    )}
                  </div>
                  {player.eliminated && (
                    <div className="text-xs text-red-300 mt-2 text-center">❌ تم الحذف</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        <div className="bg-gray-900 border-t border-yellow-500 px-4 py-3 text-xs text-gray-300 text-center">
          {joinedPlayers.length > 0
            ? `${joinedPlayers.length} لاعب${joinedPlayers.length > 2 ? 'ين' : ''} متصل${joinedPlayers.length > 2 ? 'ين' : ''}`
            : 'في انتظار اللاعبين'}
        </div>
      </div>
    </div>
  );
}
