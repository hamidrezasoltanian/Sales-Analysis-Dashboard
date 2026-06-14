# 🔧 رفع مشکل Market Data

## مشکلات شناسایی شده:

1. ✅ **Query INSERT/REPLACE مشکل دارد:** باید از UPDATE/INSERT جداگانه استفاده شود
2. ✅ **territoryId type mismatch:** جدول `INTEGER` است اما `'tehran'` (string) ارسال می‌شود
3. ✅ **market_type در query:** باید از `territoryId IS NULL` برای national استفاده شود

## اصلاحات انجام شده:

### 1. `backend/routes/products.js`:
- خط 260-284: اصلاح query برای INSERT/UPDATE market data
- استفاده از UPDATE/INSERT جداگانه به جای INSERT OR REPLACE
- پیدا کردن territory ID برای تهران یا استفاده از NULL

### 2. `backend/routes/data.js`:
- خط 175-185: اضافه کردن `market_type` به query با استفاده از CASE

### 3. اسکریپت migrate:
- اسکریپت `migrate-market-data.js` ایجاد شد برای migrate داده‌های قدیمی

## برای اجرا:

### مرحله 1: Migrate داده‌های قدیمی (اختیاری):

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/scripts
node migrate-market-data.js
```

### مرحله 2: Restart Backend:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## تست:

1. صفحه را refresh کنید
2. به تب "هدف‌گذاری فروش خودکار" بروید
3. یک محصول را انتخاب کنید
4. سایز کل بازار را وارد کنید و ذخیره کنید
5. باید بدون خطا ذخیره شود

