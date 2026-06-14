-- =============================================
-- Sales Management Dashboard - Clean Sample Data
-- Version: 1.0
-- Description: Remove all sample data before production deployment
-- =============================================

-- =============================================
-- WARNING: This script will delete ALL sample data
-- Only run this script when you're ready for production
-- =============================================

-- Disable foreign key constraints temporarily for cleanup
PRAGMA foreign_keys = OFF;

-- =============================================
-- 1. DELETE SAMPLE DATA (in reverse dependency order)
-- =============================================

-- Delete sample KPI scores
DELETE FROM kpi_scores WHERE employee_kpi_id IN (
    SELECT id FROM employee_kpis WHERE employee_id IN (1, 2, 3, 4, 5, 6)
);

-- Delete sample sales targets
DELETE FROM sales_targets WHERE employee_id IN (1, 2, 3, 4, 5, 6);

-- Delete sample performance notes
DELETE FROM performance_notes WHERE employee_id IN (1, 2, 3, 4, 5, 6);

-- Delete sample employee KPIs
DELETE FROM employee_kpis WHERE employee_id IN (1, 2, 3, 4, 5, 6);

-- Delete sample territory market shares
DELETE FROM territory_market_shares WHERE territory_id IN (
    'KR', 'ES', 'FA', 'KZ', 'AE', 'MN', 'AW', 'KE', 'SB', 'AL', 'GI', 'BK', 'GO', 'HG', 'LO', 'HD', 'KD', 'MK', 'QM', 'QV', 'AR', 'BU', 'YA', 'ZN', 'CB', 'NK', 'SK', 'KB', 'SM', 'IL',
    'mc_001', 'mc_002', 'mc_003', 'mc_004', 'mc_005', 'mc_006', 'mc_007', 'mc_008', 'mc_009', 'mc_010'
);

-- Delete sample market data
DELETE FROM market_data WHERE product_id IN (1, 2, 3, 4, 5);

-- Delete sample territories
DELETE FROM territories WHERE id IN (
    'KR', 'ES', 'FA', 'KZ', 'AE', 'MN', 'AW', 'KE', 'SB', 'AL', 'GI', 'BK', 'GO', 'HG', 'LO', 'HD', 'KD', 'MK', 'QM', 'QV', 'AR', 'BU', 'YA', 'ZN', 'CB', 'NK', 'SK', 'KB', 'SM', 'IL',
    'mc_001', 'mc_002', 'mc_003', 'mc_004', 'mc_005', 'mc_006', 'mc_007', 'mc_008', 'mc_009', 'mc_010'
);

-- Delete sample products
DELETE FROM products WHERE id IN (1, 2, 3, 4, 5);

-- Delete sample employees
DELETE FROM employees WHERE id IN (1, 2, 3, 4, 5, 6);

-- Delete sample KPI configs (optional - you might want to keep these)
-- DELETE FROM kpi_configs WHERE id IN ('sales', 'leads', 'conversion', 'procurement_error', 'dissatisfaction_error');

-- Delete sample app settings (optional - you might want to keep some)
-- DELETE FROM app_settings WHERE key IN ('theme', 'cardSize', 'salesConfig', 'salesPlannerState', 'availableYears', 'backup_version');

-- =============================================
-- 2. RESET AUTO-INCREMENT COUNTERS
-- =============================================

-- Reset auto-increment counters to start from 1
DELETE FROM sqlite_sequence WHERE name IN (
    'employees', 'products', 'territories', 'employee_kpis', 'kpi_scores', 
    'sales_targets', 'performance_notes', 'market_data', 'territory_market_shares'
);

-- =============================================
-- 3. VERIFY CLEANUP
-- =============================================

-- Check remaining data counts
SELECT 
    'employees' as table_name,
    COUNT(*) as remaining_records
FROM employees
UNION ALL
SELECT 
    'products' as table_name,
    COUNT(*) as remaining_records
FROM products
UNION ALL
SELECT 
    'territories' as table_name,
    COUNT(*) as remaining_records
FROM territories
UNION ALL
SELECT 
    'employee_kpis' as table_name,
    COUNT(*) as remaining_records
FROM employee_kpis
UNION ALL
SELECT 
    'kpi_scores' as table_name,
    COUNT(*) as remaining_records
FROM kpi_scores
UNION ALL
SELECT 
    'sales_targets' as table_name,
    COUNT(*) as remaining_records
FROM sales_targets
UNION ALL
SELECT 
    'performance_notes' as table_name,
    COUNT(*) as remaining_records
FROM performance_notes
UNION ALL
SELECT 
    'market_data' as table_name,
    COUNT(*) as remaining_records
FROM market_data
UNION ALL
SELECT 
    'territory_market_shares' as table_name,
    COUNT(*) as remaining_records
FROM territory_market_shares;

-- =============================================
-- 4. RE-ENABLE FOREIGN KEY CONSTRAINTS
-- =============================================

PRAGMA foreign_keys = ON;

-- =============================================
-- 5. OPTIONAL: KEEP ESSENTIAL CONFIGURATIONS
-- =============================================

-- If you want to keep KPI configurations, uncomment these:
/*
INSERT OR IGNORE INTO kpi_configs (id, name, max_points, formula, description) VALUES
('sales', 'فروش', 40, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف فروش'),
('leads', 'سرنخ', 20, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف سرنخ‌یابی'),
('conversion', 'تبدیل به مشتری', 20, 'conversion_from_leads', 'محاسبه بر اساس تبدیل سرنخ‌ها به مشتری'),
('procurement_error', 'خطای تدارکات', -2, 'direct_penalty', 'جریمه مستقیم برای خطاهای تدارکاتی'),
('dissatisfaction_error', 'نارضایتی بی‌پاسخ', -2, 'direct_penalty', 'جریمه مستقیم برای عدم پاسخ به نارضایتی‌ها');
*/

-- If you want to keep basic app settings, uncomment these:
/*
INSERT OR IGNORE INTO app_settings (key, value, description) VALUES
('theme', '"default"', 'تم پیش‌فرض برنامه'),
('cardSize', '"comfortable"', 'اندازه کارت‌ها در داشبورد'),
('backup_version', '1', 'نسخه پشتیبان');
*/

-- =============================================
-- CLEANUP COMPLETE
-- =============================================

SELECT 'Sample data cleanup completed successfully!' as message;
SELECT 'Database is now ready for production data entry.' as status;
