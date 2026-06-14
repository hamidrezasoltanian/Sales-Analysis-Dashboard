# 🚀 راهنمای کامل پیاده‌سازی Sales Dashboard روی سرور لینوکس

## 📦 فایل‌های آماده شده

### 1. اسکریپت‌های نصب
- **`deploy-linux.sh`** - اسکریپت خودکار نصب روی لینوکس
- **`prepare-deployment.bat`** - اسکریپت آماده‌سازی در Windows

### 2. مستندات
- **`deployment-guide.md`** - راهنمای کامل دستی
- **`README-DEPLOYMENT.md`** - خلاصه و دستورات مفید

## 🎯 روش‌های پیاده‌سازی

### روش 1: نصب خودکار (توصیه می‌شود)

#### در Windows:
```cmd
# 1. آماده‌سازی فایل‌ها
prepare-deployment.bat

# 2. آپلود فایل فشرده به سرور
scp sales-dashboard-deployment.zip user@server:/home/user/
```

#### در سرور لینوکس:
```bash
# 1. استخراج فایل‌ها
unzip sales-dashboard-deployment.zip

# 2. اجرای اسکریپت نصب
chmod +x deploy-linux.sh
./deploy-linux.sh
```

### روش 2: نصب دستی
مراحل کامل در فایل `deployment-guide.md` موجود است.

## 🏗️ معماری نصب شده

```
/var/www/sales-dashboard/
├── backend/                           # Node.js Backend
│   ├── server.js                      # سرور اصلی
│   ├── routes/                        # API Routes
│   ├── database/                      # Schema & Seed Data
│   └── .env                          # Environment Variables
├── Sales-Analysis-Dashboard-main/     # React Frontend
│   ├── dist/                         # Build Production
│   ├── components/                   # React Components
│   └── contexts/                     # State Management
├── database/                         # SQLite Database
│   └── sales_dashboard.db           # Database File
├── ecosystem.config.js              # PM2 Configuration
└── backup.sh                        # Backup Script
```

## 🌐 دسترسی‌ها

- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/api/health
- **Database**: `/var/www/sales-dashboard/database/sales_dashboard.db`

## 🔧 مدیریت سرویس‌ها

### PM2 (Backend)
```bash
pm2 status                          # وضعیت
pm2 logs sales-dashboard-backend    # Logs
pm2 restart sales-dashboard-backend # راه‌اندازی مجدد
pm2 stop sales-dashboard-backend     # توقف
pm2 monit                           # مانیتورینگ
```

### Nginx (Web Server)
```bash
sudo systemctl status nginx        # وضعیت
sudo systemctl restart nginx      # راه‌اندازی مجدد
sudo nginx -t                     # تست تنظیمات
sudo tail -f /var/log/nginx/access.log  # Access Logs
sudo tail -f /var/log/nginx/error.log   # Error Logs
```

## 💾 Backup & Maintenance

### Backup خودکار
```bash
# Backup روزانه در ساعت 2 صبح
/var/www/sales-dashboard/backup.sh

# Backup دستی
crontab -l  # مشاهده cron jobs
```

### به‌روزرسانی
```bash
cd /var/www/sales-dashboard
git pull origin main
cd backend && npm install --production
cd ../Sales-Analysis-Dashboard-main && npm install --production && npm run build
pm2 restart sales-dashboard-backend
```

## 🔒 امنیت

### SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Firewall
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 📊 ویژگی‌های اپلیکیشن

### ✅ مدیریت کارمندان
- اضافه/ویرایش/حذف کارمندان
- تخصیص KPI به کارمندان
- ثبت امتیازات عملکرد
- پروفایل کامل کارمندان

### ✅ مدیریت KPI
- تعریف انواع KPI (تحقق مثبت/منفی)
- محاسبه امتیاز نهایی بر اساس وزن
- ویرایش و حذف KPIها
- نمایش نمودارهای عملکرد

### ✅ هدف‌گذاری فروش
- هدف‌گذاری خودکار بر اساس سهم بازار
- تخصیص استان‌ها و مراکز پزشکی
- محاسبه تارگت فصلی و ماهانه
- ذخیره دستی تغییرات

### ✅ گزارش‌گیری
- داشبورد عملکرد کلی
- مقایسه کارمندان
- گزارش فروش محصولات
- جدول رتبه‌بندی

### ✅ ابزارها و تنظیمات
- برنامه‌ریز فروش (Sales Planner)
- تنظیمات KPI
- مدیریت استان‌ها و محصولات
- پشتیبان‌گیری و بازیابی داده‌ها

## 🗄️ پایگاه داده

### جداول اصلی
- `employees` - 9 کارمند
- `products` - 3 محصول
- `provinces` - 29 استان
- `kpi_configs` - تنظیمات KPI
- `employee_kpis` - تخصیص KPIها
- `kpi_scores` - امتیازات عملکرد
- `sales_targets` - اهداف فروش
- `market_data` - داده‌های بازار

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
ls -la /var/www/sales-dashboard/database/
sudo chown www-data:www-data /var/www/sales-dashboard/database/sales_dashboard.db
```

#### Port در حال استفاده
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

## 📋 چک‌لیست نصب

- [ ] Node.js 18+ نصب شده
- [ ] PM2 نصب شده
- [ ] Nginx نصب شده
- [ ] فایل‌های پروژه آپلود شده
- [ ] Database ایجاد شده
- [ ] Backend در حال اجرا
- [ ] Frontend در حال اجرا
- [ ] SSL Certificate نصب شده
- [ ] Firewall تنظیم شده
- [ ] Backup خودکار فعال شده

## 🎉 نتیجه

پس از نصب موفق، اپلیکیشن **Sales Dashboard** کاملاً آماده استفاده در محیط production است و تمام ویژگی‌های مدیریت فروش، KPI، گزارش‌گیری و برنامه‌ریزی را ارائه می‌دهد.

### 📞 پشتیبانی
در صورت بروز مشکل، مراحل عیب‌یابی را دنبال کنید یا با تیم پشتیبانی تماس بگیرید.
