# 🔧 رفع مشکل `updated_at` در `analysis_kpi_scores`

## مشکل:

جدول `analysis_kpi_scores` ستون `updated_at` ندارد، اما کد سعی می‌کند آن را update کند.

## راه حل:

اضافه کردن تابع `ensureKpiScoresUpdatedAtColumn` که ستون `updated_at` را به جدول اضافه می‌کند (اگر وجود نداشته باشد).

## تغییرات:

### `backend/config/database.js`:
- اضافه کردن تابع `ensureKpiScoresUpdatedAtColumn`
- فراخوانی آن در `initDatabase`

### `backend/services/missionSync.js`:
- خط 327: `updatedAt` → `updated_at`

### `backend/services/statusKpiSync.js`:
- خط 293: `updatedAt` → `updated_at`

## برای اعمال:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

باید پیام `✅ Added updated_at column to analysis_kpi_scores table` را ببینید (یا `already exists` اگر قبلاً اضافه شده باشد).

