'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-black to-gray-900 border-b border-yellow-600/50 sticky top-0 z-50 shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)'}}>
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{border: '2px solid #d97706', boxShadow: '0 0 20px rgba(217, 119, 6, 0.3)'}}>
            <img src="/logo.png" alt="iRozQ8 Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              iRozQ8
            </h1>
            <p className="text-yellow-400/70 text-sm">منصة ألعاب تفاعلية - Interactive Games Platform</p>
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="flex items-center gap-6">
          {/* Discord */}
          <a
            href="https://discord.com/users/m86"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-lg hover:bg-indigo-600/40 transition-all hover:shadow-lg hover:shadow-indigo-500/50"
            title="Discord Support"
          >
            <span className="text-xl">💬</span>
            <span className="text-indigo-300 font-semibold hidden sm:inline">Support</span>
          </a>

          {/* Twitch */}
          <a
            href="https://twitch.tv/irozq8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/40 transition-all hover:shadow-lg hover:shadow-yellow-500/50"
            title="Twitch Channel"
          >
            <span className="text-xl">📺</span>
            <span className="text-yellow-300 font-semibold hidden sm:inline">Twitch</span>
          </a>

          {/* PayPal */}
          <a
            href="https://paypal.me/irozq8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/40 transition-all hover:shadow-lg hover:shadow-yellow-500/50"
            title="Support on PayPal"
          >
            <span className="text-xl">💳</span>
            <span className="text-yellow-300 font-semibold hidden sm:inline">Donate</span>
          </a>
        </div>
      </div>
    </header>
  );
}
