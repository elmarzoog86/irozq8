'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-purple-900 border-b border-cyan-500/30 sticky top-0 z-50 shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(45, 27, 78, 0.9) 100%)'}}>
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{border: '2px solid #00d9ff', boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'}}>
            <img src="/logo.png" alt="iRozQ8 Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            iRozQ8
          </h1>
        </div>
        <p className="text-cyan-300/70 text-sm">منصة ألعاب تفاعلية - Interactive Games Platform</p>
      </div>
    </header>
  );
}
