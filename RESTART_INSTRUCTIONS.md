# راهنمای Restart Backend

## روش 1: استفاده از Terminal

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
```

## روش 2: استفاده از Script

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
chmod +x restart.sh
./restart.sh
```

## بررسی وضعیت

```bash
# بررسی log
tail -20 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log

# تست API
curl http://localhost:5000/api/data | head -c 200
```

## خلاصه تغییرات انجام شده:

✅ خط 339 اصلاح شد: `target: ek.target_value || ek.targetValue || 0`
✅ تمام نام ستون‌ها با schema دیتابیس هماهنگ شدند
✅ تمام queryها با try-catch محافظت شدند

