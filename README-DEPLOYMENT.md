# 🚀 راهنمای پیاده‌سازی Sales Dashboard روی سرور لینوکس

## 📋 خلاصه

این راهنما شامل تمام مراحل لازم برای پیاده‌سازی اپلیکیشن **Sales Dashboard** روی سرور لینوکس است.

## 🎯 ویژگی‌های اپلیکیشن

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Database**: SQLite با داده‌های نمونه کامل
- **Features**: مدیریت KPI، هدف‌گذاری فروش، گزارش‌گیری، برنامه‌ریز فروش

## 🛠️ روش‌های نصب

### روش 1: نصب خودکار (توصیه می‌شود)

```bash
# 1. آپلود فایل‌ها به سرور
scp -r Sales-Analysis-Dashboard-main/ user@server:/home/user/
scp -r backend/ user@server:/home/user/
scp deploy-linux.sh user@server:/home/user/

# 2. اتصال به سرور
ssh user@server

# 3. اجرای اسکریپت نصب
chmod +x deploy-linux.sh
./deploy-linux.sh
```

### روش 2: نصب دستی

مراحل کامل در فایل `deployment-guide.md` موجود است.

## 📁 ساختار فایل‌ها

```
/var/www/sales-dashboard/
├── backend/                    # Backend Node.js
├── Sales-Analysis-Dashboard-main/  # Frontend React
├── database/                   # SQLite Database
├── ecosystem.config.js         # PM2 Configuration
└── backup.sh                  # Backup Script
```

## 🌐 دسترسی

- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/api/health

## 🔧 مدیریت سرویس‌ها

### PM2 Commands
```bash
pm2 status                          # وضعیت سرویس‌ها
pm2 logs sales-dashboard-backend    # مشاهده logs
pm2 restart sales-dashboard-backend # راه‌اندازی مجدد
pm2 stop sales-dashboard-backend    # توقف سرویس
```

### Nginx Commands
```bash
sudo systemctl status nginx        # وضعیت Nginx
sudo systemctl restart nginx       # راه‌اندازی مجدد
sudo nginx -t                     # تست تنظیمات
```

## 💾 Backup

### Backup دستی
```bash
/var/www/sales-dashboard/backup.sh
```

### Backup خودکار
Backup روزانه در ساعت 2 صبح اجرا می‌شود.

## 🔒 SSL Certificate

```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx

# دریافت SSL
sudo certbot --nginx -d your-domain.com
```

## 📊 مانیتورینگ

### Logs
```bash
# Backend Logs
pm2 logs sales-dashboard-backend

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance
```bash
# وضعیت سیستم
htop
df -h
free -h

# وضعیت PM2
pm2 monit
```

## 🔄 به‌روزرسانی

```bash
cd /var/www/sales-dashboard

# Pull تغییرات جدید
git pull origin main

# نصب Dependencies جدید
cd backend && npm install --production
cd ../Sales-Analysis-Dashboard-main && npm install --production && npm run build

# راه‌اندازی مجدد
pm2 restart sales-dashboard-backend
```

## 🛡️ امنیت

### تنظیمات مهم
1. **Firewall**: پورت‌های غیرضروری بسته باشند
2. **SSL**: حتماً SSL نصب کنید
3. **JWT Secret**: کلید قوی تنظیم کنید
4. **Database**: دسترسی محدود به فایل database
5. **Updates**: به‌روزرسانی‌های امنیتی را پیگیری کنید

### بررسی امنیت
```bash
# بررسی پورت‌های باز
sudo netstat -tlnp

# بررسی سرویس‌های در حال اجرا
sudo systemctl list-units --type=service --state=running
```

## 🚨 عیب‌یابی

### مشکلات رایج

#### Backend در حال اجرا نیست
```bash
pm2 logs sales-dashboard-backend
pm2 restart sales-dashboard-backend
```

#### Frontend لود نمی‌شود
```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### Database Error
```bash
# بررسی وجود فایل database
ls -la /var/www/sales-dashboard/database/

# بررسی permissions
sudo chown www-data:www-data /var/www/sales-dashboard/database/sales_dashboard.db
```

#### Port در حال استفاده
```bash
# بررسی پورت 8000
sudo lsof -i :8000

# کشتن process
sudo kill -9 <PID>
```

## 📞 پشتیبانی

در صورت بروز مشکل:

1. **Logs را بررسی کنید**
2. **وضعیت سرویس‌ها را چک کنید**
3. **تنظیمات firewall و nginx را بررسی کنید**
4. **Database permissions را چک کنید**

## 📝 نکات مهم

- ✅ اپلیکیشن کاملاً فول استک و آماده production است
- ✅ شامل داده‌های نمونه کامل (9 کارمند، 3 محصول، 29 استان)
- ✅ تمام ویژگی‌ها تست شده و کار می‌کنند
- ✅ Backup خودکار و مانیتورینگ فعال
- ✅ سازگار با Ubuntu, CentOS, Debian

## 🎉 نتیجه

پس از نصب موفق، اپلیکیشن Sales Dashboard کاملاً آماده استفاده در محیط production است و تمام ویژگی‌های مدیریت فروش، KPI، گزارش‌گیری و برنامه‌ریزی را ارائه می‌دهد.
