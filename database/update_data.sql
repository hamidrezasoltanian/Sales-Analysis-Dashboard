-- =============================================
-- Sales Management Dashboard - Updated Data
-- Version: 2.0
-- Description: Updated data with all provinces and new products/personnel
-- =============================================

-- Disable foreign key constraints temporarily
PRAGMA foreign_keys = OFF;

-- Clear existing data (except essential configs)
DELETE FROM sales_targets;
DELETE FROM performance_notes;
DELETE FROM kpi_scores;
DELETE FROM employee_kpis;
DELETE FROM employees;
DELETE FROM products;
DELETE FROM market_data;
DELETE FROM territory_market_shares;
DELETE FROM territories WHERE type IN ('province', 'medical_center');

-- Insert All Provinces (31 provinces of Iran)
INSERT INTO territories (id, name, type, assigned_to_employee_id) VALUES
-- Provinces assigned to sales team
('TE', 'تهران', 'province', 1),
('ES', 'اصفهان', 'province', 2),
('FA', 'فارس', 'province', 3),
('KH', 'خراسان رضوی', 'province', 4),
('AZ', 'آذربایجان شرقی', 'province', 5),
('AL', 'البرز', 'province', 1),
('IL', 'ایلام', 'province', 2),
('BU', 'بوشهر', 'province', 3),
('CH', 'چهارمحال و بختیاری', 'province', 4),
('SK', 'سیستان و بلوچستان', 'province', 5),
('QZ', 'قزوین', 'province', 1),
('QO', 'قم', 'province', 2),
('KR', 'کردستان', 'province', 3),
('KB', 'کرمان', 'province', 4),
('KS', 'کرمانشاه', 'province', 5),
('KO', 'کهگیلویه و بویراحمد', 'province', 1),
('GO', 'گلستان', 'province', 2),
('GI', 'گیلان', 'province', 3),
('LO', 'لرستان', 'province', 4),
('MZ', 'مازندران', 'province', 5),
('MK', 'مرکزی', 'province', 1),
('HR', 'هرمزگان', 'province', 2),
('HD', 'همدان', 'province', 3),
('YZ', 'یزد', 'province', 4),
('ZA', 'زنجان', 'province', 5),
('AR', 'اردبیل', 'province', 1),
('WA', 'آذربایجان غربی', 'province', 2),
('KHN', 'خراسان شمالی', 'province', 3),
('KHS', 'خراسان جنوبی', 'province', 4),
('SM', 'سمنان', 'province', 5),
('BA', 'بندرعباس', 'province', 1);

-- Insert Medical Centers in Tehran
INSERT INTO territories (id, name, type, assigned_to_employee_id) VALUES
('mc_shariati', 'بیمارستان شریعتی', 'medical_center', 1),
('mc_emam_khomeini', 'بیمارستان امام خمینی', 'medical_center', 1),
('mc_sina', 'بیمارستان سینا', 'medical_center', 1),
('mc_parsian', 'بیمارستان پارسیان', 'medical_center', 1),
('mc_kasra', 'بیمارستان کسری', 'medical_center', 1),
('mc_rasoul', 'بیمارستان رسول اکرم', 'medical_center', 1),
('mc_tehran', 'بیمارستان تهران', 'medical_center', 1),
('mc_milad', 'بیمارستان میلاد', 'medical_center', 1);

-- Insert New Products
INSERT INTO products (name, price, description) VALUES
('ست نفروستومی', 3500000, 'ست کامل نفروستومی برای جراحی کلیه'),
('سوزن بیوپسی', 2500000, 'سوزن یکبار مصرف برای نمونه‌برداری'),
('کاتتر شریانی', 1800000, 'کاتتر برای آنژیوگرافی شریانی');

-- Insert New Personnel
INSERT INTO employees (name, title, department, target_acquisition_rate) VALUES
-- Sales Department
('ریحانه کاشی ساز', 'کارشناس فروش', 'فروش', 12.0),
('محمد حسین زرقلمی', 'کارشناس فروش', 'فروش', 11.5),
('محمد نیلی زاده', 'کارشناس فروش', 'فروش', 10.8),
('محمد سید صالحی', 'کارشناس فروش', 'فروش', 11.2),
('سارا اسلامی', 'کارشناس فروش', 'فروش', 10.5),
('سارا حسینی', 'مدیر فروش', 'فروش', 15.0),
('سارا طهماسبی', 'کارشناس بازرگانی', 'بازرگانی', 8.0),
-- Other Departments
('امیر علی دبیری', 'مسئول IT و روابط عمومی', 'IT', 5.0),
('نسرین جلالی', 'مدیر مالی', 'مالی', 3.0),
('حمیدرضا سلطانیان', 'مدیر عامل', 'مدیریت', 2.0),
('بهروز آقای', 'مسئول انبار', 'انبار', 1.0);

