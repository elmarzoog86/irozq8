import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'فوازير روز',
  description: 'منصة ألعاب تفاعلية مصممة خصيصاً للبثوث المباشرة في العالم العربي',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* No longer loading tmi.js in browser - using server-side proxy with SSE instead */}
      </head>
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans">
        {children}
      </body>
    </html>
  );
}
