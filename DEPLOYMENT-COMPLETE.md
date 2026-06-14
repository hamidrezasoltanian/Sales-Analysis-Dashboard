# 🚀 Sales Dashboard - سیستم دیپلویمنت کامل

## 📋 خلاصه تغییرات

این پروژه با یک سیستم کامل production-ready شامل موارد زیر تجهیز شده است:

### ✅ تغییرات پورت
- **Frontend**: پورت 6000
- **Backend**: پورت 6001
- تمام فایل‌های configuration به‌روزرسانی شدند

### ✅ سیستم بک‌آپ خودکار
- بک‌آپ خودکار هر 6 ساعت از دیتابیس
- بک‌آپ کامل هفتگی (یکشنبه‌ها)
- پاک‌سازی خودکار بک‌آپ‌های قدیمی‌تر از 30 روز
- امکان restore آسان با منوی تعاملی

### ✅ Auto-Start با Systemd
- راه‌اندازی خودکار با بوت سیستم
- Auto-restart در صورت خطا
- مدیریت آسان با systemctl

---

## 🛠️ راه‌اندازی سریع

### روش 1: راه‌اندازی دستی (توصیه می‌شود برای اولین بار)

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
./start-production.sh start
```

### روش 2: راه‌اندازی با Systemd (Auto-start)

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main
sudo ./install-autostart.sh install
sudo systemctl start sales-dashboard
```

---

## 📚 دستورات مدیریتی

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

# نمایش لاگ‌ها
./start-production.sh logs [backend|frontend|all]
```

### مدیریت با Systemd

```bash
# شروع سرویس
sudo systemctl start sales-dashboard

# توقف سرویس
sudo systemctl stop sales-dashboard

# ری‌استارت
sudo systemctl restart sales-dashboard

# وضعیت
sudo systemctl status sales-dashboard

# نمایش لاگ‌ها
sudo journalctl -u sales-dashboard -f

# غیرفعال کردن auto-start
sudo systemctl disable sales-dashboard
```

### مدیریت بک‌آپ

```bash
# بک‌آپ دیتابیس
./backup-system.sh database

# بک‌آپ کامل پروژه
./backup-system.sh full

# پاک‌سازی بک‌آپ‌های قدیمی
./backup-system.sh cleanup

# نمایش آمار بک‌آپ‌ها
./backup-system.sh stats

# انجام تمام عملیات
./backup-system.sh all

# بازیابی بک‌آپ (با منوی تعاملی)
./restore-backup.sh

