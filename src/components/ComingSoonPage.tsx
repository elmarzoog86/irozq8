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
      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <div className="text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              جوله
            </span>
          </div>
          <p className="text-2xl font-bold text-cyan-300 mb-2">
            منصة الألعاب التفاعلية العربية
          </p>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          قريباً جداً 🚀
        </h1>

        <p className="text-xl text-cyan-200/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          نحن نعمل على شيء مذهل! منصة ألعاب تفاعلية حديثة مع تجربة لا تُنسى.
          استعد لتجربة الألعاب بطريقة جديدة تماماً.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg border-2 border-cyan-500/50 bg-cyan-900/10 backdrop-blur">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2">ألعاب متنوعة</h3>
            <p className="text-cyan-200/70 text-sm">تجربة ألعاب تفاعلية مثيرة وممتعة</p>
          </div>

          <div className="p-6 rounded-lg border-2 border-purple-500/50 bg-purple-900/10 backdrop-blur">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-purple-300 mb-2">لاعبون متعددون</h3>
            <p className="text-purple-200/70 text-sm">العب مع أصدقائك وأهلك في نفس الوقت</p>
          </div>

          <div className="p-6 rounded-lg border-2 border-pink-500/50 bg-pink-900/10 backdrop-blur">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-pink-300 mb-2">بدون تعقيدات</h3>
            <p className="text-pink-200/70 text-sm">واجهة سهلة وبسيطة تناسب الجميع</p>
          </div>
        </div>

        {/* Countdown or notification */}
        <div className="mb-12 p-6 rounded-lg border-2 border-cyan-400/50 bg-cyan-900/20 backdrop-blur">
          <p className="text-cyan-300 text-sm mb-2">نحن نستعد لإطلاق النسخة الأولى</p>
          <p className="text-2xl font-bold text-white">
            ابقَ متابعاً معنا 👀
          </p>
        </div>

        {/* CTA Button - Optional email signup or social */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)' }}
          >
            العودة للرئيسية
          </a>
        </div>

        {/* Footer message */}
        <p className="text-cyan-300/50 mt-12 text-sm">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </p>
      </div>
    </div>
  );
}
