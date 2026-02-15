# 🌍 iRozQ8.com - Configuration Files

## 📋 الملفات المطلوبة

### ملف 1: .env.local (للتطوير المحلي)
```env
# Twitch OAuth Configuration
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here

# Development (المحلي)
TWITCH_REDIRECT_URI=http://localhost:3001/api/twitch/auth?action=callback

# Production - اترك هذا معطل حتى تكون جاهزاً للنشر
# TWITCH_REDIRECT_URI=https://iRozQ8.com/api/twitch/auth?action=callback

NODE_ENV=development
```

**المكان**: في جذر المشروع (C:\Users\elmar\OneDrive\Desktop\Roz\.env.local)

---

### ملف 2: .env.production (للإنتاج)
```env
# Twitch OAuth Configuration
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here

# Production
TWITCH_REDIRECT_URI=https://iRozQ8.com/api/twitch/auth?action=callback

NODE_ENV=production
```

**المكان**: جذر المشروع (لن يُرفع إلى GitHub)

---

### ملف 3: vercel.json (لـ Vercel)
```json
{
  "name": "roz-games",
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "env": {
    "TWITCH_CLIENT_ID": "@twitch_client_id",
    "TWITCH_CLIENT_SECRET": "@twitch_client_secret",
    "TWITCH_REDIRECT_URI": "@twitch_redirect_uri_prod"
  },
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**المكان**: جذر المشروع

---

### ملف 4: next.config.js (محدث)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // للإنتاج
  productionBrowserSourceMaps: false,
  
  // الرؤوس الأمنية
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },

  // إعادة التوجيه
  async redirects() {
    return [
      {
        source: '/twitch',
        destination: '/twitch/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
```

---

### ملف 5: package.json (معدّل)
```json
{
  "name": "roz-games-irozq8",
  "version": "2.0.0",
  "description": "منصة الألعاب التفاعلية فوازير روز - iRozQ8.com",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.2.35",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

---

## 🚀 خطوات الإعداد النهائية

### 1. نسخ الملفات المطلوبة
```bash
# إذا كان لديك Vercel:
# أضف vercel.json

# أنشئ .env.local محلياً:
Copy-Item .env.local.example .env.local

# أنشئ .env.production للنشر:
Copy-Item .env.local.example .env.production
```

### 2. ملء بيانات Twitch
```env
# في .env.local و .env.production:
TWITCH_CLIENT_ID=abc123xyz...
TWITCH_CLIENT_SECRET=secret456...
```

### 3. اختبار محلياً
```bash
npm run dev
# اختبر على: http://localhost:3001
```

### 4. بناء للإنتاج
```bash
npm run build
npm start
# اختبر على: http://localhost:3000
```

---

## 📊 مقارنة البيئات

| الإعداد | التطوير المحلي | الإنتاج (iRozQ8.com) |
|--------|-----------------|----------------------|
| **الملف** | .env.local | Vercel Dashboard |
| **Port** | 3001 | 443 (HTTPS) |
| **Redirect URI** | http://localhost:3001/... | https://iRozQ8.com/... |
| **Database** | In-Memory | In-Memory (يمكن تحسينه) |
| **SSL** | لا | نعم (تلقائي) |
| **CDN** | لا | نعم (Vercel) |

---

## 🔐 ملفات يجب إضافتها إلى .gitignore

```
# لا تنسَ إضافة هذه الملفات:
.env.local
.env.production
.env.*.local
node_modules/
.next/
out/
build/
dist/
*.log
```

---

## ✅ قائمة التحقق النهائية

- [ ] تم إنشاء .env.local
- [ ] تم ملء Client ID و Secret
- [ ] تم اختبار محلياً بنجاح
- [ ] تم بناء المشروع: npm run build
- [ ] تم اختبار الإنتاج محلياً
- [ ] تم اختيار منصة استضافة (Vercel موصى به)
- [ ] تم نشر التطبيق
- [ ] تم ربط المجال iRozQ8.com
- [ ] تم تحديث Twitch Console
- [ ] تم اختبار Twitch login على الإنتاج
- [ ] تم التحقق من SSL 🔒

---

**الآن أنت جاهز للانطلاق! 🚀**
