# 🔧 رفع مشکل `updated_at` در `analysis_kpi_scores` - نسخه 2

## مشکل:

SQLite نمی‌تواند یک ستون با `DEFAULT CURRENT_TIMESTAMP` اضافه کند.

## راه حل:

1. ستون را بدون DEFAULT اضافه کنیم
2. مقادیر موجود را با `datetime('now')` update کنیم
3. در INSERT/UPDATE از `datetime('now')` استفاده کنیم (که قبلاً انجام شده)

## تغییرات:

### `backend/config/database.js`:
- خط 121-133: اصلاح تابع `ensureKpiScoresUpdatedAtColumn`
  - اضافه کردن ستون بدون DEFAULT
  - Update کردن ردیف‌های موجود با `datetime('now')`

## برای اعمال:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

باید پیام `✅ Added updated_at column to analysis_kpi_scores table` را ببینید و خطاهای MissionSync باید برطرف شوند.

