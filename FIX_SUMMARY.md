# ✅ خلاصه اصلاحات برای مشکل سهم استان‌ها

## مشکل:
در مدیریت استان، درصد سهم استان نه نمایش داده می‌شود و نه عدد جدید ذخیره می‌شود.

## علت:
جدول `analysis_territory_market_shares` ایجاد نشده است.

## راه حل:

### مرحله 1: اصلاح function ایجاد جدول
Function `ensureTerritoryMarketSharesTable` اصلاح شد تا:
- ابتدا بررسی کند که آیا جدول وجود دارد یا نه
- اگر وجود ندارد، آن را ایجاد کند
- خطاها را به صورت کامل نمایش دهد

### مرحله 2: Restart Backend
بعد از اصلاح function، backend را restart کنید:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

### مرحله 3: بررسی Log
بعد از restart، log را بررسی کنید:

```bash
tail -30 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log | grep -E "territory|Territory|Ensured"
```

باید پیام "✅ Ensured analysis_territory_market_shares table exists" را ببینید.

### مرحله 4: تست
1. صفحه را refresh کنید
2. به تب "مدیریت استان" بروید
3. سهم استان‌ها باید نمایش داده شود
4. یک عدد جدید وارد کنید و ذخیره کنید
5. صفحه را refresh کنید - عدد باید ذخیره شده باشد

## فایل‌های تغییر یافته:
- `backend/config/database.js` - اصلاح function `ensureTerritoryMarketSharesTable`

