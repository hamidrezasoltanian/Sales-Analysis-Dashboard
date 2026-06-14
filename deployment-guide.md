# راهنمای پیاده‌سازی اپلیکیشن Sales Dashboard روی سرور لینوکس

## 📋 پیش‌نیازها

### سیستم عامل
- Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- دسترسی root یا sudo

### نرم‌افزارهای مورد نیاز
- Node.js 18+ 
- npm یا yarn
- Git
- PM2 (برای مدیریت process)
- Nginx (برای reverse proxy)

---

## 🚀 مرحله 1: آماده‌سازی سرور

### نصب Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# بررسی نصب
node --version
npm --version
```

### نصب PM2
```bash
sudo npm install -g pm2
```

### نصب Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

---

## 📁 مرحله 2: آپلود فایل‌ها

### روش 1: Git Clone
```bash
# ایجاد دایرکتوری پروژه
sudo mkdir -p /var/www/sales-dashboard
sudo chown $USER:$USER /var/www/sales-dashboard
cd /var/www/sales-dashboard

# Clone پروژه
git clone <repository-url> .

# یا اگر فایل‌ها را از طریق SCP آپلود کرده‌اید
# sudo cp -r /path/to/uploaded/files/* /var/www/sales-dashboard/
```

### روش 2: آپلود مستقیم
```bash
# آپلود فایل‌ها از طریق SCP
scp -r Sales-Analysis-Dashboard-main/ user@server:/var/www/sales-dashboard/
scp -r backend/ user@server:/var/www/sales-dashboard/
```

---

## ⚙️ مرحله 3: تنظیم Backend

### نصب Dependencies
```bash
cd /var/www/sales-dashboard/backend
npm install --production
```

### تنظیم Environment
```bash
# ایجاد فایل .env
cat > .env << EOF
NODE_ENV=production
PORT=8000
DB_PATH=/var/www/sales-dashboard/database/sales_dashboard.db
JWT_SECRET=your-super-secret-jwt-key-here
EOF
```

### تنظیم Database
```bash
# ایجاد دایرکتوری database
mkdir -p /var/www/sales-dashboard/database

# کپی فایل database موجود یا ایجاد جدید
# اگر database موجود دارید:
cp /path/to/existing/database.db /var/www/sales-dashboard/database/sales_dashboard.db

# یا ایجاد database جدید:
cd /var/www/sales-dashboard/database
sqlite3 sales_dashboard.db < ../backend/database/schema.sql
sqlite3 sales_dashboard.db < ../backend/database/seed_data.sql
```

### تنظیم Permissions
```bash
sudo chown -R www-data:www-data /var/www/sales-dashboard
sudo chmod -R 755 /var/www/sales-dashboard
```

---

## 🖥️ مرحله 4: تنظیم Frontend

### نصب Dependencies
```bash
cd /var/www/sales-dashboard/Sales-Analysis-Dashboard-main
npm install --production
```

### Build Production
```bash
npm run build
```

### تنظیم Nginx برای Frontend
```bash
sudo cat > /etc/nginx/sites-available/sales-dashboard << EOF
server {
    listen 80;
    server_name your-domain.com;  # جایگزین با دامنه خود

    # Frontend (React App)
    location / {
        root /var/www/sales-dashboard/Sales-Analysis-Dashboard-main/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files
    location /static {
        root /var/www/sales-dashboard/Sales-Analysis-Dashboard-main/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# فعال کردن سایت
sudo ln -s /etc/nginx/sites-available/sales-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 مرحله 5: تنظیم PM2

### ایجاد فایل PM2 Configuration
```bash
cat > /var/www/sales-dashboard/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'sales-dashboard-backend',
      script: './backend/server.js',
      cwd: '/var/www/sales-dashboard',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/pm2/sales-dashboard-backend-error.log',
      out_file: '/var/log/pm2/sales-dashboard-backend-out.log',
      log_file: '/var/log/pm2/sales-dashboard-backend.log',
      time: true
    }
  ]
};
EOF
```

### شروع سرویس‌ها
```bash
cd /var/www/sales-dashboard

# ایجاد دایرکتوری log
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# شروع با PM2
pm2 start ecosystem.config.js

# ذخیره تنظیمات PM2
pm2 save
pm2 startup
```

---

## 🔒 مرحله 6: تنظیم SSL (اختیاری)

### نصب Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### دریافت SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🛡️ مرحله 7: تنظیم Firewall

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 📊 مرحله 8: مانیتورینگ و Logs

### بررسی وضعیت سرویس‌ها
```bash
# وضعیت PM2
pm2 status
pm2 logs

# وضعیت Nginx
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### تنظیم Log Rotation
```bash
sudo cat > /etc/logrotate.d/sales-dashboard << EOF
/var/log/pm2/sales-dashboard-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

---

## 🔄 مرحله 9: Backup و Maintenance

### اسکریپت Backup
```bash
cat > /var/www/sales-dashboard/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/sales-dashboard"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup Database
cp /var/www/sales-dashboard/database/sales_dashboard.db $BACKUP_DIR/database_$DATE.db

# Backup Application Files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/sales-dashboard/backend /var/www/sales-dashboard/Sales-Analysis-Dashboard-main

# حذف backup های قدیمی (بیش از 30 روز)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/sales-dashboard/backup.sh

# اضافه کردن به crontab (backup روزانه)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/sales-dashboard/backup.sh") | crontab -
```

---

## 🚀 مرحله 10: تست و راه‌اندازی

### تست سرویس‌ها
```bash
# تست Backend
curl http://localhost:8000/health

# تست Frontend
curl http://localhost/

# تست API
curl http://localhost/api/data
```

### دسترسی به اپلیکیشن
- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/api/health

---

## 🔧 دستورات مفید

### مدیریت PM2
```bash
pm2 restart sales-dashboard-backend
pm2 stop sales-dashboard-backend
pm2 delete sales-dashboard-backend
pm2 reload sales-dashboard-backend
```

### مدیریت Nginx
```bash
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t
```

### بررسی Logs
```bash
pm2 logs sales-dashboard-backend
sudo tail -f /var/log/nginx/error.log
```

### به‌روزرسانی اپلیکیشن
```bash
cd /var/www/sales-dashboard
git pull origin main
cd backend && npm install --production
cd ../Sales-Analysis-Dashboard-main && npm install --production && npm run build
pm2 restart sales-dashboard-backend
```

---

## ⚠️ نکات مهم

1. **امنیت**: حتماً JWT_SECRET قوی تنظیم کنید
2. **Database**: از backup منظم database اطمینان حاصل کنید
3. **Monitoring**: از PM2 monitoring استفاده کنید
4. **Updates**: به‌روزرسانی‌های امنیتی را پیگیری کنید
5. **Resources**: منابع سرور را مانیتور کنید

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. Logs را بررسی کنید
2. وضعیت سرویس‌ها را چک کنید
3. تنظیمات firewall و nginx را بررسی کنید
4. Database permissions را چک کنید
