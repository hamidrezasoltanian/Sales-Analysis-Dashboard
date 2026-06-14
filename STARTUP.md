# 🚀 راهنمای راه‌اندازی خودکار Sales Dashboard

این راهنما به شما کمک می‌کند تا داشبورد فروش را به صورت دائمی و خودکار راه‌اندازی کنید.

---

## 📋 فهرست مطالب

1. [راه‌اندازی دستی](#-روش-۱-استفاده-از-اسکریپتهای-ساده)
2. [راه‌اندازی خودکار با Desktop Autostart](#-روش-۲-راه‌اندازی-خودکار-با-desktop-autostart-توصیه-میشود)
3. [راه‌اندازی با Systemd](#-روش-۳-راه‌اندازی-خودکار-با-systemd-نیاز-به-sudo)
4. [آدرس‌های دسترسی](#-آدرسهای-دسترسی)
5. [مدیریت سرویس‌ها](#-مدیریت-سرویسها)
6. [عیب‌یابی](#-عیبیابی)

---

## 🎯 روش ۱: استفاده از اسکریپت‌های ساده

### راه‌اندازی:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./start-all.sh
```

### بررسی وضعیت:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./status.sh
```

### توقف سرویس‌ها:
```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./stop-all.sh
```

---

## ✅ روش ۲: راه‌اندازی خودکار با Desktop Autostart (توصیه می‌شود)

این روش **بدون نیاز به sudo** کار می‌کند و بعد از login خودکار اجرا می‌شود.

### نصب (قبلاً انجام شده است):
```bash
# فایل autostart قبلاً در این مسیر ایجاد شده است:
# ~/.config/autostart/sales-dashboard.desktop
```

### بررسی نصب:
```bash
ls -la ~/.config/autostart/sales-dashboard.desktop
```

### فعال‌سازی دستی (اگر نیاز باشد):
```bash
mkdir -p ~/.config/autostart
cp /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/sales-dashboard.desktop ~/.config/autostart/
chmod +x ~/.config/autostart/sales-dashboard.desktop
```

### حذف از Autostart:
```bash
rm ~/.config/autostart/sales-dashboard.desktop
```

**✅ با این روش، اپلیکیشن بعد از هر بار راه‌اندازی سیستم، خودکار اجرا می‌شود!**

---

## 🔧 روش ۳: راه‌اندازی خودکار با Systemd (نیاز به sudo)

این روش برای سرورها و استفاده حرفه‌ای توصیه می‌شود.

### نصب سرویس:
```bash
sudo cp /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/sales-dashboard.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable sales-dashboard
sudo systemctl start sales-dashboard
```

### مدیریت سرویس:
```bash
# شروع سرویس
sudo systemctl start sales-dashboard

# توقف سرویس
sudo systemctl stop sales-dashboard

# ری‌استارت سرویس
sudo systemctl restart sales-dashboard

# وضعیت سرویس
sudo systemctl status sales-dashboard

# غیرفعال کردن از autostart
sudo systemctl disable sales-dashboard

# لاگ‌های سرویس
sudo journalctl -u sales-dashboard -f
```

---

## 🌐 آدرس‌های دسترسی

| سرویس | آدرس محلی | آدرس شبکه |
|-------|-----------|-----------|
| **Backend API** | http://localhost:6000 | http://192.168.4.29:6000 |
| **Frontend UI** | http://localhost:6001 | http://192.168.4.29:6001 |
| **Health Check** | http://localhost:6000/health | http://192.168.4.29:6000/health |

---

## 📊 مدیریت سرویس‌ها

### اسکریپت‌های موجود:

| اسکریپت | توضیحات |
|---------|----------|
| `start-all.sh` | راه‌اندازی Backend و Frontend |
| `stop-all.sh` | توقف تمام سرویس‌ها |
| `status.sh` | نمایش وضعیت سرویس‌ها |

### مشاهده لاگ‌ها:

```bash
# لاگ Backend
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/logs/backend.log

# لاگ Frontend
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/logs/frontend.log

# هر دو لاگ همزمان
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/logs/*.log
```

### بررسی Process‌ها:

```bash
# بررسی process‌های در حال اجرا
ps aux | grep -E "node.*server|vite.*6001" | grep -v grep

# بررسی پورت‌ها
ss -tuln | grep -E '6000|6001'

# بررسی PID‌ها
cat /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.pid
cat /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/frontend.pid
```

---

## 🛠️ عیب‌یابی

### مشکل ۱: سرویس‌ها راه‌اندازی نمی‌شوند

```bash
# 1. توقف کامل سرویس‌ها
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./stop-all.sh

# 2. بررسی پورت‌ها
ss -tuln | grep -E '6000|6001'

# 3. kill کردن process‌های قدیمی
pkill -f "node.*server"
pkill -f "vite.*6001"

# 4. راه‌اندازی مجدد
./start-all.sh
```

### مشکل ۲: پورت‌ها قبلاً در حال استفاده هستند

```bash
# پیدا کردن و kill کردن process روی پورت 6000
fuser -k 6000/tcp

# پیدا کردن و kill کردن process روی پورت 6001
fuser -k 6001/tcp

# راه‌اندازی مجدد
./start-all.sh
```

### مشکل ۳: Frontend به Backend متصل نمی‌شود

```bash
# 1. بررسی Backend
curl http://localhost:6000/health

# 2. بررسی لاگ Backend
tail -f logs/backend.log

# 3. Restart کردن سرویس‌ها
./stop-all.sh && ./start-all.sh
```

### مشکل ۴: Autostart کار نمی‌کند

```bash
# 1. بررسی فایل autostart
cat ~/.config/autostart/sales-dashboard.desktop

# 2. اطمینان از executable بودن
chmod +x ~/.config/autostart/sales-dashboard.desktop

# 3. تست دستی اسکریپت
/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/start-all.sh
```

---

## 🔑 فعال‌سازی هوش مصنوعی (AI)

برای فعال‌سازی قابلیت‌های AI، کلید API Google Gemini را وارد کنید:

1. فایل `start-all.sh` را باز کنید:
```bash
nano /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/start-all.sh
```

2. این خط را پیدا کنید:
```bash
nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
```

3. به این شکل تغییر دهید:
```bash
API_KEY=YOUR_GEMINI_API_KEY_HERE nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
```

4. ذخیره و خروج کنید (Ctrl+X, Y, Enter)

5. سرویس‌ها را restart کنید:
```bash
./stop-all.sh && ./start-all.sh
```

---

## 📝 نکات مهم

1. ✅ **Backend** روی پورت **6000** اجرا می‌شود
2. ✅ **Frontend** روی پورت **6001** اجرا می‌شود
3. ✅ دیتابیس SQLite در `backend/sales.db` ذخیره می‌شود
4. ✅ لاگ‌ها در پوشه `logs/` ذخیره می‌شوند
5. ✅ PID فایل‌ها در `backend.pid` و `frontend.pid` ذخیره می‌شوند
6. ✅ اپلیکیشن به صورت خودکار با راه‌اندازی سیستم اجرا می‌شود

---

## 📞 پشتیبانی

برای مشکلات و سوالات:

1. **لاگ‌ها را بررسی کنید**:
   ```bash
   tail -f logs/backend.log
   tail -f logs/frontend.log
   ```

2. **وضعیت سرویس‌ها را چک کنید**:
   ```bash
   ./status.sh
   ```

3. **اسکریپت‌های موجود**:
   - `start-all.sh` - راه‌اندازی
   - `stop-all.sh` - توقف
   - `status.sh` - وضعیت
   - `sales-dashboard.service` - systemd service

---

## ✨ ویژگی‌های اپلیکیشن

- ✅ مدیریت کارمندان و KPIها
- ✅ هدف‌گذاری فروش
- ✅ گزارش‌گیری و تحلیل
- ✅ نمودارها و چارت‌ها (recharts)
- ✅ مدیریت استان‌ها و محصولات
- ✅ داشبورد عملکرد
- ✅ سیستم احراز هویت
- ✅ تم‌های مختلف (Default, Gray, Blue)
- ✅ طراحی واکنش‌گرا (Responsive)
- ✅ دیتابیس SQLite (داده‌ها دائمی هستند)

---

**✅ اپلیکیشن شما آماده استفاده است! 🎉**

