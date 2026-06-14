# 🔧 راهنمای مرحله به مرحله رفع مشکل سهم استان‌ها

## مشکل:
- در مدیریت استان، درصد سهم استان نه نمایش داده می‌شود و نه عدد جدید ذخیره می‌شود

## مرحله 1: ایجاد جدول `analysis_territory_market_shares`

جدول باید ایجاد شود. برای این کار:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/scripts
node create-territory-market-shares-table.js
```

یا مستقیماً با sqlite3:

```bash
cd /home/hamidreza/App/sales-mission-manager/backend/data
sqlite3 shared.db "CREATE TABLE IF NOT EXISTS analysis_territory_market_shares (id INTEGER PRIMARY KEY AUTOINCREMENT, territoryId TEXT NOT NULL, product_id INTEGER NOT NULL, share_percentage REAL NOT NULL DEFAULT 0, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(territoryId, product_id));"
```

## مرحله 2: بررسی API Endpoint

API endpoint برای ذخیره سهم استان‌ها در `/api/territories/provinces` (PUT) است.

کد در `backend/routes/territories.js` خط 209-290:
- دریافت `provinces` array
- برای هر province:
  - اگر `marketShare` وجود دارد، ابتدا تمام سهم‌های قبلی را حذف می‌کند
  - سپس سهم‌های جدید را insert می‌کند

## مرحله 3: بررسی Frontend

Frontend باید:
1. داده‌های سهم استان‌ها را از `/api/data` دریافت کند
2. در صفحه مدیریت استان نمایش دهد
3. هنگام ذخیره، به `/api/territories/provinces` ارسال کند

## مرحله 4: Restart Backend

بعد از ایجاد جدول، backend را restart کنید:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## بررسی:

1. بررسی کنید که جدول ایجاد شده است:
```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db "SELECT name FROM sqlite_master WHERE type='table' AND name='analysis_territory_market_shares';"
```

2. بررسی کنید که backend در حال اجراست:
```bash
ps aux | grep "node.*server.js"
```

3. تست API:
```bash
curl http://localhost:3001/api/data | jq '.provinces[0].marketShare'
```

