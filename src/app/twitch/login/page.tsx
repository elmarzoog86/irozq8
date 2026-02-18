'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

function TwitchLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for error from callback
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(`خطأ في تسجيل الدخول: ${errorParam}`);
    }
  }, [searchParams]);

  const handleTwitchLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(7);
      
      // Store state in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('twitch_oauth_state', state);
      }

      const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
      
      if (!TWITCH_CLIENT_ID) {
        setError('خطأ: لم يتم تكوين عميل Twitch بشكل صحيح');
        setLoading(false);
        return;
      }

      const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
      authUrl.searchParams.append('client_id', TWITCH_CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', window.location.origin + '/api/twitch/callback');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', 'user:read:email user:read:chat chat:read analytics:read:extensions');
      authUrl.searchParams.append('state', state);

      // Redirect to Twitch OAuth
      window.location.href = authUrl.toString();
    } catch (err) {
      setError('حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}} className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Main Login Card */}
          <div 
            className="rounded-2xl border-2 border-cyan-500/50 p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(255, 0, 110, 0.15) 100%)',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(255, 0, 110, 0.1)'
            }}
          >
            {/* Icon */}
            <div className="text-6xl mb-6">🎮</div>

            {/* Heading */}
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              فوازير روز
            </h1>
            <p className="text-cyan-300/70 text-lg mb-8">منصة الألعاب التفاعلية</p>

            {/* Description */}
            <div className="mb-8 p-4 bg-slate-900/50 rounded-lg border-2 border-cyan-500/30">
              <p className="text-cyan-300/70 text-sm">
                استخدم حسابك على Twitch لتشغيل الألعاب والتفاعل مع المشاهدين مباشرة على البث الخاص بك
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border-2 border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleTwitchLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mb-4"
              style={{
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
                ...(loading && {boxShadow: 'none'})
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  <span>جاري التحميل...</span>
                </>
              ) : (
                <>
                  <span>🔑</span>
                  <span>دخول عبر Twitch</span>
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={handleBackHome}
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
              العودة للرئيسية
            </button>
          </div>

          {/* Info Cards */}
          <div className="mt-8 space-y-4">
            {/* Feature 1 */}
            <div className="rounded-lg border-2 border-cyan-500/30 p-4 bg-slate-900/30">
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-cyan-300 font-bold">ألعاب متنوعة</h3>
                  <p className="text-cyan-300/60 text-sm">اختر من 4 ألعاب تفاعلية مثيرة</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border-2 border-pink-500/30 p-4 bg-slate-900/30">
              <div className="flex gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-pink-300 font-bold">تفاعل مباشر</h3>
                  <p className="text-pink-300/60 text-sm">تواصل مع المشاهدين عبر Twitch Chat</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border-2 border-cyan-500/30 p-4 bg-slate-900/30">
              <div className="flex gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="text-cyan-300 font-bold">إدارة سهلة</h3>
                  <p className="text-cyan-300/60 text-sm">لوحة تحكم موحدة لكل شيء</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-cyan-300/50 text-xs">
              نحن لا نخزن كلمات المرور الخاصة بك. نستخدم OAuth من Twitch بشكل آمن فقط.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TwitchLogin() {
  return (
    <Suspense fallback={
      <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-cyan-300">جاري التحميل...</p>
        </div>
      </div>
    }>
      <TwitchLoginContent />
    </Suspense>
  );
}
