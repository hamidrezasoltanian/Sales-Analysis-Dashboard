# 🔄 راهنمای Restart Backend

## دستور Restart:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## بررسی وضعیت:

```bash
# بررسی log
tail -30 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log | grep -E "territory|Territory|Ensured|Database"

# بررسی process
ps aux | grep "node.*server.js" | grep -v grep
```

## انتظار می‌رود:

بعد از restart، باید این پیام‌ها را در log ببینید:
- `✅ Ensured center_status_history table exists`
- `✅ Ensured mission_logs table exists`
- `✅ Ensured analysis_territory_market_shares table exists` یا `✅ analysis_territory_market_shares table already exists`
- `✅ Database connected successfully`
- `🚀 Server running on port 3001`

## اگر خطا دیدید:

اگر خطای `❌ Failed to ensure analysis_territory_market_shares table` دیدید، لطفاً خطای کامل را ارسال کنید.