-- Insert Market Data for all products
INSERT INTO market_data (product_id, year, market_size, market_type) VALUES
-- ست نفروستومی
(1, 1404, 8000, 'national'),
(1, 1404, 1600, 'tehran'),
-- سوزن بیوپسی
(2, 1404, 12000, 'national'),
(2, 1404, 2400, 'tehran'),
-- کاتتر شریانی
(3, 1404, 6000, 'national'),
(3, 1404, 1200, 'tehran');

-- Insert Territory Market Shares (similar percentages for all provinces)
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) VALUES
-- ست نفروستومی - All provinces get similar share
('TE', 1, 8.5), ('ES', 1, 7.2), ('FA', 1, 6.8), ('KH', 1, 7.5), ('AZ', 1, 6.2),
('AL', 1, 3.1), ('IL', 1, 2.8), ('BU', 1, 2.5), ('CH', 1, 2.2), ('SK', 1, 2.0),
('QZ', 1, 2.8), ('QO', 1, 2.5), ('KR', 1, 2.2), ('KB', 1, 2.8), ('KS', 1, 2.5),
('KO', 1, 2.0), ('GO', 1, 2.8), ('GI', 1, 2.5), ('LO', 1, 2.2), ('MZ', 1, 2.8),
('MK', 1, 2.5), ('HR', 1, 2.2), ('HD', 1, 2.5), ('YZ', 1, 2.2), ('ZA', 1, 2.5),
('AR', 1, 2.2), ('WA', 1, 2.5), ('KHN', 1, 2.2), ('KHS', 1, 2.0), ('SM', 1, 2.2),
('BA', 1, 2.0),

-- سوزن بیوپسی - All provinces get similar share
('TE', 2, 9.2), ('ES', 2, 7.8), ('FA', 2, 7.2), ('KH', 2, 8.0), ('AZ', 2, 6.8),
('AL', 2, 3.2), ('IL', 2, 2.9), ('BU', 2, 2.6), ('CH', 2, 2.3), ('SK', 2, 2.1),
('QZ', 2, 2.9), ('QO', 2, 2.6), ('KR', 2, 2.3), ('KB', 2, 2.9), ('KS', 2, 2.6),
('KO', 2, 2.1), ('GO', 2, 2.9), ('GI', 2, 2.6), ('LO', 2, 2.3), ('MZ', 2, 2.9),
('MK', 2, 2.6), ('HR', 2, 2.3), ('HD', 2, 2.6), ('YZ', 2, 2.3), ('ZA', 2, 2.6),
('AR', 2, 2.3), ('WA', 2, 2.6), ('KHN', 2, 2.3), ('KHS', 2, 2.1), ('SM', 2, 2.3),
('BA', 2, 2.1),

-- کاتتر شریانی - All provinces get similar share
('TE', 3, 7.8), ('ES', 3, 6.5), ('FA', 3, 6.0), ('KH', 3, 6.8), ('AZ', 3, 5.8),
('AL', 3, 2.8), ('IL', 3, 2.5), ('BU', 3, 2.2), ('CH', 3, 2.0), ('SK', 3, 1.8),
('QZ', 3, 2.5), ('QO', 3, 2.2), ('KR', 3, 2.0), ('KB', 3, 2.5), ('KS', 3, 2.2),
('KO', 3, 1.8), ('GO', 3, 2.5), ('GI', 3, 2.2), ('LO', 3, 2.0), ('MZ', 3, 2.5),
('MK', 3, 2.2), ('HR', 3, 2.0), ('HD', 3, 2.2), ('YZ', 3, 2.0), ('ZA', 3, 2.2),
('AR', 3, 2.0), ('WA', 3, 2.2), ('KHN', 3, 2.0), ('KHS', 3, 1.8), ('SM', 3, 2.0),
('BA', 3, 1.8);

-- Insert Employee KPIs for sales team
INSERT INTO employee_kpis (employee_id, kpi_config_id, target_value) VALUES
-- ریحانه کاشی ساز
(1, 'sales', 85), (1, 'leads', 45), (1, 'conversion', 18),
-- محمد حسین زرقلمی
(2, 'sales', 80), (2, 'leads', 42), (2, 'conversion', 16),
-- محمد نیلی زاده
(3, 'sales', 75), (3, 'leads', 40), (3, 'conversion', 15),
-- محمد سید صالحی
(4, 'sales', 78), (4, 'leads', 41), (4, 'conversion', 16),
-- سارا اسلامی
(5, 'sales', 82), (5, 'leads', 43), (5, 'conversion', 17),
-- سارا حسینی (مدیر فروش)
(6, 'sales', 120), (6, 'leads', 60), (6, 'conversion', 25),
-- سارا طهماسبی (بازرگانی)
(7, 'sales', 50), (7, 'leads', 25), (7, 'conversion', 10);

