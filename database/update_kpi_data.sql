-- =============================================
-- Sales Management Dashboard - KPI Configuration Update
-- Version: 2.1
-- Description: Update KPI configs based on provided table and fix province shares
-- =============================================

-- Disable foreign key constraints temporarily
PRAGMA foreign_keys = OFF;

-- Clear existing KPI configs and related data
DELETE FROM kpi_scores;
DELETE FROM employee_kpis;
DELETE FROM sales_targets;
DELETE FROM performance_notes;

-- Update KPI Configs based on the provided table
DELETE FROM kpi_configs;

INSERT INTO kpi_configs (id, name, max_points, formula, description) VALUES
-- Product Sales KPIs (Weight 6 each)
('biopsy_sales', 'فروش تعدادی سوزن بیوپسی', 6, 'goal_achievement', 'فروش تعدادی سوزن بیوپسی - هدف کل: 3000'),
('nephrostomy_sales', 'فروش تعدادی نفروستومی و درناژ', 6, 'goal_achievement', 'فروش تعدادی نفروستومی و درناژ - هدف کل: 850'),
('arterline_sales', 'فروش تعدادی آرتر لاین', 6, 'goal_achievement', 'فروش تعدادی آرتر لاین - هدف کل: 150'),

-- Financial KPIs (Weight 6)
('cash_sales_rate', 'نرخ فروش نقدی', 6, 'percentage_achievement', 'نرخ فروش نقدی - 50% تسویه در همان ماه یا حداکثر DSO زیر 30 روز'),

-- Customer KPIs (Weight 6)
('new_customers', 'تعداد مشتری جدید', 6, 'goal_achievement', 'تعداد مشتری جدید - از 2 الی 5 مرکز'),

-- Activity KPIs (Weight 5)
('in_person_visits', 'تعداد بازدید حضوری', 5, 'goal_achievement', 'تعداد بازدید حضوری - هدف ماهانه: 24'),
('leads_count', 'تعداد سرنخ', 5, 'goal_achievement', 'تعداد سرنخ - هدف ماهانه: 45 - هماهنگی با بازاریابی دیجیتال'),

-- Assignment KPIs (Weight 4)
('mission_assignment', 'ماموریت', 4, 'assignment_completion', 'ماموریت - الی 2 استان'),

-- Follow-up KPIs (Weight 6)
('consumption_followup', 'پیگیری مصرف و تاییدیه کتبی', 6, 'goal_achievement', 'پیگیری مصرف و تاییدیه کتبی - هدف ماهانه: 5'),

-- Conversion KPIs (Weight 6 each)
('lead_to_opportunity', 'نرخ تبدیل سرنخ به فرصت', 6, 'percentage_achievement', 'نرخ تبدیل سرنخ به فرصت - هدف ماهانه: 30%'),
('opportunity_to_customer', 'نرخ تبدیل فرصت به مشتری', 6, 'percentage_achievement', 'نرخ تبدیل فرصت به مشتری - هدف ماهانه: 40%'),

-- Retention KPIs (Weight 8)
('customer_retention', 'نرخ حفظ مشتری', 8, 'percentage_achievement', 'نرخ حفظ مشتری - هدف ماهانه: بالای 80%'),

-- Manager KPIs (Weight 30)
('manager_satisfaction', 'رضایت مدیر', 30, 'qualitative_assessment', 'رضایت مدیر - بر اساس معیارهای کیفی');

-- Update Province Market Shares with realistic distribution
-- Tehran gets highest share, other major provinces get moderate shares, smaller provinces get smaller shares
UPDATE territory_market_shares SET share_percentage = 
CASE 
    WHEN territory_id = 'TE' THEN 15.0  -- Tehran
    WHEN territory_id IN ('ES', 'FA', 'KH', 'AZ') THEN 8.0  -- Major provinces
    WHEN territory_id IN ('AL', 'MZ', 'GI', 'MK') THEN 4.0  -- Medium provinces
    WHEN territory_id IN ('QZ', 'QO', 'KR', 'KB', 'KS', 'HD', 'YZ', 'ZA') THEN 3.0  -- Smaller provinces
    ELSE 2.0  -- Smallest provinces
END
WHERE product_id = 1; -- ست نفروستومی

UPDATE territory_market_shares SET share_percentage = 
CASE 
    WHEN territory_id = 'TE' THEN 18.0  -- Tehran
    WHEN territory_id IN ('ES', 'FA', 'KH', 'AZ') THEN 9.0  -- Major provinces
    WHEN territory_id IN ('AL', 'MZ', 'GI', 'MK') THEN 4.5  -- Medium provinces
    WHEN territory_id IN ('QZ', 'QO', 'KR', 'KB', 'KS', 'HD', 'YZ', 'ZA') THEN 3.5  -- Smaller provinces
    ELSE 2.5  -- Smallest provinces
