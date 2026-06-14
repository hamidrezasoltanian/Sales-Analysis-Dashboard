#!/bin/bash

# Sales Dashboard - Linux Server Deployment Script
# این اسکریپت اپلیکیشن Sales Dashboard را روی سرور لینوکس نصب و راه‌اندازی می‌کند

set -e  # خروج در صورت بروز خطا

# رنگ‌ها برای نمایش بهتر
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# متغیرهای قابل تنظیم
APP_DIR="/var/www/sales-dashboard"
DOMAIN="your-domain.com"  # جایگزین با دامنه خود
DB_PATH="$APP_DIR/database/sales_dashboard.db"
BACKEND_PORT=8000

echo -e "${BLUE}🚀 شروع نصب Sales Dashboard روی سرور لینوکس${NC}"

# بررسی دسترسی root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ این اسکریپت نباید با root اجرا شود. از sudo استفاده کنید.${NC}"
   exit 1
fi

# بررسی سیستم عامل
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo -e "${RED}❌ سیستم عامل پشتیبانی نمی‌شود${NC}"
    exit 1
fi

echo -e "${GREEN}✅ سیستم عامل: $OS $VER${NC}"

# مرحله 1: نصب پیش‌نیازها
echo -e "${YELLOW}📦 نصب پیش‌نیازها...${NC}"

if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    sudo apt update
    sudo apt install -y curl wget git nginx sqlite3
    
    # نصب Node.js 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    sudo yum update -y
    sudo yum install -y curl wget git nginx sqlite
    
    # نصب Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
else
    echo -e "${RED}❌ سیستم عامل پشتیبانی نمی‌شود${NC}"
    exit 1
fi

# نصب PM2
sudo npm install -g pm2

echo -e "${GREEN}✅ پیش‌نیازها نصب شدند${NC}"

# مرحله 2: ایجاد دایرکتوری پروژه
echo -e "${YELLOW}📁 ایجاد دایرکتوری پروژه...${NC}"

sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR

echo -e "${GREEN}✅ دایرکتوری پروژه ایجاد شد${NC}"

# مرحله 3: کپی فایل‌های پروژه
echo -e "${YELLOW}📋 کپی فایل‌های پروژه...${NC}"

# اگر فایل‌ها در دایرکتوری فعلی هستند
if [[ -d "Sales-Analysis-Dashboard-main" ]] && [[ -d "backend" ]]; then
    cp -r Sales-Analysis-Dashboard-main $APP_DIR/
    cp -r backend $APP_DIR/
    echo -e "${GREEN}✅ فایل‌های پروژه کپی شدند${NC}"
else
    echo -e "${RED}❌ فایل‌های پروژه یافت نشدند. لطفاً مطمئن شوید که در دایرکتوری صحیح هستید.${NC}"
    echo -e "${YELLOW}💡 راهنمایی: فایل‌های Sales-Analysis-Dashboard-main و backend باید در دایرکتوری فعلی باشند${NC}"
    exit 1
fi

# مرحله 4: تنظیم Backend
echo -e "${YELLOW}⚙️ تنظیم Backend...${NC}"

cd $APP_DIR/backend

# نصب dependencies
npm install --production

# ایجاد فایل .env
cat > .env << EOF
NODE_ENV=production
PORT=$BACKEND_PORT
DB_PATH=$DB_PATH
JWT_SECRET=$(openssl rand -base64 32)
EOF

# ایجاد دایرکتوری database
mkdir -p $APP_DIR/database

# کپی database موجود یا ایجاد جدید
if [[ -f "database/sales_dashboard.db" ]]; then
    cp database/sales_dashboard.db $DB_PATH
    echo -e "${GREEN}✅ Database موجود کپی شد${NC}"
else
    # ایجاد database جدید
    sqlite3 $DB_PATH < database/schema.sql
    sqlite3 $DB_PATH < database/seed_data.sql
    echo -e "${GREEN}✅ Database جدید ایجاد شد${NC}"
fi

echo -e "${GREEN}✅ Backend تنظیم شد${NC}"

# مرحله 5: تنظیم Frontend
echo -e "${YELLOW}🖥️ تنظیم Frontend...${NC}"

cd $APP_DIR/Sales-Analysis-Dashboard-main

# نصب dependencies
npm install --production

# Build production
npm run build

echo -e "${GREEN}✅ Frontend تنظیم شد${NC}"

# مرحله 6: تنظیم Nginx
echo -e "${YELLOW}🌐 تنظیم Nginx...${NC}"