-- Insert Sample KPI Scores
INSERT INTO kpi_scores (employee_kpi_id, period, actual_value) VALUES
-- ریحانه کاشی ساز
(1, 'خرداد 1404', 88), (2, 'خرداد 1404', 47), (3, 'خرداد 1404', 19),
-- محمد حسین زرقلمی
(4, 'خرداد 1404', 82), (5, 'خرداد 1404', 44), (6, 'خرداد 1404', 17),
-- محمد نیلی زاده
(7, 'خرداد 1404', 78), (8, 'خرداد 1404', 42), (9, 'خرداد 1404', 16),
-- محمد سید صالحی
(10, 'خرداد 1404', 80), (11, 'خرداد 1404', 43), (12, 'خرداد 1404', 17),
-- سارا اسلامی
(13, 'خرداد 1404', 85), (14, 'خرداد 1404', 45), (15, 'خرداد 1404', 18),
-- سارا حسینی (مدیر فروش)
(16, 'خرداد 1404', 125), (17, 'خرداد 1404', 62), (18, 'خرداد 1404', 26),
-- سارا طهماسبی (بازرگانی)
(19, 'خرداد 1404', 52), (20, 'خرداد 1404', 26), (21, 'خرداد 1404', 11);

-- Insert Sample Sales Targets
INSERT INTO sales_targets (employee_id, product_id, period, target_quantity, actual_quantity) VALUES
-- ریحانه کاشی ساز
(1, 1, 'خرداد 1404', 8, 9), (1, 2, 'خرداد 1404', 12, 13), (1, 3, 'خرداد 1404', 6, 7),
-- محمد حسین زرقلمی
(2, 1, 'خرداد 1404', 7, 8), (2, 2, 'خرداد 1404', 11, 12), (2, 3, 'خرداد 1404', 5, 6),
-- محمد نیلی زاده
(3, 1, 'خرداد 1404', 6, 7), (3, 2, 'خرداد 1404', 10, 11), (3, 3, 'خرداد 1404', 4, 5),
-- محمد سید صالحی
(4, 1, 'خرداد 1404', 7, 8), (4, 2, 'خرداد 1404', 11, 12), (4, 3, 'خرداد 1404', 5, 6),
-- سارا اسلامی
(5, 1, 'خرداد 1404', 8, 9), (5, 2, 'خرداد 1404', 12, 13), (5, 3, 'خرداد 1404', 6, 7),
-- سارا حسینی (مدیر فروش)
(6, 1, 'خرداد 1404', 12, 14), (6, 2, 'خرداد 1404', 18, 20), (6, 3, 'خرداد 1404', 9, 10),
-- سارا طهماسبی (بازرگانی)
(7, 1, 'خرداد 1404', 4, 5), (7, 2, 'خرداد 1404', 6, 7), (7, 3, 'خرداد 1404', 3, 4);

-- Insert Sample Performance Notes
INSERT INTO performance_notes (employee_id, period, note_text) VALUES
(1, 'خرداد 1404', 'عملکرد عالی در فروش ست نفروستومی.'),
(2, 'خرداد 1404', 'نیاز به بهبود در جذب لیدهای جدید.'),
(3, 'خرداد 1404', 'عملکرد متوسط، نیاز به تمرکز بیشتر.'),
(4, 'خرداد 1404', 'عملکرد خوب در فروش سوزن بیوپسی.'),
(5, 'خرداد 1404', 'عملکرد عالی در تمام محصولات.'),
(6, 'خرداد 1404', 'مدیریت تیم فروش به خوبی انجام شده.'),
(7, 'خرداد 1404', 'عملکرد مناسب در بخش بازرگانی.');

-- Update App Settings
UPDATE app_settings SET value = '[1404, 1405]' WHERE key = 'availableYears';
UPDATE app_settings SET value = '{"periods": ["خرداد 1404", "تیر 1404", "مرداد 1404"]}' WHERE key = 'salesConfig';
UPDATE app_settings SET value = '{"selectedPeriod": "خرداد 1404", "selectedEmployee": null}' WHERE key = 'salesPlannerState';

-- Re-enable foreign key constraints
PRAGMA foreign_keys = ON;