END
WHERE product_id = 2; -- سوزن بیوپسی

UPDATE territory_market_shares SET share_percentage = 
CASE 
    WHEN territory_id = 'TE' THEN 12.0  -- Tehran
    WHEN territory_id IN ('ES', 'FA', 'KH', 'AZ') THEN 6.0  -- Major provinces
    WHEN territory_id IN ('AL', 'MZ', 'GI', 'MK') THEN 3.0  -- Medium provinces
    WHEN territory_id IN ('QZ', 'QO', 'KR', 'KB', 'KS', 'HD', 'YZ', 'ZA') THEN 2.5  -- Smaller provinces
    ELSE 1.8  -- Smallest provinces
END
WHERE product_id = 3; -- کاتتر شریانی

-- Insert Employee KPIs for sales team based on the table
INSERT INTO employee_kpis (employee_id, kpi_config_id, target_value) VALUES
-- ریحانه کاشی ساز (Sales targets based on table)
(1, 'biopsy_sales', 3000), (1, 'nephrostomy_sales', 850), (1, 'arterline_sales', 150),
(1, 'cash_sales_rate', 50), (1, 'new_customers', 3), (1, 'in_person_visits', 24),
(1, 'leads_count', 45), (1, 'mission_assignment', 2), (1, 'consumption_followup', 5),
(1, 'lead_to_opportunity', 30), (1, 'opportunity_to_customer', 40), (1, 'customer_retention', 80),
(1, 'manager_satisfaction', 85),

-- محمد حسین زرقلمی
(2, 'biopsy_sales', 3000), (2, 'nephrostomy_sales', 850), (2, 'arterline_sales', 150),
(2, 'cash_sales_rate', 50), (2, 'new_customers', 3), (2, 'in_person_visits', 24),
(2, 'leads_count', 45), (2, 'mission_assignment', 2), (2, 'consumption_followup', 5),
(2, 'lead_to_opportunity', 30), (2, 'opportunity_to_customer', 40), (2, 'customer_retention', 80),
(2, 'manager_satisfaction', 85),

-- محمد نیلی زاده
(3, 'biopsy_sales', 3000), (3, 'nephrostomy_sales', 850), (3, 'arterline_sales', 150),
(3, 'cash_sales_rate', 50), (3, 'new_customers', 3), (3, 'in_person_visits', 24),
(3, 'leads_count', 45), (3, 'mission_assignment', 2), (3, 'consumption_followup', 5),
(3, 'lead_to_opportunity', 30), (3, 'opportunity_to_customer', 40), (3, 'customer_retention', 80),
(3, 'manager_satisfaction', 85),

-- محمد سید صالحی
(4, 'biopsy_sales', 3000), (4, 'nephrostomy_sales', 850), (4, 'arterline_sales', 150),
(4, 'cash_sales_rate', 50), (4, 'new_customers', 3), (4, 'in_person_visits', 24),
(4, 'leads_count', 45), (4, 'mission_assignment', 2), (4, 'consumption_followup', 5),
(4, 'lead_to_opportunity', 30), (4, 'opportunity_to_customer', 40), (4, 'customer_retention', 80),
(4, 'manager_satisfaction', 85),

-- سارا اسلامی
(5, 'biopsy_sales', 3000), (5, 'nephrostomy_sales', 850), (5, 'arterline_sales', 150),
(5, 'cash_sales_rate', 50), (5, 'new_customers', 3), (5, 'in_person_visits', 24),
(5, 'leads_count', 45), (5, 'mission_assignment', 2), (5, 'consumption_followup', 5),
(5, 'lead_to_opportunity', 30), (5, 'opportunity_to_customer', 40), (5, 'customer_retention', 80),
(5, 'manager_satisfaction', 85),

-- سارا حسینی (مدیر فروش) - Higher targets
(6, 'biopsy_sales', 4000), (6, 'nephrostomy_sales', 1000), (6, 'arterline_sales', 200),
(6, 'cash_sales_rate', 60), (6, 'new_customers', 5), (6, 'in_person_visits', 30),
(6, 'leads_count', 60), (6, 'mission_assignment', 3), (6, 'consumption_followup', 8),
(6, 'lead_to_opportunity', 35), (6, 'opportunity_to_customer', 45), (6, 'customer_retention', 85),
(6, 'manager_satisfaction', 90),

