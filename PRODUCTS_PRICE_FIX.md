# 🔧 رفع مشکل قیمت محصولات

## مشکلات شناسایی شده:

1. ✅ **ستون `price` وجود ندارد:** جدول `analysis_products` بدون ستون `price` ایجاد شده است
2. ✅ **داده‌های قدیمی migrate نشده:** قیمت‌های محصولات از دیتابیس قدیمی migrate نشده است

## راه حل:

### مرحله 1: اضافه کردن ستون `price` ✅
- Function `ensureProductsPriceColumn` اضافه شد
- در `initDatabase` فراخوانی می‌شود
- اگر ستون وجود نداشته باشد، اضافه می‌شود

### مرحله 2: Migrate داده‌های قدیمی

اسکریپت `fix-products-price.js` ایجاد شد که:
- ستون `price` را اضافه می‌کند (اگر وجود نداشته باشد)
- قیمت‌های محصولات را از دیتابیس قدیمی migrate می‌کند

برای اجرا:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/scripts
node fix-products-price.js
```

### مرحله 3: Restart Backend

بعد از اجرای اسکریپت، backend را restart کنید:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## بررسی:

بعد از restart، بررسی کنید:
```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db "SELECT id, name, price FROM analysis_products LIMIT 5;"
```

باید قیمت‌ها را ببینید.

## تست:

1. صفحه را refresh کنید
2. به تب "مدیریت استان‌ها" → "مدیریت محصولات" بروید
3. قیمت‌های محصولات باید نمایش داده شوند
4. یک قیمت را ویرایش کنید و ذخیره کنید
5. صفحه را refresh کنید - قیمت باید ذخیره شده باشد

