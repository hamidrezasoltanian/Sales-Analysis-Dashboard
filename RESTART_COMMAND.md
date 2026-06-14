# 🔄 دستور Restart Backend

## دستورات:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

یا از اسکریپت:

```bash
bash /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/restart-backend.sh
```

## بررسی وضعیت:

```bash
ps aux | grep "node.*server.js" | grep -v grep
```

## بررسی Log:

```bash
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log
```

## تغییرات اعمال شده:

✅ اصلاح `ensureKpiScoresUpdatedAtColumn` برای اضافه کردن ستون `updated_at` بدون DEFAULT
✅ Update کردن ردیف‌های موجود با `datetime('now')`
✅ تغییر `updatedAt` به `updated_at` در `missionSync.js` و `statusKpiSync.js`

بعد از restart، باید پیام `✅ Added updated_at column to analysis_kpi_scores table` را ببینید و خطاهای MissionSync باید برطرف شوند.