-- سارا طهماسبی (بازرگانی) - Lower targets
(7, 'biopsy_sales', 1500), (7, 'nephrostomy_sales', 400), (7, 'arterline_sales', 75),
(7, 'cash_sales_rate', 40), (7, 'new_customers', 2), (7, 'in_person_visits', 15),
(7, 'leads_count', 25), (7, 'mission_assignment', 1), (7, 'consumption_followup', 3),
(7, 'lead_to_opportunity', 25), (7, 'opportunity_to_customer', 35), (7, 'customer_retention', 75),
(7, 'manager_satisfaction', 80);

-- Insert Sample KPI Scores for current period
INSERT INTO kpi_scores (employee_kpi_id, period, actual_value) VALUES
-- ریحانه کاشی ساز - Sample scores
(1, 'خرداد 1404', 2800), (2, 'خرداد 1404', 800), (3, 'خرداد 1404', 140),
(4, 'خرداد 1404', 48), (5, 'خرداد 1404', 2), (6, 'خرداد 1404', 22),
(7, 'خرداد 1404', 42), (8, 'خرداد 1404', 1), (9, 'خرداد 1404', 4),
(10, 'خرداد 1404', 28), (11, 'خرداد 1404', 38), (12, 'خرداد 1404', 78),
(13, 'خرداد 1404', 82),

-- محمد حسین زرقلمی - Sample scores
(14, 'خرداد 1404', 2900), (15, 'خرداد 1404', 820), (16, 'خرداد 1404', 145),
(17, 'خرداد 1404', 52), (18, 'خرداد 1404', 3), (19, 'خرداد 1404', 25),
(20, 'خرداد 1404', 47), (21, 'خرداد 1404', 2), (22, 'خرداد 1404', 5),
(23, 'خرداد 1404', 32), (24, 'خرداد 1404', 42), (25, 'خرداد 1404', 82),
(26, 'خرداد 1404', 85),

-- سارا حسینی (مدیر فروش) - Higher performance
(39, 'خرداد 1404', 3800), (40, 'خرداد 1404', 950), (41, 'خرداد 1404', 190),
(42, 'خرداد 1404', 58), (43, 'خرداد 1404', 4), (44, 'خرداد 1404', 28),
(45, 'خرداد 1404', 58), (46, 'خرداد 1404', 3), (47, 'خرداد 1404', 7),
(48, 'خرداد 1404', 36), (49, 'خرداد 1404', 46), (50, 'خرداد 1404', 86),
(51, 'خرداد 1404', 88);

-- Insert Sample Sales Targets based on KPI table
INSERT INTO sales_targets (employee_id, product_id, period, target_quantity, actual_quantity) VALUES
-- ریحانه کاشی ساز
(1, 2, 'خرداد 1404', 250, 240),  -- سوزن بیوپسی (monthly target from 3000 annual)
(1, 1, 'خرداد 1404', 70, 68),   -- ست نفروستومی (monthly target from 850 annual)
(1, 3, 'خرداد 1404', 12, 11),   -- کاتتر شریانی (monthly target from 150 annual),

-- محمد حسین زرقلمی
(2, 2, 'خرداد 1404', 250, 255),  -- سوزن بیوپسی
(2, 1, 'خرداد 1404', 70, 72),   -- ست نفروستومی
(2, 3, 'خرداد 1404', 12, 13),   -- کاتتر شریانی,

-- سارا حسینی (مدیر فروش) - Higher targets
(6, 2, 'خرداد 1404', 330, 320),  -- سوزن بیوپسی
(6, 1, 'خرداد 1404', 85, 88),   -- ست نفروستومی
(6, 3, 'خرداد 1404', 17, 18);   -- کاتتر شریانی

-- Insert Sample Performance Notes
INSERT INTO performance_notes (employee_id, period, note_text) VALUES
(1, 'خرداد 1404', 'عملکرد خوب در فروش سوزن بیوپسی. نیاز به بهبود در جذب مشتریان جدید.'),
(2, 'خرداد 1404', 'عملکرد عالی در تمام محصولات. نرخ تبدیل سرنخ به فرصت بالا.'),
(3, 'خرداد 1404', 'عملکرد متوسط. نیاز به تمرکز بیشتر بر بازدیدهای حضوری.'),
(4, 'خرداد 1404', 'عملکرد خوب در فروش ست نفروستومی. نرخ حفظ مشتری بالا.'),
(5, 'خرداد 1404', 'عملکرد عالی در تمام شاخص‌ها. رضایت مدیر بالا.'),
(6, 'خرداد 1404', 'مدیریت تیم فروش به خوبی انجام شده. عملکرد بالاتر از هدف در تمام شاخص‌ها.'),
(7, 'خرداد 1404', 'عملکرد مناسب در بخش بازرگانی. هماهنگی خوب با تیم فروش.');

-- Re-enable foreign key constraints
PRAGMA foreign_keys = ON;
