'use client';

import { useState } from 'react';

export default function ComingSoonPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');

  const content = {
    en: {
      title: 'iRozQ8',
      subtitle: 'Interactive Games Platform',
      heading: 'Coming Soon 🚀',
      description: "We're working on something amazing! A modern interactive gaming platform with an unforgettable experience. Get ready to play games in a completely new way",
      preparing: "We're preparing to launch",
      stayTuned: 'Stay Tuned 👀',
      twitch: 'Follow on Twitch',
      donate: 'Support Us',
    },
    ar: {
      title: 'iRozQ8',
      subtitle: 'منصة الألعاب التفاعلية',
      heading: 'قريباً جداً 🚀',
      description: 'نحن نعمل على شيء مذهل! منصة ألعاب تفاعلية حديثة مع تجربة لا تُنسى. استعد لتجربة الألعاب بطريقة جديدة تماماً',
      preparing: 'نحن نستعد لإطلاق النسخة الأولى',
      stayTuned: 'ابقَ متابعاً معنا 👀',
      twitch: 'تابعنا على تويتش',
      donate: 'ادعمنا',
    },
  };

  const t = content[language];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full Screen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover blur-lg"
      >
        <source src="/videos/new-roz.webm" type="video/webm" />
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-950" />
      </video>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="px-4 py-2 rounded-lg bg-yellow-500/20 border-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/30 transition-colors font-semibold"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* Content Overlay */}
      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center px-6 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                {t.title}
              </span>
            </div>
            <p className={`text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mb-4`}>
              {t.subtitle}
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.heading}
          </h1>

          <p className="text-lg md:text-xl text-yellow-200/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>

          {/* Call to Action Box */}
          <div className="p-6 rounded-lg border-2 border-yellow-400/50 bg-yellow-900/30 backdrop-blur max-w-2xl mx-auto mb-8">
            <p className="text-yellow-300 text-sm mb-2">{t.preparing}</p>
            <p className="text-2xl font-bold text-white">
              {t.stayTuned}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            {/* Twitch Button */}
            <a
              href="https://www.twitch.tv/irozq8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-yellow-400 font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-yellow-500/50"
              style={{ boxShadow: '0 0 30px rgba(217, 119, 6, 0.4)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.429v5.286h1.393V4.714h1.429v5.286h1.393V4.714h1.429v7.143c0 .947-.791 1.714-1.771 1.714h-8.571c-.98 0-1.771-.767-1.771-1.714V4.714zm-4.714 12h2.143V8.857H6.857v7.857zm3.429 0h2.143v-5.571H10.286v5.571zm3.429 0h2.143v-3.714h2.143v-1.571h-2.143v-1.143c0-.393.32-.714.714-.714h1.429V8.857c-.233-.028-.47-.043-.714-.043-1.39 0-2.571 1.134-2.571 2.571v1.714z" />
              </svg>
              {t.twitch}
            </a>

            {/* Donate Button */}
            <a
              href="https://streamlabs.com/irozq8/tip"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              style={{ boxShadow: '0 0 30px rgba(217, 119, 6, 0.4)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm3.5 9c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-7 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm3.5-6c-2.761 0-5 1.790-5 4h2c0-1.657 1.343-3 3-3s3 1.343 3 3h2c0-2.210-2.239-4-5-4z" />
              </svg>
              {t.donate}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
