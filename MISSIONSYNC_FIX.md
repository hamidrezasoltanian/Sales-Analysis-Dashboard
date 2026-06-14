# 🔧 رفع خطاهای MissionSync

## مشکلات شناسایی شده:

1. ✅ **`actual_value` → `actualValue`:** نام ستون در جدول `analysis_kpi_scores` باید `actualValue` باشد
2. ✅ **`assigned_to_employeeId` → `employeeId`:** نام ستون در جدول `analysis_territories` باید `employeeId` باشد
3. ✅ **`updated_at` → `updatedAt`:** نام ستون باید `updatedAt` باشد

## اصلاحات انجام شده:

### 1. `backend/services/missionSync.js`:
- خط 327: `actual_value` → `actualValue`
- خط 327: `updated_at` → `updatedAt`
- خط 333: `actual_value` → `actualValue`

### 2. `backend/services/statusKpiSync.js`:
- خط 120: `assigned_to_employeeId` → `employeeId`
- خط 124: `assigned_to_employeeId` → `employeeId`
- خط 219: `assigned_to_employeeId` → `employeeId`
- خط 293: `actual_value` → `actualValue`
- خط 293: `updated_at` → `updatedAt`
- خط 300: `actual_value` → `actualValue`

## برای اعمال تغییرات:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## بررسی:

```bash
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log | grep -E "MissionSync|Error|error"
```

باید خطاهای `actual_value` و `assigned_to_employeeId` دیگر نمایش داده نشوند.

