# 🔧 راهنمای اجرای اسکریپت

## مرحله 1: اجرای اسکریپت برای اضافه کردن ستون price و migrate داده‌ها

در ترمینال اجرا کنید:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/scripts
node fix-products-price.js
```

این اسکریپت:
1. ستون `price` را به جدول `analysis_products` اضافه می‌کند (اگر وجود نداشته باشد)
2. قیمت‌های محصولات را از دیتابیس قدیمی migrate می‌کند

## مرحله 2: Restart Backend

بعد از اجرای اسکریپت، backend را restart کنید:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## مرحله 3: بررسی Log

بررسی کنید که ستون price اضافه شده است:

```bash
tail -30 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log | grep -E "price|Price|Ensured"
```

باید پیام `✅ Added price column to analysis_products table` یا `✅ Price column already exists` را ببینید.

## مرحله 4: تست

1. صفحه را refresh کنید
2. به تب "مدیریت استان‌ها" → "مدیریت محصولات" بروید
3. قیمت‌های محصولات باید نمایش داده شوند
4. یک قیمت را ویرایش کنید و ذخیره کنید
5. صفحه را refresh کنید - قیمت باید ذخیره شده باشد

## اگر خطا دیدید:

لطفاً خروجی کامل اسکریپت را ارسال کنید.

