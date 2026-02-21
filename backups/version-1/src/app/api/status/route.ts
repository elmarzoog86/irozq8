/**
 * Deployment Control API
 * This API provides information about the deployment status
 * Note: To toggle coming soon mode, update the environment variable on Vercel
 */

export async function GET() {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  const nodeEnv = process.env.NODE_ENV;

  return new Response(
    JSON.stringify({
      status: 'ok',
      deployment: {
        timestamp: new Date().toISOString(),
        environment: nodeEnv,
        comingSoonMode: isComingSoon,
        url: 'https://jawlah-games.vercel.app',
        mode: isComingSoon ? 'قريباً جداً' : 'مباشر',
      },
      instructions: {
        ar: 'لتغيير الوضع، اذهب إلى https://vercel.com وعدّل NEXT_PUBLIC_COMING_SOON',
        en: 'To toggle mode, go to https://vercel.com and edit NEXT_PUBLIC_COMING_SOON',
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
