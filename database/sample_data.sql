-- Add sample data to the database
PRAGMA foreign_keys = ON;

-- Insert sample employees
INSERT OR IGNORE INTO employees (id, name, title, department, target_acquisition_rate) VALUES
(1, 'احمد محمدی', 'مدیر فروش', 'فروش', 15.5),
(2, 'فاطمه احمدی', 'کارشناس فروش', 'فروش', 12.0),
(3, 'علی رضایی', 'کارشناس فروش', 'فروش', 10.5),
(4, 'مریم حسینی', 'مدیر منطقه', 'فروش', 18.0),
(5, 'حسن کریمی', 'کارشناس فروش', 'فروش', 11.5);

-- Insert sample products
INSERT OR IGNORE INTO products (id, name, price, description) VALUES
(1, 'سوزن بیوپسی', 2500000, 'سوزن بیوپسی برای نمونه‌برداری'),
(2, 'کاتتر قلبی', 1500000, 'کاتتر برای آنژیوگرافی'),
(3, 'استنت کرونری', 8000000, 'استنت برای باز کردن عروق'),
(4, 'بالون آنژیوپلاستی', 3000000, 'بالون برای باز کردن عروق'),
(5, 'پیس میکر', 25000000, 'دستگاه تنظیم ضربان قلب');

-- Insert sample territories (provinces)
INSERT OR IGNORE INTO territories (id, name, type, assigned_to_employee_id) VALUES
('FA', 'فارس', 'province', 1),
('TE', 'تهران', 'province', 2),
('IS', 'اصفهان', 'province', 3),
('KH', 'خراسان رضوی', 'province', 4),
('AZ', 'آذربایجان شرقی', 'province', 5);

-- Insert sample medical centers
INSERT OR IGNORE INTO territories (id, name, type, assigned_to_employee_id) VALUES
('mc_001', 'بیمارستان شریعتی', 'medical_center', 1),
('mc_002', 'بیمارستان امام خمینی', 'medical_center', 2),
('mc_003', 'بیمارستان سینا', 'medical_center', 3),
('mc_004', 'بیمارستان پارسیان', 'medical_center', 4),
('mc_005', 'بیمارستان کسری', 'medical_center', 5);

-- Insert sample employee KPIs
INSERT OR IGNORE INTO employee_kpis (employee_id, kpi_config_id, target_value) VALUES
(1, 'sales', 100),
(1, 'leads', 50),
(2, 'sales', 80),
(2, 'leads', 40),
(3, 'sales', 70),
(3, 'leads', 35),
(4, 'sales', 120),
(4, 'leads', 60),
(5, 'sales', 90),
(5, 'leads', 45);

-- Insert sample KPI scores
INSERT OR IGNORE INTO kpi_scores (employee_kpi_id, period, actual_value) VALUES
(1, 'خرداد 1404', 95),
(1, 'تیر 1404', 102),
(2, 'خرداد 1404', 45),
(2, 'تیر 1404', 48),
(3, 'خرداد 1404', 75),
(3, 'تیر 1404', 78),
(4, 'خرداد 1404', 115),
(4, 'تیر 1404', 125),
(5, 'خرداد 1404', 85),
(5, 'تیر 1404', 92);

-- Insert sample sales targets
INSERT OR IGNORE INTO sales_targets (employee_id, product_id, period, target_quantity, actual_quantity) VALUES
(1, 1, 'خرداد 1404', 10, 12),
(1, 2, 'خرداد 1404', 8, 9),
(2, 1, 'خرداد 1404', 8, 7),
(2, 3, 'خرداد 1404', 5, 6),
(3, 2, 'خرداد 1404', 6, 5),
(3, 4, 'خرداد 1404', 4, 5),
(4, 1, 'خرداد 1404', 12, 14),
(4, 5, 'خرداد 1404', 3, 4),
(5, 3, 'خرداد 1404', 7, 8),
(5, 4, 'خرداد 1404', 5, 6);

-- Insert sample performance notes
INSERT OR IGNORE INTO performance_notes (employee_id, period, note_text) VALUES
(1, 'خرداد 1404', 'عملکرد عالی در فروش محصولات جدید'),
(2, 'خرداد 1404', 'نیاز به بهبود در ارتباط با مشتریان'),
(3, 'خرداد 1404', 'پیشرفت خوب در مهارت‌های فروش'),
(4, 'خرداد 1404', 'مدیریت تیم بسیار موفق'),
(5, 'خرداد 1404', 'نیاز به آموزش بیشتر در محصولات پیچیده');

-- Insert sample market data
INSERT OR IGNORE INTO market_data (product_id, year, market_size, market_type) VALUES
(1, 1404, 1000, 'national'),
(1, 1404, 200, 'tehran'),
(2, 1404, 800, 'national'),
(2, 1404, 150, 'tehran'),
(3, 1404, 500, 'national'),
(3, 1404, 100, 'tehran'),
(4, 1404, 600, 'national'),
(4, 1404, 120, 'tehran'),
(5, 1404, 200, 'national'),
(5, 1404, 50, 'tehran');

-- Insert sample territory market shares
INSERT OR IGNORE INTO territory_market_shares (territory_id, product_id, share_percentage) VALUES
('FA', 1, 12.5),
('FA', 2, 10.0),
('TE', 1, 25.0),
('TE', 2, 20.0),
('IS', 1, 8.5),
('IS', 2, 7.0),
('KH', 1, 15.0),
('KH', 2, 12.0),
('AZ', 1, 9.0),
('AZ', 2, 8.0);
