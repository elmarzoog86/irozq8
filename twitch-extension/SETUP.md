# كيفية تثبيت امتداد Twitch - فوازير روز

## 📋 المتطلبات الأساسية

- حساب Twitch Creator
- Twitch CLI مثبت
- Node.js و npm
- مفتاح OAuth Private Key

---

## 🚀 خطوات التثبيت

### 1. تسجيل الامتداد على Twitch

```bash
# تسجيل الدخول إلى Twitch CLI
twitch login

# إنشاء امتداد جديد
twitch ext create --name "فوازير روز" --type "panel"
```

### 2. الحصول على ID الامتداد

بعد التسجيل، ستحصل على:
- **Extension ID** - معرّف الامتداد الفريد
- **Private Key** - المفتاح الخاص للتوقيع

احفظهما في ملف `twitch-extension/.env.local`:

```env
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_EXT_ID=your_extension_id_here
TWITCH_PRIVATE_KEY=your_private_key_here
```

### 3. تحديث manifest.json

تحديث `manifest.json` بـ:

```json
{
  "manifest_version": "1.0",
  "version": "1.0.0",
  "name": "فوازير روز",
  "description": "منصة الألعاب التفاعلية",
  "author": "Jawlah",
  "viewerUrl": "https://your-domain.com/twitch-extension",
  "configUrl": "https://your-domain.com/twitch-extension/config",
  "requiredConfiguration": false,
  "globalConfiguration": {
    "required": false,
    "broadcastable": false,
    "globallyTransactable": false
  }
}
```

### 4. النشر على Twitch

```bash
# النشر كنسخة Private (للاختبار)
twitch ext upload --private-key path/to/private-key.pem

# النشر كنسخة Public (للجمهور)
twitch ext release --version 1.0.0
```

### 5. الاختبار المحلي

```bash
# تشغيل خادم التطوير
npm run dev

# في نافذة طرفية أخرى، تشغيل خادم الامتداد
cd twitch-extension
node server.js
```

---

## 🔗 الربط مع الموقع الرئيسي

### إضافة صفحات الامتداد

في ملف `src/app/layout.tsx` أو صفحة جديدة:

```typescript
export default function TwitchExtensionLayout() {
  return (
    <html dir="rtl">
      <head>
        <script src="https://d.ext-twitch.tv/extensions/latest.js"></script>
      </head>
      <body>
        {/* محتوى الامتداد */}
      </body>
    </html>
  );
}
```

### استخدام مكون التكامل

```typescript
import TwitchExtensionIntegration from '@/components/TwitchExtensionIntegration';

export default function GamePage() {
  return (
    <div>
      {/* محتوى اللعبة */}
      <TwitchExtensionIntegration gameId={gameId} />
    </div>
  );
}
```

---

## 🌐 نشر الامتداد

### على Heroku

```bash
# إنشاء تطبيق جديد
heroku create your-app-name

# دفع التعليمات البرمجية
git push heroku main

# تحديث manifest.json بـ URL الجديد
# تحديث الامتداد على Twitch
twitch ext update --view-url https://your-app-name.herokuapp.com/twitch-extension
```

### على Vercel

```bash
# دفع المشروع الرئيسي إلى Vercel
vercel

# تحديث Twitch Extension manifest.json
# بـ URL الجديد من Vercel
```

---

## ✅ قائمة التحقق

- [ ] تثبيت Twitch CLI
- [ ] تسجيل الدخول إلى Twitch Developer Console
- [ ] إنشاء امتداد جديد
- [ ] الحصول على Extension ID و Private Key
- [ ] تحديث manifest.json
- [ ] تشغيل الخادم محلياً
- [ ] اختبار الامتداد في OBS/Streamlabs
- [ ] نشر على Twitch

---

## 🧪 الاختبار

### 1. في OBS Studio

```
1. أضف → مصدر → متصفح
2. عنوان URL: http://localhost:3001/twitch-extension?type=viewer
3. اختبر الانضمام والعمليات
```

### 2. باستخدام Twitch CLI

```bash
# محاكاة مشاهد يكتب join
twitch ext send message "{\"type\":\"CHAT_MESSAGE\",\"text\":\"join\"}"
```

### 3. في الموقع الحي

```
1. اذهب إلى https://twitch.tv/your-channel
2. ستجد الامتداد في الشريط الجانبي
3. اختبر الوظائف الأساسية
```

---

## 📞 الدعم والتوثيق

- [Twitch Extensions Development](https://dev.twitch.tv/docs/extensions)
- [Twitch CLI](https://github.com/twitchdev/twitch-cli)
- [OAuth 2.0 Flow](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth)

---

## 🔄 التحديثات والصيانة

### تحديث الامتداد

```bash
# تحديث الإصدار في manifest.json
# ثم:
twitch ext upload --private-key path/to/private-key.pem

# إطلاق الإصدار الجديد
twitch ext release --version 1.0.1
```

### تتبع الإخطاء

```bash
# عرض سجلات الامتداد
twitch ext logs --extension-id your-ext-id --limit 100
```

---

تم! الآن امتدادك جاهز للاستخدام على Twitch! 🎉
