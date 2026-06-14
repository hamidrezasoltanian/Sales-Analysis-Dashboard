# ⚡ راهنمای شروع سریع - Sales Dashboard

## 🚀 راه‌اندازی در 3 دقیقه

### گام 1: راه‌اندازی اپلیکیشن

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./start-production.sh start
```

### گام 2: دسترسی به اپلیکیشن

- **Frontend (رابط کاربری)**: http://localhost:6000
- **Backend (API)**: http://localhost:6001
- **Health Check**: http://localhost:6001/health

### گام 3: نصب Auto-Start (اختیاری)

برای راه‌اندازی خودکار با بوت سیستم:

```bash
sudo ./install-autostart.sh install
sudo systemctl start sales-dashboard
```

---

## 📋 دستورات پرکاربرد

### مدیریت سرویس

```bash
# راه‌اندازی
./start-production.sh start

# توقف
./start-production.sh stop

# ری‌استارت
./start-production.sh restart

# وضعیت
./start-production.sh status

# لاگ‌ها
./start-production.sh logs
```

### بک‌آپ و بازیابی

```bash
# بک‌آپ دیتابیس
./backup-system.sh database

# بک‌آپ کامل
./backup-system.sh full

# بازیابی
./restore-backup.sh

# آمار بک‌آپ‌ها
./backup-system.sh stats
```

---

## ⚙️ مشخصات فنی

| مورد | مقدار |
|------|-------|
| Frontend Port | 6000 |
| Backend Port | 6001 |
| Database | SQLite |
| بک‌آپ خودکار | هر 6 ساعت |
| Auto-start | با systemd |

---

## 🆘 عیب‌یابی سریع

### اگر سرویس راه‌اندازی نمی‌شود:

```bash
# بررسی لاگ‌ها
./start-production.sh logs

# restart کامل
./start-production.sh stop
sleep 2
./start-production.sh start
```

### اگر دیتابیس مشکل دارد:

```bash
# بازیابی از آخرین بک‌آپ
./restore-backup.sh
```

---

## 📚 مستندات کامل

برای جزئیات بیشتر، مراجعه کنید به:
- `DEPLOYMENT-COMPLETE.md` - مستندات کامل
- `README.md` - راهنمای پروژه

---

## ✅ چک‌لیست راه‌اندازی

- [x] نصب dependencies (خودکار)
- [x] راه‌اندازی Backend (پورت 6001)
- [x] راه‌اندازی Frontend (پورت 6000)
- [x] بک‌آپ اولیه دیتابیس
- [ ] نصب auto-start (اختیاری)
- [ ] تنظیم JWT Secret در `.env`
- [ ] تست تمام features

---

🎉 **سیستم آماده استفاده است!**

دسترسی به اپلیکیشن: **http://localhost:6000**





