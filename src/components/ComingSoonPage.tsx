'use client';

export default function ComingSoonPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full Screen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/rozq8_3.webm" type="video/webm" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      </video>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                iRozQ8
              </span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300 mb-4">
              Interactive Games Platform
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Coming Soon 🚀
          </h1>

          <p className="text-lg md:text-xl text-cyan-200/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            We&apos;re working on something amazing! A modern interactive gaming platform with an unforgettable experience.
            Get ready to play games in a completely new way.
          </p>

          {/* Call to Action */}
          <div className="p-6 rounded-lg border-2 border-cyan-400/50 bg-cyan-900/30 backdrop-blur max-w-2xl mx-auto">
            <p className="text-cyan-300 text-sm mb-2">We&apos;re preparing to launch</p>
            <p className="text-2xl font-bold text-white">
              Stay Tuned 👀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
