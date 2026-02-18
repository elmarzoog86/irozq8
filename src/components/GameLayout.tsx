'use client';

import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const joinedPlayers = players.filter(p => p.joined);

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden" dir="rtl">
      {/* LEFT PANEL: Console + Chat */}
      <div className="w-1/4 flex flex-col gap-4 p-4 overflow-hidden">
        {/* Console Log */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-950/50 to-slate-950/50 border border-pink-500/30 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600/30 to-cyan-600/30 border-b border-pink-500/30 px-4 py-2 font-bold text-white text-sm flex items-center gap-2">
            <span>📋</span>
            <span>سجل النظام</span>
          </div>
          <div className="flex-1 overflow-y-auto bg-purple-950/30 space-y-1 p-3">
            {consoleLogs.length === 0 ? (
              <div className="text-gray-400 text-xs text-center py-4">لا توجد أحداث حتى الآن</div>
            ) : (
              consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`text-xs py-1 px-2 rounded border-r-2 font-mono ${
                    log.type === 'join'
                      ? 'bg-cyan-600/20 border-cyan-400 text-cyan-200'
                      : log.type === 'leave'
                        ? 'bg-pink-600/20 border-pink-400 text-pink-200'
                        : log.type === 'action'
                          ? 'bg-amber-600/20 border-amber-400 text-amber-200'
                          : 'bg-purple-800/30 border-purple-400 text-purple-200'
                  }`}
                >
                  <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-950/50 to-slate-950/50 border border-cyan-500/30 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600/30 to-pink-600/30 border-b border-cyan-500/30 px-4 py-2 font-bold text-white text-sm flex items-center gap-2">
            <span>💬</span>
            <span>دردشة البث</span>
          </div>
          <div className="flex-1 overflow-y-auto bg-purple-950/30 space-y-2 p-3">
            {chatMessages.length === 0 ? (
              <div className="text-gray-400 text-xs text-center py-4">لا توجد رسائل حتى الآن</div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className="text-xs bg-purple-900/40 rounded p-2 border-r-2 border-cyan-500/50">
                  <div className="font-bold text-cyan-300">{msg.username}</div>
                  <div className="text-gray-200 mt-1 break-words">{msg.message}</div>
                  <div className="text-gray-500 text-xs mt-1">{msg.timestamp}</div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Game Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-950 border-b border-pink-500/30 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-all shadow-lg"
            >
              ← الخروج
            </button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 bg-clip-text">{gameName}</h1>
              <p className="text-gray-300 text-sm mt-1">{gameDescription}</p>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-purple-950/20 to-slate-950/20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Players List */}
      <div className="w-1/4 flex flex-col bg-gradient-to-b from-purple-950/50 to-slate-950/50 border-r border-pink-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600/30 to-cyan-600/30 border-b border-pink-500/30 px-4 py-3 font-bold text-white text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>👥</span>
            <span>اللاعبون</span>
          </span>
          <span className="bg-pink-600/60 px-2 py-1 rounded text-xs">({joinedPlayers.length})</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-purple-950/20 p-4 space-y-2">
          {joinedPlayers.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-12">
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
                    ? 'bg-pink-900/20 border-pink-500/50 opacity-60'
                    : 'bg-gradient-to-r from-cyan-600/20 to-pink-600/20 border-cyan-500/50 hover:from-cyan-600/30 hover:to-pink-600/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{player.emoji || '👤'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{player.name}</div>
                    <div className="text-xs text-cyan-300">#{idx + 1}</div>
                  </div>
                  {player.score > 0 && (
                    <div className="bg-amber-600/40 text-amber-200 px-2 py-1 rounded text-xs font-bold">
                      {player.score}
                    </div>
                  )}
                </div>
                {player.eliminated && (
                  <div className="text-xs text-pink-300 mt-2 text-center">❌ تم الحذف</div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="bg-gradient-to-r from-purple-900/50 to-slate-900/50 border-t border-pink-500/30 px-4 py-3 text-xs text-gray-300 text-center">
          {joinedPlayers.length > 0
            ? `${joinedPlayers.length} لاعب${joinedPlayers.length > 2 ? 'ين' : ''} متصل${joinedPlayers.length > 2 ? 'ين' : ''}`
            : 'في انتظار اللاعبين'}
        </div>
      </div>
    </div>
  );
}
