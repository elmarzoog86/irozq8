# إعداد دخول Twitch - تعليمات كاملة

## 🔴 المشكلة
الخطأ يظهر لأن بيانات الاعتماد (Client ID و Client Secret) من Twitch غير مكتملة في الملف `.env.local`.

## ✅ الحل

### الخطوة 1: إنشاء تطبيق Twitch
1. اذهب إلى: https://dev.twitch.tv/console/applications
2. تسجيل الدخول بحسابك على Twitch
3. انقر على **"Create Application"** (إنشاء تطبيق)

### الخطوة 2: ملء بيانات التطبيق
- **Name**: `iRozQ8` (أو أي اسم تختاره)
- **Category**: اختر `Interactive Tool` أو `Other`
- **Accepted Terms**: وافق على الشروط
- انقر **Create**

### الخطوة 3: الحصول على Client ID و Client Secret
بعد الإنشاء:
1. سترى **Client ID** - انسخها
2. انقر على **"New Secret"** لإنشاء **Client Secret** - انسخها

### الخطوة 4: إضافة Redirect URIs
1. في صفحة التطبيق، ابحث عن **"OAuth Redirect URLs"**
2. أضف هذه الـ URLs (اضغط Add URL مرة لكل واحدة):
   - `http://localhost:3000/api/twitch/callback` (للتطوير المحلي)
   - `https://irozq8.com/api/twitch/callback` (للإنتاج - استبدل باسم نطاقك)
3. انقر **Update**

### الخطوة 5: تحديث ملف `.env.local`

افتح الملف: `c:\Users\elmar\OneDrive\Desktop\Roz\.env.local`

استبدل هذا:
```env
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_REDIRECT_URI=http://localhost:3001/api/twitch/auth?action=callback
```

بهذا (مع قيمك الفعلية):
```env
TWITCH_CLIENT_ID=أدخل Client ID هنا
TWITCH_CLIENT_SECRET=أدخل Client Secret هنا
TWITCH_REDIRECT_URI=http://localhost:3000/api/twitch/callback
```

### الخطوة 6: إعادة تشغيل السيرفر
1. توقف `npm run dev` (Ctrl+C)
2. شغل `npm run dev` مرة أخرى
3. جرب تسجيل الدخول مرة أخرى في http://localhost:3000

---

## 🔗 روابط مهمة
- Twitch Developer Console: https://dev.twitch.tv/console/applications
- Twitch OAuth Documentation: https://dev.twitch.tv/docs/authentication/oauth-2

## ⚠️ تحذيرات أمان
- **لا تشارك Client Secret** مع أحد
- **لا تضع Client Secret** في كود public على GitHub
- استخدم `.env.local` (ملف محلي) للقيم الحساسة

---

## ❓ إذا استمرت المشكلة
- تأكد من نسخ البيانات بشكل صحيح (بدون مسافات زائدة)
- تأكد من أن `http://localhost:3000/api/twitch/callback` مضافة في Redirect URIs
- امسح ذاكرة المتصفح (Clear Cache) وجرب مرة أخرى
- تحقق من console.log في المتصفح (F12) لرسالة خطأ دقيقة
