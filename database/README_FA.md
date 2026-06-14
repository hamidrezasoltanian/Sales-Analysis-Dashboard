# Sales Management Dashboard - Database Package

## 📁 فایل‌های دیتابیس

این پکیج شامل تمام فایل‌های لازم برای راه‌اندازی دیتابیس داشبورد مدیریت فروش است:

### 🗂️ ساختار فایل‌ها

```
database/
├── schema.sql              # Schema اصلی دیتابیس
├── seed_data.sql           # داده‌های نمونه (برای تست)
├── migrations.sql          # Migration scripts
├── utilities.sql           # Views و Functions
├── setup.sql              # اسکریپت راه‌اندازی کامل (با داده‌های نمونه)
├── setup_production.sql    # اسکریپت راه‌اندازی Production (بدون داده‌های نمونه)
├── cleanup_sample_data.sql # پاک کردن داده‌های نمونه
├── README.md              # مستندات کامل
└── README_FA.md           # مستندات فارسی
```

## 🚀 راه‌اندازی سریع

### 1. نصب SQLite
```bash
# Windows
winget install SQLite.SQLite

# macOS
brew install sqlite

# Linux
sudo apt-get install sqlite3
```

### 2. ایجاد دیتابیس

#### برای تست و توسعه (با داده‌های نمونه):
```bash
sqlite3 sales_dashboard.db < setup.sql
```

#### برای Production (بدون داده‌های نمونه):
```bash
sqlite3 sales_dashboard.db < setup_production.sql
```

#### مرحله به مرحله:
```bash
sqlite3 sales_dashboard.db < schema.sql
sqlite3 sales_dashboard.db < seed_data.sql  # فقط برای تست
sqlite3 sales_dashboard.db < migrations.sql
sqlite3 sales_dashboard.db < utilities.sql
```

#### پاک کردن داده‌های نمونه (قبل از Production):
```bash
sqlite3 sales_dashboard.db < cleanup_sample_data.sql
```

### 3. بررسی نصب
```bash
sqlite3 sales_dashboard.db
.tables
.quit
```

## 📊 ویژگی‌های دیتابیس

### ✅ موجودیت‌های اصلی
- **کارمندان**: مدیریت اطلاعات کارمندان
- **محصولات**: کاتالوگ محصولات
- **مناطق**: استان‌ها و مراکز درمانی
- **KPI ها**: شاخص‌های عملکرد
- **اهداف فروش**: هدف‌گذاری و پیگیری

### 📊 داده‌های نمونه (فقط برای تست):
- 6 کارمند نمونه (مدیر، فروش، پشتیبانی)
- 5 محصول نمونه (سوزن بیوپسی، کیت تشخیصی، دستگاه آنالیزور، ...)
- 30 استان + 10 مرکز درمانی تهران
- KPI های مختلف (فروش، سرنخ، تبدیل، جریمه)
- داده‌های نمونه عملکرد و فروش

**⚠️ نکته مهم**: داده‌های نمونه فقط برای تست هستند و باید قبل از Production پاک شوند!

### ✅ ویژگی‌های پیشرفته
- **مدیریت کاربران**: سیستم احراز هویت
- **اعلان‌ها**: سیستم اطلاع‌رسانی
- **فایل‌ها**: مدیریت فایل‌ها
- **گزارش‌گیری**: سیستم گزارش‌گیری پیشرفته
- **Workflow**: مدیریت فرآیندها
- **API**: مدیریت کلیدهای API
- **Backup**: سیستم پشتیبان‌گیری

### ✅ بهینه‌سازی عملکرد
- **Indexes**: بهینه‌سازی کوئری‌ها
- **Views**: نمایش‌های محاسباتی
- **Triggers**: اعتبارسنجی خودکار
- **Constraints**: محدودیت‌های داده

## 🔧 تنظیمات پیشرفته

### Environment Variables
```bash
# تنظیم متغیرهای محیطی
export DATABASE_URL="sqlite:///path/to/sales_dashboard.db"
export API_KEY="your-gemini-api-key"
export JWT_SECRET="your-jwt-secret"
```

