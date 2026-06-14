# 🔄 راهنمای Restart Backend

## دستورات:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

یا از اسکریپت استفاده کنید:

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

✅ اصلاح `actual_value` → `actualValue` در `missionSync.js` و `statusKpiSync.js`
✅ اصلاح `assigned_to_employeeId` → `employeeId` در `statusKpiSync.js`
✅ اصلاح `updated_at` → `updatedAt` در `missionSync.js` و `statusKpiSync.js`
✅ بهبود error handling در `products.js` برای market data
✅ بهبود error handling در `AutoTargetingView.tsx`

بعد از restart، خطاهای MissionSync باید برطرف شوند.
