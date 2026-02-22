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
      // Get OAuth URL from backend
      const response = await fetch('/api/twitch/auth-url');
      const data = await response.json();
      
      if (!data.success || !data.authUrl) {
        setError('خطأ: لم يتم تكوين عميل Twitch بشكل صحيح. تأكد من تعيين المتغيرات على Vercel');
        setLoading(false);
        return;
      }

      // Redirect to Twitch OAuth
      window.location.href = data.authUrl;
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* Wallpaper Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-10"
        style={{
          filter: 'blur(8px)',
          opacity: 0.6
        }}
      >
        <source src="/videos/wallpaper.webm" type="video/webm" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-md w-full">
          {/* Main Login Card */}
          <div 
            className="rounded-2xl border-2 border-yellow-500/50 p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',
              boxShadow: '0 0 30px rgba(234, 179, 8, 0.2), 0 0 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Icon */}
            <div className="text-6xl mb-6">🎮</div>

            {/* Heading */}
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              فوازير روز
            </h1>
            <p className="text-yellow-300/70 text-lg mb-8">منصة الألعاب التفاعلية</p>

            {/* Description */}
            <div className="mb-8 p-4 bg-black/50 rounded-lg border-2 border-yellow-500/30">
              <p className="text-yellow-300/70 text-sm">
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
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mb-4"
              style={{
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)',
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
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
              العودة للرئيسية
            </button>
          </div>

          {/* Info Cards */}
          <div className="mt-8 space-y-4">
            {/* Feature 1 */}
            <div className="rounded-lg border-2 border-yellow-500/30 p-4 bg-black/40">
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-yellow-300 font-bold">ألعاب متنوعة</h3>
                  <p className="text-yellow-300/60 text-sm">اختر من 4 ألعاب تفاعلية مثيرة</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border-2 border-yellow-500/30 p-4 bg-black/40">
              <div className="flex gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-yellow-300 font-bold">تفاعل مباشر</h3>
                  <p className="text-yellow-300/60 text-sm">تواصل مع المشاهدين عبر Twitch Chat</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border-2 border-yellow-500/30 p-4 bg-black/40">
              <div className="flex gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="text-yellow-300 font-bold">إدارة سهلة</h3>
                  <p className="text-yellow-300/60 text-sm">لوحة تحكم موحدة لكل شيء</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-yellow-300/50 text-xs">
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
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        {/* Wallpaper Background */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover -z-10"
          style={{
            filter: 'blur(8px)',
            opacity: 0.6
          }}
        >
          <source src="/videos/wallpaper.webm" type="video/webm" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 -z-10"></div>

        <div className="text-center relative z-10">
          <p className="text-2xl text-yellow-300">جاري التحميل...</p>
        </div>
      </div>
    }>
      <TwitchLoginContent />
    </Suspense>
  );
}
