-- =============================================
-- Sales Management Dashboard - Database Setup Script
-- Version: 1.0
-- Description: Complete database setup and initialization
-- =============================================

-- =============================================
-- Database Setup Instructions
-- =============================================

/*
This script sets up the complete Sales Management Dashboard database.

Prerequisites:
1. SQLite 3.0 or higher
2. Database file: sales_dashboard.db (will be created if not exists)

Setup Steps:
1. Run schema.sql to create all tables and structures
2. Run seed_data.sql to populate initial data
3. Run migrations.sql to apply additional features
4. Run utilities.sql to create views and functions

Usage:
sqlite3 sales_dashboard.db < schema.sql
sqlite3 sales_dashboard.db < seed_data.sql
sqlite3 sales_dashboard.db < migrations.sql
sqlite3 sales_dashboard.db < utilities.sql

Or run this complete setup script:
sqlite3 sales_dashboard.db < setup.sql
*/

-- =============================================
-- 1. CREATE DATABASE AND INITIAL SETUP
-- =============================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Set journal mode to WAL for better performance
PRAGMA journal_mode = WAL;

-- Set synchronous mode for better performance (use with caution in production)
PRAGMA synchronous = NORMAL;

-- Set cache size for better performance
PRAGMA cache_size = 10000;

-- =============================================
-- 2. CREATE ALL TABLES
-- =============================================

-- Include schema creation
.read schema.sql

-- =============================================
-- 3. INSERT INITIAL DATA
-- =============================================

-- Include seed data
.read seed_data.sql

-- =============================================
-- 4. APPLY MIGRATIONS
-- =============================================

-- Include migrations
.read migrations.sql

-- =============================================
-- 5. CREATE UTILITIES AND VIEWS
-- =============================================

-- Include utilities
.read utilities.sql

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

-- Check initial data counts
SELECT 
    'employees' as table_name,
    COUNT(*) as record_count
FROM employees
UNION ALL
SELECT 
    'products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'territories' as table_name,
    COUNT(*) as record_count
FROM territories
UNION ALL
SELECT 
    'kpi_configs' as table_name,
    COUNT(*) as record_count
FROM kpi_configs
UNION ALL
SELECT 
    'employee_kpis' as table_name,
    COUNT(*) as record_count
FROM employee_kpis
UNION ALL
SELECT 
    'kpi_scores' as table_name,
    COUNT(*) as record_count
FROM kpi_scores
UNION ALL
SELECT 
    'sales_targets' as table_name,
    COUNT(*) as record_count
FROM sales_targets
UNION ALL
SELECT 
    'market_data' as table_name,
    COUNT(*) as record_count
FROM market_data
UNION ALL
SELECT 
    'territory_market_shares' as table_name,
    COUNT(*) as record_count
FROM territory_market_shares
UNION ALL
SELECT 
    'app_settings' as table_name,
    COUNT(*) as record_count
FROM app_settings;

-- =============================================
-- 7. CREATE BACKUP
-- =============================================

-- Create initial backup
INSERT INTO backups (backup_name, backup_type, file_path, file_size, status, created_by)
SELECT 
    'Initial Setup Backup',
    'full',
    'backups/initial_setup_' || strftime('%Y%m%d_%H%M%S') || '.db',
    0, -- Will be updated after backup creation
    'completed',
    1 -- Assuming user ID 1 exists
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

-- =============================================
-- 8. SETUP COMPLETE
-- =============================================

-- Display setup completion message
SELECT 'Database setup completed successfully!' as message;

-- Display next steps
SELECT 'Next steps:' as step, 'Configure your application to connect to this database' as instruction
UNION ALL
SELECT 'Step 2:', 'Set up your API keys in the environment variables'
UNION ALL
SELECT 'Step 3:', 'Run your application and verify all features work correctly'
UNION ALL
SELECT 'Step 4:', 'Create additional users and configure permissions'
UNION ALL
SELECT 'Step 5:', 'Set up regular backups and monitoring';

-- =============================================
-- SETUP SCRIPT COMPLETE
-- =============================================
