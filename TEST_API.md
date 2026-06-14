# 🧪 تست API برای سهم استان‌ها

## جدول ایجاد شد ✅

از log می‌بینیم که جدول `analysis_territory_market_shares` ایجاد شده است:
- `✅ Ensured analysis_territory_market_shares table exists`

## تست API:

### 1. تست دریافت داده‌ها:

```bash
curl http://localhost:3001/api/data | jq '.provinces[0].marketShare'
```

باید یک object با product IDs و share percentages برگرداند.

### 2. تست ذخیره داده‌ها:

```bash
curl -X PUT http://localhost:3001/api/territories/provinces \
  -H "Content-Type: application/json" \
  -d '{
    "provinces": [{
      "id": "KH",
      "marketShare": {
        "1": 10.5
      }
    }]
  }'
```

باید `{"message": "Provinces updated successfully", "count": 1}` برگرداند.

### 3. بررسی در دیتابیس:

```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db "SELECT * FROM analysis_territory_market_shares LIMIT 5;"
```

## اگر API کار می‌کند:

1. صفحه را refresh کنید
2. به تب "مدیریت استان‌ها" بروید
3. سهم استان‌ها باید نمایش داده شود
4. یک عدد جدید وارد کنید و ذخیره کنید
5. صفحه را refresh کنید - عدد باید ذخیره شده باشد

## اگر هنوز مشکل دارید:

لطفاً خطای دقیق console browser را ارسال کنید.