sudo cat > /etc/nginx/sites-available/sales-dashboard << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend (React App)
    location / {
        root $APP_DIR/Sales-Analysis-Dashboard-main/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
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
        root $APP_DIR/Sales-Analysis-Dashboard-main/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# فعال کردن سایت
sudo ln -sf /etc/nginx/sites-available/sales-dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# تست تنظیمات Nginx
sudo nginx -t

echo -e "${GREEN}✅ Nginx تنظیم شد${NC}"

# مرحله 7: تنظیم PM2
echo -e "${YELLOW}🔧 تنظیم PM2...${NC}"

cd $APP_DIR

# ایجاد فایل PM2 configuration
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'sales-dashboard-backend',
      script: './backend/server.js',
      cwd: '$APP_DIR',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: $BACKEND_PORT
      },
      error_file: '/var/log/pm2/sales-dashboard-backend-error.log',
      out_file: '/var/log/pm2/sales-dashboard-backend-out.log',
      log_file: '/var/log/pm2/sales-dashboard-backend.log',
      time: true
    }
  ]
};
EOF

# ایجاد دایرکتوری log
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# شروع سرویس با PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo -e "${GREEN}✅ PM2 تنظیم شد${NC}"

# مرحله 8: تنظیم Firewall
echo -e "${YELLOW}🛡️ تنظیم Firewall...${NC}"

if command -v ufw &> /dev/null; then
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    echo -e "${GREEN}✅ UFW تنظیم شد${NC}"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewalld تنظیم شد${NC}"
else
    echo -e "${YELLOW}⚠️ Firewall یافت نشد. لطفاً دستی تنظیم کنید.${NC}"
fi

# مرحله 9: تنظیم Permissions
echo -e "${YELLOW}🔐 تنظیم Permissions...${NC}"

sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

echo -e "${GREEN}✅ Permissions تنظیم شدند${NC}"

# مرحله 10: راه‌اندازی سرویس‌ها
echo -e "${YELLOW}🚀 راه‌اندازی سرویس‌ها...${NC}"

sudo systemctl enable nginx
sudo systemctl restart nginx

echo -e "${GREEN}✅ سرویس‌ها راه‌اندازی شدند${NC}"

# مرحله 11: تست نصب
echo -e "${YELLOW}🧪 تست نصب...${NC}"

sleep 5

# تست Backend
if curl -f http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend در حال اجرا${NC}"
else
    echo -e "${RED}❌ Backend در حال اجرا نیست${NC}"
fi

# تست Frontend
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend در حال اجرا${NC}"
else
    echo -e "${RED}❌ Frontend در حال اجرا نیست${NC}"
fi

# مرحله 12: ایجاد اسکریپت Backup
echo -e "${YELLOW}💾 ایجاد اسکریپت Backup...${NC}"

cat > $APP_DIR/backup.sh << 'EOF'
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

chmod +x $APP_DIR/backup.sh

# اضافه کردن به crontab (backup روزانه)
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | crontab -

echo -e "${GREEN}✅ اسکریپت Backup ایجاد شد${NC}"

# مرحله 13: نمایش اطلاعات نصب
echo -e "${BLUE}🎉 نصب با موفقیت تکمیل شد!${NC}"
echo ""
echo -e "${GREEN}📊 اطلاعات نصب:${NC}"
echo -e "   • Frontend: http://$DOMAIN"
echo -e "   • Backend API: http://$DOMAIN/api"
echo -e "   • Health Check: http://$DOMAIN/api/health"
echo -e "   • Database: $DB_PATH"
echo ""
echo -e "${GREEN}🔧 دستورات مفید:${NC}"
echo -e "   • وضعیت PM2: pm2 status"
echo -e "   • Logs PM2: pm2 logs sales-dashboard-backend"
echo -e "   • Restart Backend: pm2 restart sales-dashboard-backend"
echo -e "   • Restart Nginx: sudo systemctl restart nginx"
echo -e "   • Backup: $APP_DIR/backup.sh"
echo ""
echo -e "${YELLOW}⚠️ نکات مهم:${NC}"
echo -e "   • دامنه '$DOMAIN' را در فایل /etc/nginx/sites-available/sales-dashboard تغییر دهید"
echo -e "   • SSL Certificate نصب کنید: sudo certbot --nginx -d $DOMAIN"
echo -e "   • Database را به‌طور منظم backup کنید"
echo -e "   • Logs را مانیتور کنید"
echo ""
echo -e "${GREEN}✅ اپلیکیشن آماده استفاده است!${NC}"
