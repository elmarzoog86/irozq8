import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iRozQ8 - Interactive Games Platform',
  description: 'An interactive games platform designed for live streaming and online entertainment',
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
      <body className="bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
