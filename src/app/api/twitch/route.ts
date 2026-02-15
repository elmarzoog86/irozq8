import { NextResponse } from 'next/server';

// Store for Twitch viewers joining games
const twitchViewers = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, playerId, displayName, gameId } = body;

    if (action === 'join') {
      // Add viewer to game
      twitchViewers.set(playerId, {
        id: playerId,
        name: displayName || `لاعب ${twitchViewers.size + 1}`,
        gameId,
        joinedAt: new Date(),
        score: 0,
        eliminated: false
      });

      return NextResponse.json({
        success: true,
        message: `أهلاً ${displayName}! تمت إضافتك للعبة`,
        player: twitchViewers.get(playerId)
      });
    } else if (action === 'leave') {
      twitchViewers.delete(playerId);
      return NextResponse.json({
        success: true,
        message: 'تم حذفك من اللعبة'
      });
    } else if (action === 'get-players') {
      const gameId = body.gameId;
      const players = Array.from(twitchViewers.values()).filter(p => p.gameId === gameId);
      return NextResponse.json({
        success: true,
        players,
        count: players.length
      });
    } else if (action === 'update-score') {
      const player = twitchViewers.get(playerId);
      if (player) {
        player.score = body.score;
        return NextResponse.json({
          success: true,
          player
        });
      }
    } else if (action === 'eliminate') {
      const player = twitchViewers.get(playerId);
      if (player) {
        player.eliminated = true;
        return NextResponse.json({
          success: true,
          player
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'إجراء غير صحيح' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const gameId = searchParams.get('gameId');

    if (action === 'get-players' && gameId) {
      const players = Array.from(twitchViewers.values()).filter(p => p.gameId === gameId);
      return NextResponse.json({
        success: true,
        players,
        count: players.length
      });
    }

    const allPlayers = Array.from(twitchViewers.values());
    return NextResponse.json({
      success: true,
      players: allPlayers,
      count: allPlayers.length
    });
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
