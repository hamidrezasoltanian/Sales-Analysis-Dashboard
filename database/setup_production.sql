-- =============================================
-- Sales Management Dashboard - Production Setup
-- Version: 1.0
-- Description: Clean database setup for production use
-- =============================================

-- =============================================
-- PRODUCTION DATABASE SETUP
-- This script creates a clean database without sample data
-- =============================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Set journal mode to WAL for better performance
PRAGMA journal_mode = WAL;

-- Set synchronous mode for better performance
PRAGMA synchronous = NORMAL;

-- Set cache size for better performance
PRAGMA cache_size = 10000;

-- =============================================
-- 1. CREATE ALL TABLES
-- =============================================

-- Include schema creation
.read schema.sql

-- =============================================
-- 2. APPLY MIGRATIONS
-- =============================================

-- Include migrations
.read migrations.sql

-- =============================================
-- 3. CREATE UTILITIES AND VIEWS
-- =============================================

-- Include utilities
.read utilities.sql

-- =============================================
-- 4. INSERT ONLY ESSENTIAL CONFIGURATIONS
-- =============================================

-- Essential KPI configurations (you can modify these)
INSERT INTO kpi_configs (id, name, max_points, formula, description) VALUES
('sales', 'فروش', 40, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف فروش'),
('leads', 'سرنخ', 20, 'goal_achievement', 'محاسبه بر اساس دستیابی به هدف سرنخ‌یابی'),
('conversion', 'تبدیل به مشتری', 20, 'conversion_from_leads', 'محاسبه بر اساس تبدیل سرنخ‌ها به مشتری'),
('procurement_error', 'خطای تدارکات', -2, 'direct_penalty', 'جریمه مستقیم برای خطاهای تدارکاتی'),
('dissatisfaction_error', 'نارضایتی بی‌پاسخ', -2, 'direct_penalty', 'جریمه مستقیم برای عدم پاسخ به نارضایتی‌ها');

-- Essential app settings (you can modify these)
INSERT INTO app_settings (key, value, description) VALUES
('theme', '"default"', 'تم پیش‌فرض برنامه'),
('cardSize', '"comfortable"', 'اندازه کارت‌ها در داشبورد'),
('backup_version', '1', 'نسخه پشتیبان'),
('availableYears', '[1404]', 'سال‌های موجود در سیستم');

-- =============================================
-- 5. CREATE ADMIN USER (OPTIONAL)
-- =============================================

-- Uncomment and modify if you want to create an admin user
/*
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@yourcompany.com', 'hashed_password_here', 'مدیر', 'سیستم', 'admin');
*/

-- =============================================
-- 6. VERIFY SETUP
-- =============================================

-- Check if all tables were created successfully
SELECT 
    name,
    type,
    CASE 
        WHEN sql IS NOT NULL THEN 'Created'
        ELSE 'Missing'
    END as status
FROM sqlite_master 
WHERE type = 'table' 
AND name NOT LIKE 'sqlite_%'
ORDER BY name;

-- Check configuration data counts
SELECT 
    'kpi_configs' as table_name,
    COUNT(*) as record_count
FROM kpi_configs
UNION ALL
SELECT 
    'app_settings' as table_name,
    COUNT(*) as record_count
FROM app_settings;

-- =============================================
-- 7. NEXT STEPS FOR PRODUCTION
-- =============================================

SELECT 'Production database setup completed successfully!' as message;

SELECT 'Next steps for production deployment:' as step, 'Add your real employees' as instruction
UNION ALL
SELECT 'Step 2:', 'Add your actual products'
UNION ALL
SELECT 'Step 3:', 'Configure territories (provinces and medical centers)'
UNION ALL
SELECT 'Step 4:', 'Set up market data for your products'
UNION ALL
SELECT 'Step 5:', 'Create user accounts for your team'
UNION ALL
SELECT 'Step 6:', 'Configure sales targets and KPIs'
UNION ALL
SELECT 'Step 7:', 'Set up regular backups'
UNION ALL
SELECT 'Step 8:', 'Configure monitoring and alerts';

-- =============================================
-- PRODUCTION SETUP COMPLETE
-- =============================================
