# وضعیت Backend

## ✅ Backend در حال اجراست

- **Port:** 3001
- **Status:** Running
- **Database:** Connected to shared.db

## تغییرات اعمال شده:

1. ✅ خط 376: `tms.territory_id` → `tms.territoryId` (سهم استان‌ها)
2. ✅ خط 396: `tms.territory_id` → `tms.territoryId` (سهم مراکز)
3. ✅ خط 422: `tms.territory_id` → `tms.territoryId` (territoryMarketShares)

## برای تست:

```bash
# تست API
curl http://localhost:3001/api/data | head -c 500

# بررسی log
tail -20 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log
```

## نکته:

اگر frontend روی port 5000 است، باید proxy یا configuration درست باشد تا به backend روی port 3001 متصل شود.

