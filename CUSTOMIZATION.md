
# 📋 دليل التكوين والتخصيص

## 🎨 تخصيص الألوان

### في `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',      // الأزرق الأساسي
      secondary: '#1E293B',    // الرمادي الداكن
      accent: '#8B5CF6',       // البنفسجي (للتدرجات)
      success: '#10B981',      // الأخضر
      warning: '#F59E0B',      // البرتقالي
      danger: '#EF4444',       // الأحمر
    }
  }
}
```

---

## 🔤 تخصيص الخطوط

### في `tailwind.config.js`

```javascript
theme: {
  extend: {
    fontFamily: {
      arabic: ['Arial', 'Segoe UI', 'sans-serif'],
      mono: ['Courier New', 'monospace'],
    }
  }
}
```

### في `src/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

html {
  font-family: 'Cairo', sans-serif;
}
```

---

## 📐 إضافة لعبة جديدة

### الخطوة 1: أضفها في `src/data/games.ts`

```typescript
{
  id: 'new-game',
  nameAr: 'اسم اللعبة الجديدة',
  nameEn: 'New Game Name',
  descriptionAr: 'وصف اللعبة بالعربية',
  descriptionEn: 'Description in English',
  minPlayers: 2,
  maxPlayers: 100,
  image: '/images/games/new-game-image.jpg',
  isNew: true,
},
```

### الخطوة 2: أضف الصورة
- ضعها في: `public/images/games/new-game-image.jpg`

### الخطوة 3: اختبرها
```bash
npm run dev
```

---

## 🖼️ إضافة صور الألعاب

### المسار الصحيح
```
Roz/
└── public/
    └── images/
        └── games/
            ├── questions-showcase.jpg
            ├── roulette-showcase.jpg
            ├── maze-race-showcase.jpg
            ├── musical-chairs-showcase.jpg
            ├── fruits-war-showcase.jpg
            ├── logos-showcase.jpg
            ├── kalemat-showcase.jpg
            └── masaqil-showcase.jpg
```

### حجم الصور الموصى به
- **العرض:** 400px
- **الارتفاع:** 300px
- **الصيغة:** JPG أو PNG
- **الحجم:** أقل من 200KB لكل صورة

---

## 🔧 التطويرات المتقدمة

### إضافة صفحة لعبة منفصلة

#### الملف: `src/app/games/[gameId]/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { games } from '@/data/games';
import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const game = games.find(g => g.id === gameId);

  if (!game) {
    return <div className="text-center py-12">اللعبة غير موجودة</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">{game.nameAr}</h1>
        {/* محتوى اللعبة هنا */}
      </div>
    </div>
  );
}
```

---

### إضافة نظام المستخدمين

#### الملف: `src/hooks/useUser.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  score: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحميل بيانات المستخدم من localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, loading, login, logout };
}
```

---

### إضافة نظام التسجيل

#### الملف: `src/components/Auth/LoginForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function LoginForm() {
  const [playerName, setPlayerName] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      login({
        id: Math.random().toString(),
        name: playerName,
        score: 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="أدخل اسمك"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
      />
      <button
        type="submit"
        className="w-full mt-4 btn-primary"
      >
        دخول
      </button>
    </form>
  );
}
```

---

## 🔌 متغيرات البيئة

### الملف: `.env.local`

```bash
# معرف التطبيق
NEXT_PUBLIC_APP_ID=jawlah-games

# رابط API (إذا كان هناك)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# مفتاح Firebase (إذا كنت ستستخدمه)
NEXT_PUBLIC_FIREBASE_KEY=your-key-here
```

---

## 📊 إضافة Analytics

### الملف: `src/lib/analytics.ts`

```typescript
export function trackEvent(eventName: string, data?: Record<string, any>) {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, data);
  }
  
  // Console for development
  console.log(`📊 Event: ${eventName}`, data);
}

export function trackGameStart(gameId: string) {
  trackEvent('game_start', { game_id: gameId });
}

export function trackGameEnd(gameId: string, score: number) {
  trackEvent('game_end', { game_id: gameId, score });
}
```

---

## 🚀 نشر على Vercel

### الخطوة 1: إنشاء حساب
- اذهب إلى: https://vercel.com
- سجل باستخدام GitHub

### الخطوة 2: ربط المشروع
```bash
npm install -g vercel
vercel
```

### الخطوة 3: نشر
```bash
vercel deploy --prod
```

---

## 🐳 Docker (اختياري)

### الملف: `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### بناء وتشغيل:

```bash
docker build -t jawlah-games .
docker run -p 3000:3000 jawlah-games
```

---

## 📱 تحسينات PWA

### الملف: `public/manifest.json`

```json
{
  "name": "جوله - منصة ألعاب تفاعلية",
  "short_name": "جوله",
  "description": "منصة ألعاب تفاعلية للبثوث المباشرة",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## ✅ قائمة التحقق قبل النشر

- [ ] تثبيت Node.js
- [ ] تشغيل `npm install`
- [ ] تشغيل `npm run dev` والتحقق من عدم وجود أخطاء
- [ ] إضافة صور الألعاب
- [ ] اختبار جميع الألعاب
- [ ] التحقق من دعم RTL
- [ ] اختبار على الهاتف
- [ ] تشغيل `npm run build`
- [ ] النشر على Vercel

---

## 🔗 روابط مفيدة

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org
- **React:** https://react.dev
- **Vercel:** https://vercel.com

---

**آخر تحديث: 13 فبراير 2026**
