'use client';

export default function ComingSoonPage() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%)',
      }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 w-full">
        {/* Video Container */}
        <div className="mb-8 max-w-4xl mx-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-xl shadow-2xl border-2 border-cyan-400/50"
            style={{ maxHeight: '70vh', objectFit: 'cover' }}
          >
            <source src="/videos/rozq8_3.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mb-8">
          <div className="text-6xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              جوله
            </span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">
            منصة الألعاب التفاعلية العربية
          </p>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          قريباً جداً 🚀
        </h1>

        <p className="text-lg text-cyan-200/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          نحن نعمل على شيء مذهل! منصة ألعاب تفاعلية حديثة مع تجربة لا تُنسى.
          استعد لتجربة الألعاب بطريقة جديدة تماماً.
        </p>

        {/* Countdown or notification */}
        <div className="mb-12 p-6 rounded-lg border-2 border-cyan-400/50 bg-cyan-900/20 backdrop-blur max-w-2xl mx-auto">
          <p className="text-cyan-300 text-sm mb-2">نحن نستعد لإطلاق النسخة الأولى</p>
          <p className="text-2xl font-bold text-white">
            ابقَ متابعاً معنا 👀
          </p>
        </div>
      </div>
    </div>
  );
}
