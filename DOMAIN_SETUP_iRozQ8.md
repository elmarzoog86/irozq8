# 🌍 Domain Setup Guide - iRozQ8.com

**تاريخ الإنشاء**: اليوم  
**المجال**: iRozQ8.com  
**الحالة**: جاهز للإعداد

---

## ✅ ما تم إعداده لك

### 1. ملف .env.local.example (محدث)
✅ تم تحديث الملف مع بيانات المجال الخاص بك

---

## 🚀 خطوات الإعداد الكاملة

### **المرحلة 1: التحضير (15 دقيقة)**

#### الخطوة 1: احصل على بيانات Twitch
```
1. اذهب إلى: https://dev.twitch.tv/console/apps
2. تسجيل دخول بحسابك
3. Create Application:
   - Name: فوازير روز
   - Category: Application Integration
   - Redirect URI: https://iRozQ8.com/api/twitch/auth?action=callback
4. انسخ:
   - Client ID
   - Client Secret
```

#### الخطوة 2: أنشئ .env.local في المشروع
```bash
# في مجلد الجذر (Roz/)
Copy-Item .env.local.example .env.local
```

#### الخطوة 3: أضف بيانات Twitch
```env
# افتح .env.local وأضف:
TWITCH_CLIENT_ID=your_client_id_from_console
TWITCH_CLIENT_SECRET=your_client_secret_from_console
TWITCH_REDIRECT_URI=http://localhost:3001/api/twitch/auth?action=callback
NODE_ENV=development
```

---

### **المرحلة 2: الاختبار المحلي (10 دقائق)**

```bash
# تأكد من تشغيل الخادم
npm run dev

# اختبر على: http://localhost:3001
# ✓ الصفحة الرئيسية تحمل
# ✓ الألعاب تظهر
# ✓ زر "دخول Twitch" يعمل
```

---

### **المرحلة 3: الاستعداد للنشر (20 دقيقة)**

#### خطوة 1: بناء المشروع
```bash
npm run build
```

#### خطوة 2: اختبر البناء محلياً
```bash
npm start
# اختبر على: http://localhost:3001
```

#### خطوة 3: تحضير ملفات الإنتاج
```bash
# تأكد من أن لديك:
✓ package.json
✓ .env.local (مع بيانات Twitch)
✓ .next/ folder (من npm run build)
✓ public/ folder
✓ src/ folder
```

---

### **المرحلة 4: الاختيار بين خيارات الاستضافة**

اختر أحد الخيارات التالية:

---

## 🔧 **خيار 1: Vercel (الأسهل - موصى به)**

### المميزات:
- ✅ مُحسّن لـ Next.js
- ✅ سهل جداً
- ✅ SSL مجاني
- ✅ CDN عالمي
- ✅ نطاق مجاني أو خاص

### الخطوات:

#### 1. تثبيت Vercel CLI
```bash
npm install -g vercel
```

#### 2. النشر
```bash
vercel
# اتبع التعليمات:
# - تسجيل دخول
# - اختر مجلد المشروع: Roz
# - اختر الإعدادات الافتراضية
```

#### 3. ربط المجال iRozQ8.com
```
في لوحة تحكم Vercel:
1. اذهب إلى Settings
2. اختر Domains
3. أضف: iRozQ8.com
4. اتبع التعليمات لـ DNS
```

#### 4. تحديث Twitch OAuth
```env
TWITCH_REDIRECT_URI=https://iRozQ8.com/api/twitch/auth?action=callback
```

#### 5. نشر المتغيرات على Vercel
```bash
vercel env pull
# سيسحب .env.local من Vercel

# أو أضف يدويا في لوحة التحكم:
# Environment Variables
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
```

---

## 🖥️ **خيار 2: خادم خاص (Linux/Windows)**

### المتطلبات:
- حساب استضافة
- Node.js مثبت
- PM2 أو نحوه (لإدارة العمليات)
- SSL Certificate

### الخطوات:

#### 1. رفع الملفات إلى الخادم
```bash
# استخدم FTP/SCP أو GitHub
# ارفع جميع الملفات ما عدا node_modules و .next

# على الخادم:
npm install
npm run build
```

#### 2. تشغيل التطبيق بـ PM2
```bash
# ثبت PM2
npm install -g pm2

# ابدأ التطبيق
pm2 start npm --name "roz-games" -- start

# شغّل دائماً
pm2 startup
pm2 save
```

#### 3. إعداد Nginx (كـ Reverse Proxy)
```nginx
server {
    listen 80;
    server_name iRozQ8.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. إضافة SSL Certificate (Let's Encrypt)
```bash
# ثبت Certbot
apt-get install certbot python3-certbot-nginx

# احصل على شهادة SSL
certbot --nginx -d iRozQ8.com
```

#### 5. تحديث بيانات Twitch على الخادم
```bash
# عدّل .env
nano .env.local

# أضف:
TWITCH_REDIRECT_URI=https://iRozQ8.com/api/twitch/auth?action=callback
NODE_ENV=production

# أعد التشغيل
pm2 restart roz-games
```

---

## 🌐 **خيار 3: Netlify**

### الخطوات:

#### 1. تثبيت Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. النشر
```bash
netlify deploy

