-- =============================================
-- Sales Management Dashboard - Initial Seed Data
-- Version: 1.0
-- Description: Initial data for testing and development
-- =============================================

-- =============================================
-- 1. KPI CONFIGURATIONS
-- =============================================

INSERT INTO kpi_configs (id, name, max_points, formula, description) VALUES
('sales', 'فروش', 40, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف فروش'),
('leads', 'سرنخ', 20, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف سرنخ‌یابی'),
('procurement_error', 'خطای تدارکات', -2, 'direct_penalty', 'جریمه مستقیم برای خطاهای تدارکاتی'),
('dissatisfaction_error', 'نارضایتی بی‌پاسخ', -2, 'direct_penalty', 'جریمه مستقیم برای عدم پاسخ به نارضایتی‌ها');

-- =============================================
-- 2. EMPLOYEES
-- =============================================

INSERT INTO employees (id, name, title, department, target_acquisition_rate) VALUES
(1, 'حمیدرضا سلطانیان', 'مدیر عامل', 'مدیریت', 10.0),
(2, 'سارا حسینی', 'مدیر فروش', 'فروش', 10.0),
(3, 'امیر علی دبیری', 'مسئول امور داخلی و IT', 'پشتیبانی', 10.0),
(4, 'فاطمه احمدی', 'کارشناس فروش', 'فروش', 8.5),
(5, 'محمد رضایی', 'کارشناس فروش', 'فروش', 9.0),
(6, 'زهرا کریمی', 'کارشناس بازاریابی', 'بازاریابی', 7.5);

-- =============================================
-- 3. PRODUCTS
-- =============================================

INSERT INTO products (id, name, price, description) VALUES
(1, 'سوزن بیوپسی', 1200000, 'سوزن مخصوص نمونه‌برداری از بافت'),
(2, 'کیت تشخیصی', 750000, 'کیت کامل تشخیص بیماری‌ها'),
(3, 'دستگاه آنالیزور', 25000000, 'دستگاه پیشرفته آنالیز نمونه‌ها'),
(4, 'میکروسکوپ دیجیتال', 15000000, 'میکروسکوپ با قابلیت تصویربرداری دیجیتال'),
(5, 'سانتریفیوژ', 8000000, 'دستگاه جداسازی اجزای خون');

-- =============================================
-- 4. TERRITORIES (Provinces)
-- =============================================

INSERT INTO territories (id, name, type, assigned_to_employee_id) VALUES
-- Major provinces assigned to sales team
('KR', 'خراسان رضوی', 'province', 2),
('ES', 'اصفهان', 'province', 4),
('FA', 'فارس', 'province', 5),
('KZ', 'خوزستان', 'province', 4),
('AE', 'آذربایجان شرقی', 'province', 5),
('MN', 'مازندران', 'province', 2),
('AW', 'آذربایجان غربی', 'province', 4),
('KE', 'کرمان', 'province', 5),
('SB', 'سیستان و بلوچستان', 'province', 2),
('AL', 'البرز', 'province', 4),
('GI', 'گیلان', 'province', 5),
('BK', 'کرمانشاه', 'province', 2),
('GO', 'گلستان', 'province', 4),
('HG', 'هرمزگان', 'province', 5),
('LO', 'لرستان', 'province', 2),
('HD', 'همدان', 'province', 4),
('KD', 'کردستان', 'province', 5),
('MK', 'مرکزی', 'province', 2),
('QM', 'قم', 'province', 4),
('QV', 'قزوین', 'province', 5),
('AR', 'اردبیل', 'province', 2),
('BU', 'بوشهر', 'province', 4),
('YA', 'یزد', 'province', 5),
('ZN', 'زنجان', 'province', 2),
('CB', 'چهارمحال و بختیاری', 'province', 4),
('NK', 'خراسان شمالی', 'province', 5),
('SK', 'خراسان جنوبی', 'province', 2),
('KB', 'کهگیلویه و بویراحمد', 'province', 4),
('SM', 'سمنان', 'province', 5),
('IL', 'ایلام', 'province', 2);

-- Tehran Medical Centers
INSERT INTO territories (id, name, type, assigned_to_employee_id) VALUES
('mc_001', 'بیمارستان شریعتی', 'medical_center', 2),
('mc_002', 'بیمارستان امام خمینی', 'medical_center', 4),
('mc_003', 'بیمارستان ولیعصر', 'medical_center', 5),
('mc_004', 'بیمارستان پارسیان', 'medical_center', 2),
('mc_005', 'بیمارستان کسری', 'medical_center', 4),
('mc_006', 'بیمارستان آتیه', 'medical_center', 5),
('mc_007', 'بیمارستان پارس', 'medical_center', 2),
('mc_008', 'بیمارستان دی', 'medical_center', 4),
('mc_009', 'بیمارستان جم', 'medical_center', 5),
('mc_010', 'بیمارستان آریا', 'medical_center', 2);

-- =============================================
-- 5. TERRITORY MARKET SHARES
-- =============================================

-- Province market shares for Product 1 (سوزن بیوپسی)
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) VALUES
('KR', 1, 9.64),
('ES', 1, 7.68),
('FA', 1, 7.28),
('KZ', 1, 7.07),
('AE', 1, 5.86),
('MN', 1, 4.93),
('AW', 1, 4.90),
('KE', 1, 4.75),
('SB', 1, 4.16),
('AL', 1, 4.07),
('GI', 1, 3.81),
('BK', 1, 2.93),
('GO', 1, 2.80),
('HG', 1, 2.66),
('LO', 1, 2.64),
('HD', 1, 2.60),
('KD', 1, 2.40),
('MK', 1, 2.15),
('QM', 1, 1.94),
('QV', 1, 1.91),
('AR', 1, 1.91),
('BU', 1, 1.74),
('YA', 1, 1.71),
('ZN', 1, 1.59),
('CB', 1, 1.42),
('NK', 1, 1.29),
('SK', 1, 1.15),
('KB', 1, 1.07),
('SM', 1, 1.05),
('IL', 1, 0.87);

-- Tehran medical centers market shares for Product 1
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) VALUES
('mc_001', 1, 2.5),
('mc_002', 1, 2.3),
('mc_003', 1, 2.1),
('mc_004', 1, 1.9),
('mc_005', 1, 1.7),
('mc_006', 1, 1.5),
('mc_007', 1, 1.3),
('mc_008', 1, 1.1),
('mc_009', 1, 0.9),
('mc_010', 1, 0.7);

