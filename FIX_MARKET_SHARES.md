# 🔧 رفع مشکل سهم استان‌ها

## مشکلات شناسایی شده:

1. ✅ **خطای `toLocaleString`:** `product.price` ممکن است `null` باشد - اصلاح شد
2. ⚠️ **داده‌های قبلی نمایش داده نمی‌شود:** داده‌های قدیمی در دیتابیس قدیمی وجود دارد اما migrate نشده است

## راه حل:

### مرحله 1: اصلاح خطای `toLocaleString` ✅
- خط 126 از `ManagementView.tsx` اصلاح شد
- حالا `(product.price || 0).toLocaleString('fa-IR')` استفاده می‌شود

### مرحله 2: Migrate داده‌های قدیمی

اسکریپت `migrate-territory-market-shares.js` ایجاد شد که:
- دیتابیس قدیمی را بررسی می‌کند
- داده‌های `territory_market_shares` را پیدا می‌کند
- آن‌ها را به `analysis_territory_market_shares` منتقل می‌کند

برای اجرا:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/scripts
node migrate-territory-market-shares.js
```

### مرحله 3: بررسی داده‌ها

بعد از migrate، بررسی کنید:
```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db "SELECT COUNT(*) FROM analysis_territory_market_shares;"
```

## اگر داده‌ها در دیتابیس قدیمی نیست:

اگر داده‌ها در دیتابیس قدیمی نیست، ممکن است:
1. داده‌ها در یک فایل JSON یا Excel ذخیره شده باشند
2. داده‌ها در یک جدول دیگر با نام متفاوت باشند
3. داده‌ها به صورت hardcoded در frontend باشند

لطفاً بررسی کنید و بگویید داده‌های قدیمی کجا هستند.