### Connection String Examples
```javascript
// SQLite
const db = new Database('sales_dashboard.db');

// PostgreSQL (for production)
const db = new Database('postgresql://user:pass@localhost/sales_dashboard');

// MySQL (for production)
const db = new Database('mysql://user:pass@localhost/sales_dashboard');
```

## 📈 نمونه کوئری‌ها

### عملکرد کارمندان
```sql
-- عملکرد کارمندان در یک دوره
SELECT 
    e.name,
    e.department,
    AVG(CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value > 0
        THEN (ks.actual_value * 100.0 / ek.target_value)
    END) as performance_percentage
FROM employees e
JOIN employee_kpis ek ON e.id = ek.employee_id
JOIN kpi_scores ks ON ek.id = ks.employee_kpi_id
WHERE ks.period = 'خرداد 1404'
GROUP BY e.id, e.name, e.department;
```

### گزارش فروش
```sql
-- گزارش فروش بر اساس محصول
SELECT 
    p.name as product_name,
    SUM(st.target_quantity) as total_targets,
    SUM(st.actual_quantity) as total_actuals,
    ROUND(AVG(CASE 
        WHEN st.target_quantity > 0 
        THEN (st.actual_quantity * 100.0 / st.target_quantity)
    END), 2) as achievement_percentage
FROM sales_targets st
JOIN products p ON st.product_id = p.id
WHERE st.period = 'خرداد 1404'
GROUP BY p.id, p.name;
```

## 🔒 امنیت

### User Management
```sql
-- ایجاد کاربر جدید
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES ('admin', 'admin@company.com', 'hashed_password', 'مدیر', 'سیستم', 'admin');

-- تنظیم مجوزها
INSERT INTO user_employees (user_id, employee_id)
VALUES (1, 1);
```

### API Security
```sql
-- ایجاد کلید API
INSERT INTO api_keys (key_name, key_value, permissions, created_by)
VALUES ('mobile_app', 'api_key_here', '{"read": true, "write": false}', 1);
```

## 📊 مانیتورینگ

### System Statistics
```sql
-- آمار کلی سیستم
SELECT * FROM system_statistics;

-- روند عملکرد
SELECT * FROM performance_trends
ORDER BY period DESC
LIMIT 12;
```

### Data Integrity
```sql
-- بررسی رکوردهای یتیم
SELECT * FROM orphaned_records;

-- آمار جداول
SELECT * FROM data_export_summary;
```

## 🔄 Migration Management

### اعمال Migration جدید
```sql
-- بررسی وضعیت Migration ها
SELECT * FROM migration_status;

-- اعمال Migration جدید
INSERT INTO migrations (version, description, checksum)
VALUES ('009', 'New feature description', 'checksum_hash');
```

## 🚨 Troubleshooting

### مشکلات رایج

#### 1. خطای Foreign Key
```sql
-- بررسی محدودیت‌های Foreign Key
PRAGMA foreign_key_check;

-- غیرفعال کردن موقت
PRAGMA foreign_keys = OFF;
```

#### 2. مشکل Performance
```sql
-- بررسی Index ها
.indices

-- تحلیل کوئری
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE department = 'فروش';
```

#### 3. مشکل Data Integrity
```sql
-- بررسی رکوردهای یتیم
SELECT * FROM orphaned_records;

-- پاکسازی داده‌های نامعتبر
DELETE FROM kpi_scores WHERE employee_kpi_id NOT IN (SELECT id FROM employee_kpis);
```

## 📚 منابع بیشتر

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Database Design Best Practices](https://www.sqlite.org/optoverview.html)
- [Performance Tuning Guide](https://www.sqlite.org/queryplanner.html)

## 🤝 مشارکت

برای بهبود این دیتابیس:
1. Issues جدید را گزارش دهید
2. Pull Request ارسال کنید
3. مستندات را بهبود دهید

---

**نکته**: این دیتابیس برای استفاده در محیط Production طراحی شده و شامل تمام ویژگی‌های امنیتی و بهینه‌سازی لازم است.
