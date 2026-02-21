'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GameViewerComponent from '@/components/GameViewer';

function GamePageContent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId') || 'questions';
  const channel = searchParams.get('channel') || 'default';

  return (
    <GameViewerComponent 
      gameId={gameId} 
      channelName={channel}
    />
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
