# 🚀 Quick Deploy to iRozQ8.com

**الوقت المتوقع**: 30 دقيقة فقط!

---

## ⚡ الطريقة الأسرع: Vercel

### الخطوة 1: تحضير (5 دقائق)
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل دخول (سيفتح في المتصفح)
vercel login
```

### الخطوة 2: النشر (5 دقائق)
```bash
# انتقل لمجلد المشروع
cd C:\Users\elmar\OneDrive\Desktop\Roz

# انشر!
vercel

# اتبع الخطوات:
# ✓ اختر حساب Vercel
# ✓ ربط مع Git (إن وجد)
# ✓ اختر الإعدادات الافتراضية
# ستحصل على رابط مؤقت مثل: https://roz-games.vercel.app
```

### الخطوة 3: ربط المجال (10 دقائق)
```
في لوحة تحكم Vercel:
1. اذهب إلى https://vercel.com/dashboard
2. اختر مشروعك
3. اذهب إلى Settings → Domains
4. أضف: iRozQ8.com
5. اتبع التعليمات (تحديث DNS)
```

### الخطوة 4: متغيرات البيئة (5 دقائق)
```
في Vercel Dashboard:
1. Settings → Environment Variables
2. أضف:
   - TWITCH_CLIENT_ID = (القيمة)
   - TWITCH_CLIENT_SECRET = (القيمة)
3. اختر: Production
```

### الخطوة 5: تحديث Twitch (5 دقائق)
```
1. اذهب إلى: https://dev.twitch.tv/console/apps
2. اختر تطبيقك
3. اضغط "Manage"
4. في "OAuth Redirect URLs" أضف:
   https://iRozQ8.com/api/twitch/auth?action=callback
5. احفظ "Save"
```

---

## ✅ تم!

بعد 30 دقيقة:
```
✓ الموقع يعمل على: https://iRozQ8.com
✓ الألعاب تعمل
✓ Twitch login يعمل
✓ SSL آمن
```

---

## 🔧 ماذا لو حدثت مشكلة؟

### المشكلة: "Domain not connecting"
**الحل**: انتظر 5-10 دقائق (DNS ينتشر ببطء)

### المشكلة: "Twitch login failed"
**الحل**: تأكد من:
- ✓ Client Secret صحيح
- ✓ Redirect URI محدث في Twitch Console
- ✓ متغيرات البيئة معرّفة في Vercel

### المشكلة: "500 Internal Server Error"
**الحل**: 
- تحقق من Vercel logs
- أعد deploy بـ `vercel`

---

## 📊 Dashboard URLs بعد النشر

```
الرئيسية:        https://iRozQ8.com
الألعاب:          https://iRozQ8.com/games
Streamer Login:  https://iRozQ8.com/twitch/login
Dashboard:       https://iRozQ8.com/twitch/dashboard
```

---

**اتمنى النجاح! 🎉**