# بازیابی بک‌آپ خاص
./restore-backup.sh --file /path/to/backup.gz
```

---

## 📂 ساختار پروژه

```
Sales-Analysis-Dashboard-main/
├── backend/                      # Backend API (Node.js + Express)
│   ├── server.js                # سرور اصلی (پورت 6001)
│   ├── .env                     # تنظیمات محیطی
│   ├── routes/                  # API routes
│   └── config/                  # پیکربندی‌ها
│
├── Sales-Analysis-Dashboard-main/ # Frontend (React + TypeScript)
│   ├── vite.config.ts           # پیکربندی Vite (پورت 6000)
│   ├── components/              # کامپوننت‌های React
│   └── services/                # سرویس‌های API
│
├── database/                    # دیتابیس SQLite
│   └── sales_dashboard.db      # دیتابیس اصلی
│
├── backups/                     # پوشه بک‌آپ‌ها
│   ├── database/               # بک‌آپ‌های روزانه دیتابیس
│   ├── full/                   # بک‌آپ‌های کامل هفتگی
│   └── backup_list.txt         # لیست بک‌آپ‌ها
│
├── logs/                        # فایل‌های لاگ
│   ├── backend.log             # لاگ backend
│   ├── frontend.log            # لاگ frontend
│   ├── service.log             # لاگ systemd service
│   └── backups/                # لاگ‌های بک‌آپ
│
├── start-production.sh          # اسکریپت مدیریت production
├── backup-system.sh             # سیستم بک‌آپ خودکار
├── restore-backup.sh            # اسکریپت بازیابی
├── install-autostart.sh         # نصب auto-start
├── sales-dashboard.service      # Systemd service file
│
├── backend.pid                  # PID فایل backend
└── frontend.pid                 # PID فایل frontend
```

---

## 🔧 جزئیات فنی

### پورت‌ها و Endpoints

| سرویس | پورت | آدرس | توضیحات |
|-------|------|------|---------|
| Frontend | 6000 | http://localhost:6000 | رابط کاربری |
| Backend | 6001 | http://localhost:6001 | API Server |
| Health Check | 6001 | http://localhost:6001/health | بررسی سلامت سرور |

### API Endpoints

- **Auth**: `/api/auth/*`
- **Employees**: `/api/employees/*`
- **Products**: `/api/products/*`
- **Sales**: `/api/sales/*`
- **KPIs**: `/api/kpis/*`
- **Reports**: `/api/reports/*`
- **Territories**: `/api/territories/*`
- **Settings**: `/api/settings/*`

### تنظیمات بک‌آپ

- **دوره بک‌آپ دیتابیس**: هر 6 ساعت
- **دوره بک‌آپ کامل**: هفتگی (یکشنبه‌ها ساعت 2 صبح)
- **پاک‌سازی خودکار**: روزانه ساعت 3 صبح
- **مدت نگهداری**: 30 روز
- **حداکثر تعداد بک‌آپ**: 100 فایل
- **فشرده‌سازی**: gzip

---

## 🔐 امنیت و Best Practices

### فایل‌های حساس

فایل `.env` حاوی اطلاعات حساس است:
```bash
# تغییر JWT secret (مهم!)
JWT_SECRET=your-unique-secret-key-here

# تنظیم GEMINI API Key برای AI features
GEMINI_API_KEY=your-api-key
```

### Permissions

```bash
# تنظیم permissions صحیح
chmod +x start-production.sh
chmod +x backup-system.sh
chmod +x restore-backup.sh
chmod +x install-autostart.sh
chmod 600 backend/.env
```

### Firewall (اختیاری)

```bash
# باز کردن پورت‌ها
sudo ufw allow 6000/tcp
sudo ufw allow 6001/tcp
```

---

## 📊 مانیتورینگ و لاگ‌ها

### نمایش لاگ‌های زنده

```bash
# لاگ Backend
tail -f logs/backend.log

# لاگ Frontend
tail -f logs/frontend.log

# همه لاگ‌ها
./start-production.sh logs

# لاگ‌های systemd
sudo journalctl -u sales-dashboard -f
```

### بررسی وضعیت

```bash
# بررسی سلامت Backend
curl http://localhost:6001/health

# بررسی Frontend
curl http://localhost:6000

# وضعیت کامل سیستم
./start-production.sh status
```

### آمار بک‌آپ

```bash
# نمایش آمار بک‌آپ‌ها
./backup-system.sh stats

# لیست بک‌آپ‌های موجود
ls -lh backups/database/

# حجم کل بک‌آپ‌ها
du -sh backups/
```

---

## 🆘 عیب‌یابی (Troubleshooting)

### مشکل: سرویس راه‌اندازی نمی‌شود

```bash
# بررسی لاگ‌ها
./start-production.sh logs

# بررسی پورت‌های در حال استفاده
sudo lsof -i :6000
sudo lsof -i :6001

# kill پروسه‌های قدیمی
pkill -f "node server.js"
pkill -f "vite"
```

### مشکل: خطای دیتابیس

```bash
# بررسی وجود دیتابیس
ls -lh database/sales_dashboard.db

# بازیابی از بک‌آپ
./restore-backup.sh

# بررسی integrity دیتابیس
sqlite3 database/sales_dashboard.db "PRAGMA integrity_check;"
```

### مشکل: Frontend به Backend متصل نمی‌شود

```bash
# بررسی Backend
curl http://localhost:6001/health

# بررسی تنظیمات CORS در backend/.env
cat backend/.env | grep FRONTEND_URL

# بررسی proxy در frontend
cat Sales-Analysis-Dashboard-main/vite.config.ts
```

### مشکل: بک‌آپ کار نمی‌کند

```bash
# تست دستی بک‌آپ
./backup-system.sh database

# بررسی cron jobs
crontab -l | grep sales-dashboard

# بررسی لاگ‌های بک‌آپ
cat logs/backups/backup-cron.log
```

---

## 🔄 به‌روزرسانی پروژه

```bash
# توقف سرویس‌ها
./start-production.sh stop

# ایجاد بک‌آپ قبل از به‌روزرسانی
./backup-system.sh all

# به‌روزرسانی dependencies
cd backend && npm install
cd ../Sales-Analysis-Dashboard-main && npm install

# راه‌اندازی مجدد
./start-production.sh start
```

---

## 🎯 بهینه‌سازی Performance

### Backend

```bash
# استفاده از PM2 برای مدیریت بهتر (اختیاری)
npm install -g pm2
cd backend
pm2 start server.js --name sales-backend
pm2 save
pm2 startup
```

### Frontend

```bash
# Build برای production
cd Sales-Analysis-Dashboard-main
npm run build

# سرو کردن build شده با nginx (اختیاری)
sudo apt install nginx
# کپی dist به nginx directory
```

### Database

```bash
# Vacuum دیتابیس برای بهینه‌سازی
sqlite3 database/sales_dashboard.db "VACUUM;"

# تحلیل و بهینه‌سازی
sqlite3 database/sales_dashboard.db "ANALYZE;"
```

---

## 📝 چک‌لیست دیپلویمنت

- [x] تغییر پورت‌ها (Frontend: 6000, Backend: 6001)
- [x] سیستم بک‌آپ خودکار
- [x] Auto-start با systemd
- [x] اسکریپت‌های مدیریتی
- [x] سیستم restore
- [x] لاگینگ جامع
- [x] مستندات کامل
- [ ] تنظیم JWT Secret در production
- [ ] تنظیم GEMINI API Key (در صورت نیاز)
- [ ] تست کامل تمام features
- [ ] بک‌آپ اولیه
- [ ] نصب و فعال‌سازی auto-start

---

## 🤝 پشتیبانی

برای مشکلات و سوالات:

1. بررسی لاگ‌ها: `./start-production.sh logs`
2. بررسی وضعیت: `./start-production.sh status`
3. بررسی این مستندات
4. بررسی بخش Troubleshooting

---

## 📄 لایسنس

MIT License - آزاد برای استفاده شخصی و تجاری

---

**نکته مهم**: پس از راه‌اندازی، حتماً یک بک‌آپ اولیه بگیرید:

```bash
./backup-system.sh all
```

---

**تاریخ آخرین به‌روزرسانی**: 2025-10-19

**نسخه**: 2.0.0 (Production Ready با Auto-backup و Auto-start)