# اتبع التعليمات:
# - تسجيل دخول
# - اختر مجلد البناء: .next
# - انتظر الانتهاء
```

#### 3. ربط المجال
```
في Netlify:
1. Site settings
2. Domain management
3. أضف iRozQ8.com
4. أضف CNAME records
```

#### 4. تحديث متغيرات البيئة
```
في Netlify:
1. Site settings
2. Build & deploy
3. Environment
4. أضف:
   - TWITCH_CLIENT_ID
   - TWITCH_CLIENT_SECRET
   - TWITCH_REDIRECT_URI=https://iRozQ8.com/api/twitch/auth?action=callback
```

---

## 🔐 **تحديث Twitch Console**

### هام جداً:
```
1. اذهب إلى: https://dev.twitch.tv/console/apps
2. اختر تطبيقك
3. اضغط "Manage"
4. في "OAuth Redirect URLs" أضف:
   https://iRozQ8.com/api/twitch/auth?action=callback
5. احفظ
```

---

## 📊 **تكوين DNS**

### إذا كنت تستخدم موفر نطاق خاص:

#### لـ Vercel:
```
اسم النطاق: iRozQ8.com
Type: NS (Name Servers)
Value: 
  - ns1.vercel.com
  - ns2.vercel.com
  - ns3.vercel.com
  - ns4.vercel.com
```

#### لـ خادم خاص:
```
اسم النطاق: iRozQ8.com
Type: A
Value: your_server_ip_address
```

#### لـ Netlify:
```
اسم النطاق: iRozQ8.com
Type: A
Value: من لوحة تحكم Netlify
```

---

## 🔗 **روابط مهمة للمجال**

بعد الإعداد الكامل:

```
الرئيسية:        https://iRozQ8.com
الألعاب:          https://iRozQ8.com/games
تسجيل دخول:     https://iRozQ8.com/twitch/login
لوحة التحكم:     https://iRozQ8.com/twitch/dashboard

روابط مباشرة للألعاب:
سؤال و جواب:     https://iRozQ8.com/games?id=questions
الروليت:          https://iRozQ8.com/games?id=roulette
حرب الفواكه:     https://iRozQ8.com/games?id=fruits-war
جولة كراسي:      https://iRozQ8.com/games?id=chairs
```

---

## 📝 **قائمة التحقق قبل النشر**

### قبل النشر:
- [ ] تم اختبار جميع الألعاب محلياً
- [ ] تم اختبار Twitch login محلياً
- [ ] تم الحصول على Client ID و Secret
- [ ] تم تحديث Twitch Console مع redirect URI الجديد
- [ ] تم اختبار البناء: `npm run build`
- [ ] تم اختبار الإنتاج محلياً: `npm start`

### بعد النشر:
- [ ] الموقع يحمل على https://iRozQ8.com
- [ ] الألعاب تعمل
- [ ] زر Twitch يعمل
- [ ] Twitch login يعمل بنجاح
- [ ] لوحة التحكم تعمل
- [ ] SSL يعمل (🔒 في المتصفح)

---

## 🚨 **مشاكل شائعة وحلولها**

### المشكلة: "Redirect URI mismatch"
**الحل:**
1. تأكد من مطابقة URI في:
   - Twitch Console
   - ملف .env
   - المجال الفعلي
2. تأكد من استخدام HTTPS في الإنتاج

### المشكلة: "المجال لا يعمل"
**الحل:**
1. تحقق من إعدادات DNS (15-48 ساعة للانتشار)
2. تحقق من SSL Certificate
3. أعد تشغيل الخادم

### المشكلة: "Twitch login لا يعمل"
**الحل:**
1. تأكد من تحديث Twitch Console
2. تأكد من Client Secret صحيح
3. تحقق من HTTPS (مطلوب في الإنتاج)

### المشكلة: "متغيرات البيئة غير معرّفة"
**الحل:**
1. تأكد من نشر .env على الخادم
2. أعد تشغيل التطبيق
3. تحقق من اسم المتغيرات بالضبط

---

## 📞 **الدعم والموارد**

### إذا احتجت إلى مساعدة:

1. **Vercel Docs**: https://vercel.com/docs
2. **Next.js Docs**: https://nextjs.org/docs
3. **Twitch OAuth Docs**: https://dev.twitch.tv/docs/authentication/oauth-2-0
4. **Nginx Proxy**: https://nginx.org/en/docs/

---

## 🎯 **الخطوات التالية الفورية**

### اليوم (مباشرة):
```
1. احصل على Twitch Client ID و Secret
2. أنشئ .env.local محلياً
3. اختبر محلياً
4. اختر منصة استضافة
```

### غداً:
```
1. ثبت منصة الاستضافة
2. انشر التطبيق
3. ربط المجال
4. اختبر على المجال الحقيقي
```

### بعد غد:
```
1. تحديث Twitch Console
2. اختبار Twitch login على المجال
3. إطلاق الخدمة
```

---

## ✨ **النتيجة النهائية**

بعد الانتهاء من كل الخطوات:

```
✅ الموقع يعمل على: https://iRozQ8.com
✅ الألعاب تعمل بسلاسة
✅ Twitch integration يعمل
✅ SSL Certificate مثبت
✅ CDN وتحسينات الأداء
✅ جاهز للبث المباشر
```

---

**اختر منصة الاستضافة المناسبة وابدأ! 🚀**

**التوصية**: استخدم **Vercel** - الأسهل والأسرع!