-- Market shares for other products (simplified distribution)
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage)
SELECT territory_id, 2, share_percentage * 0.8 FROM territory_market_shares WHERE product_id = 1;

INSERT INTO territory_market_shares (territory_id, product_id, share_percentage)
SELECT territory_id, 3, share_percentage * 0.6 FROM territory_market_shares WHERE product_id = 1;

INSERT INTO territory_market_shares (territory_id, product_id, share_percentage)
SELECT territory_id, 4, share_percentage * 0.7 FROM territory_market_shares WHERE product_id = 1;

INSERT INTO territory_market_shares (territory_id, product_id, share_percentage)
SELECT territory_id, 5, share_percentage * 0.5 FROM territory_market_shares WHERE product_id = 1;

-- =============================================
-- 6. MARKET DATA
-- =============================================

-- National market data for 1404
INSERT INTO market_data (product_id, year, market_size, market_type) VALUES
(1, 1404, 1800, 'national'),
(2, 1404, 1200, 'national'),
(3, 1404, 300, 'national'),
(4, 1404, 200, 'national'),
(5, 1404, 150, 'national');

-- Tehran market data for 1404
INSERT INTO market_data (product_id, year, market_size, market_type) VALUES
(1, 1404, 450, 'tehran'),
(2, 1404, 300, 'tehran'),
(3, 1404, 75, 'tehran'),
(4, 1404, 50, 'tehran'),
(5, 1404, 40, 'tehran');

-- =============================================
-- 7. EMPLOYEE KPIs
-- =============================================

-- Assign KPIs to employees
INSERT INTO employee_kpis (employee_id, kpi_config_id, target_value) VALUES
-- Manager KPIs
(1, 'sales', 100),
(1, 'leads', 50),
(1, 'conversion', 25),

-- Sales Manager KPIs
(2, 'sales', 80),
(2, 'leads', 40),
(2, 'conversion', 20),

-- IT Manager KPIs
(3, 'sales', 30),
(3, 'leads', 15),
(3, 'conversion', 10),

-- Sales Representatives KPIs
(4, 'sales', 60),
(4, 'leads', 30),
(4, 'conversion', 15),

(5, 'sales', 65),
(5, 'leads', 32),
(5, 'conversion', 16),

-- Marketing Specialist KPIs
(6, 'sales', 40),
(6, 'leads', 25),
(6, 'conversion', 12);

-- =============================================
-- 8. SAMPLE KPI SCORES
-- =============================================

-- Sample scores for current period (خرداد 1404)
INSERT INTO kpi_scores (employee_kpi_id, period, actual_value) VALUES
-- Manager scores
(1, 'خرداد 1404', 95),
(2, 'خرداد 1404', 48),
(3, 'خرداد 1404', 22),

-- Sales Manager scores
(4, 'خرداد 1404', 75),
(5, 'خرداد 1404', 35),
(6, 'خرداد 1404', 18),

-- IT Manager scores
(7, 'خرداد 1404', 28),
(8, 'خرداد 1404', 12),
(9, 'خرداد 1404', 8),

-- Sales Rep 1 scores
(10, 'خرداد 1404', 55),
(11, 'خرداد 1404', 28),
(12, 'خرداد 1404', 14),

-- Sales Rep 2 scores
(13, 'خرداد 1404', 62),
(14, 'خرداد 1404', 30),
(15, 'خرداد 1404', 15),

-- Marketing Specialist scores
(16, 'خرداد 1404', 38),
(17, 'خرداد 1404', 22),
(18, 'خرداد 1404', 11);

-- =============================================
-- 9. SAMPLE SALES TARGETS
-- =============================================

-- Sales targets for خرداد 1404
INSERT INTO sales_targets (employee_id, product_id, period, target_quantity, actual_quantity) VALUES
-- Manager targets
(1, 1, 'خرداد 1404', 10, 9),
(1, 2, 'خرداد 1404', 8, 7),
(1, 3, 'خرداد 1404', 2, 1),

-- Sales Manager targets
(2, 1, 'خرداد 1404', 15, 12),
(2, 2, 'خرداد 1404', 12, 10),
(2, 3, 'خرداد 1404', 3, 2),

-- Sales Rep 1 targets
(4, 1, 'خرداد 1404', 8, 6),
(4, 2, 'خرداد 1404', 6, 5),
(4, 3, 'خرداد 1404', 1, 1),

-- Sales Rep 2 targets
(5, 1, 'خرداد 1404', 9, 7),
(5, 2, 'خرداد 1404', 7, 6),
(5, 3, 'خرداد 1404', 2, 1);

-- =============================================
-- 10. SAMPLE PERFORMANCE NOTES
-- =============================================

INSERT INTO performance_notes (employee_id, period, note_text) VALUES
(1, 'خرداد 1404', 'عملکرد عالی در مدیریت تیم و دستیابی به اهداف کلان'),
(2, 'خرداد 1404', 'نتیجه‌بخش در هدایت تیم فروش و بهبود فرآیندها'),
(3, 'خرداد 1404', 'ارائه خدمات IT با کیفیت و پشتیبانی مناسب'),
(4, 'خرداد 1404', 'عملکرد خوب در فروش، نیاز به بهبود در سرنخ‌یابی'),
(5, 'خرداد 1404', 'دستیابی به اهداف فروش، پیشنهاد آموزش بیشتر'),
(6, 'خرداد 1404', 'فعالیت مؤثر در بازاریابی و ایجاد آگاهی از برند');

-- =============================================
-- 11. APP SETTINGS
-- =============================================

INSERT INTO app_settings (key, value, description) VALUES
('theme', '"default"', 'تم پیش‌فرض برنامه'),
('cardSize', '"comfortable"', 'اندازه کارت‌ها در داشبورد'),
('salesConfig', '{"totalTimePerPerson": 10600, "existingClientTime": 4700, "leadToOppTime": 35, "oppToCustomerTime": 52.5, "leadToOppRate": 25, "oppToCustomerRate": 35, "commissionRate": 4, "marketSize": 1800}', 'تنظیمات فروش'),
('salesPlannerState', '{"unknownVariable": "numSalespeople", "inputs": {"numSalespeople": 2, "targetCustomers": 450, "averageSalary": 37000000, "averageDealSize": 150000000}}', 'وضعیت برنامه‌ریز فروش'),
('availableYears', '[1404]', 'سال‌های موجود در سیستم'),
('backup_version', '1', 'نسخه پشتیبان');

-- =============================================
-- SEED DATA COMPLETE
-- =============================================
