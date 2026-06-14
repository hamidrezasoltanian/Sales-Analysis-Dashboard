-- =============================================
-- Sales Management Dashboard - Database Utilities
-- Version: 1.0
-- Description: Utility functions and procedures for database management
-- =============================================

-- =============================================
-- 1. PERFORMANCE OPTIMIZATION FUNCTIONS
-- =============================================

-- Function to calculate employee performance score
CREATE VIEW IF NOT EXISTS employee_performance_calculated AS
SELECT 
    e.id,
    e.name,
    e.title,
    e.department,
    COUNT(DISTINCT ek.id) as total_kpis,
    COUNT(DISTINCT ks.id) as scored_periods,
    ROUND(AVG(CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        THEN (ks.actual_value * 100.0 / ek.target_value)
        ELSE NULL
    END), 2) as avg_performance_percentage,
    ROUND(SUM(CASE 
        WHEN ks.actual_value IS NOT NULL AND kc.max_points IS NOT NULL
        THEN CASE kc.formula
            WHEN 'goal_achievement' THEN 
                CASE 
                    WHEN ek.target_value > 0 THEN LEAST(ks.actual_value * 100.0 / ek.target_value, 100) * kc.max_points / 100
                    ELSE 0
                END
            WHEN 'direct_penalty' THEN ks.actual_value * kc.max_points
            WHEN 'conversion_from_leads' THEN 
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM employee_kpis ek2 
                        JOIN kpi_scores ks2 ON ek2.id = ks2.employee_kpi_id 
                        WHERE ek2.employee_id = e.id 
                        AND ek2.kpi_config_id = 'leads' 
                        AND ks2.period = ks.period
                        AND ks2.actual_value > 0
                    ) THEN LEAST(ks.actual_value * 100.0 / (
                        SELECT ks2.actual_value * 0.2 
                        FROM employee_kpis ek2 
                        JOIN kpi_scores ks2 ON ek2.id = ks2.employee_kpi_id 
                        WHERE ek2.employee_id = e.id 
                        AND ek2.kpi_config_id = 'leads' 
                        AND ks2.period = ks.period
                    ), 100) * kc.max_points / 100
                    ELSE 0
                END
            ELSE 0
        END
        ELSE 0
    END), 2) as total_score
FROM employees e
LEFT JOIN employee_kpis ek ON e.id = ek.employee_id AND ek.is_active = 1
LEFT JOIN kpi_scores ks ON ek.id = ks.employee_kpi_id
LEFT JOIN kpi_configs kc ON ek.kpi_config_id = kc.id
WHERE e.is_active = 1
GROUP BY e.id, e.name, e.title, e.department;

-- Function to get territory performance summary
CREATE VIEW IF NOT EXISTS territory_performance_summary AS
SELECT 
    t.id,
    t.name,
    t.type,
    e.name as assigned_employee_name,
    e.department as assigned_employee_department,
    COUNT(DISTINCT tms.product_id) as total_products,
    ROUND(SUM(tms.share_percentage), 2) as total_market_share,
    COUNT(DISTINCT st.id) as total_targets,
    ROUND(AVG(CASE 
        WHEN st.target_quantity > 0 
        THEN (st.actual_quantity * 100.0 / st.target_quantity)
        ELSE NULL
    END), 2) as avg_achievement_percentage
FROM territories t
LEFT JOIN employees e ON t.assigned_to_employee_id = e.id
LEFT JOIN territory_market_shares tms ON t.id = tms.territory_id
LEFT JOIN sales_targets st ON e.id = st.employee_id
WHERE t.is_active = 1
GROUP BY t.id, t.name, t.type, e.name, e.department;

-- =============================================
-- 2. DATA VALIDATION FUNCTIONS
-- =============================================

-- Function to validate KPI score entry
CREATE TRIGGER IF NOT EXISTS validate_kpi_score_entry
    BEFORE INSERT ON kpi_scores
    FOR EACH ROW
BEGIN
    -- Check if the employee KPI exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM employee_kpis ek 
        WHERE ek.id = NEW.employee_kpi_id 
        AND ek.is_active = 1
    ) THEN
        SELECT RAISE(ABORT, 'Employee KPI is not active or does not exist');
    END IF;
    
    -- Check if actual_value is not negative
    IF NEW.actual_value < 0 THEN
        SELECT RAISE(ABORT, 'Actual value cannot be negative');
    END IF;
    
    -- Check if period format is valid (should contain month and year)
    IF NEW.period NOT LIKE '% %' OR length(NEW.period) < 7 THEN
        SELECT RAISE(ABORT, 'Invalid period format');
    END IF;
END;

-- Function to validate sales target entry
CREATE TRIGGER IF NOT EXISTS validate_sales_target_entry
    BEFORE INSERT ON sales_targets
    FOR EACH ROW
BEGIN
    -- Check if employee exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM employees e 
        WHERE e.id = NEW.employee_id 
        AND e.is_active = 1
    ) THEN
        SELECT RAISE(ABORT, 'Employee is not active or does not exist');
    END IF;
    
    -- Check if product exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM products p 
        WHERE p.id = NEW.product_id 
        AND p.is_active = 1
    ) THEN
        SELECT RAISE(ABORT, 'Product is not active or does not exist');
    END IF;
    
    -- Check if quantities are not negative
    IF NEW.target_quantity < 0 OR (NEW.actual_quantity IS NOT NULL AND NEW.actual_quantity < 0) THEN
        SELECT RAISE(ABORT, 'Quantities cannot be negative');
    END IF;
END;

-- =============================================
-- 3. DATA CLEANUP FUNCTIONS
-- =============================================

-- Function to clean up orphaned records
CREATE VIEW IF NOT EXISTS orphaned_records AS
SELECT 
    'employee_kpis' as table_name,
    ek.id as record_id,
    'Employee does not exist' as issue
FROM employee_kpis ek
LEFT JOIN employees e ON ek.employee_id = e.id
WHERE e.id IS NULL

UNION ALL

SELECT 
    'kpi_scores' as table_name,
    ks.id as record_id,
    'Employee KPI does not exist' as issue
FROM kpi_scores ks
LEFT JOIN employee_kpis ek ON ks.employee_kpi_id = ek.id
WHERE ek.id IS NULL

UNION ALL

SELECT 
    'sales_targets' as table_name,
    st.id as record_id,
    'Employee does not exist' as issue
FROM sales_targets st
LEFT JOIN employees e ON st.employee_id = e.id
WHERE e.id IS NULL

UNION ALL

SELECT 
    'sales_targets' as table_name,
    st.id as record_id,
    'Product does not exist' as issue
FROM sales_targets st
LEFT JOIN products p ON st.product_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
    'territory_market_shares' as table_name,
    tms.id as record_id,
    'Territory does not exist' as issue
FROM territory_market_shares tms
LEFT JOIN territories t ON tms.territory_id = t.id
WHERE t.id IS NULL

UNION ALL

SELECT 
    'territory_market_shares' as table_name,
    tms.id as record_id,
    'Product does not exist' as issue
FROM territory_market_shares tms
LEFT JOIN products p ON tms.product_id = p.id
WHERE p.id IS NULL;

-- =============================================
-- 4. REPORTING FUNCTIONS
-- =============================================

-- Function to generate monthly performance report
CREATE VIEW IF NOT EXISTS monthly_performance_report AS
SELECT 
    e.id as employee_id,
    e.name as employee_name,
    e.department,
    ks.period,
    COUNT(DISTINCT ek.id) as total_kpis,
    COUNT(DISTINCT ks.id) as scored_kpis,
    ROUND(AVG(CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        THEN (ks.actual_value * 100.0 / ek.target_value)
        ELSE NULL
    END), 2) as avg_achievement_percentage,
    ROUND(SUM(CASE 
        WHEN ks.actual_value IS NOT NULL AND kc.max_points IS NOT NULL
        THEN CASE kc.formula
            WHEN 'goal_achievement' THEN 
                CASE 
                    WHEN ek.target_value > 0 THEN LEAST(ks.actual_value * 100.0 / ek.target_value, 100) * kc.max_points / 100
                    ELSE 0
                END
            WHEN 'direct_penalty' THEN ks.actual_value * kc.max_points
            ELSE 0
        END
        ELSE 0
    END), 2) as total_score
FROM employees e
LEFT JOIN employee_kpis ek ON e.id = ek.employee_id AND ek.is_active = 1
LEFT JOIN kpi_scores ks ON ek.id = ks.employee_kpi_id
LEFT JOIN kpi_configs kc ON ek.kpi_config_id = kc.id
WHERE e.is_active = 1
GROUP BY e.id, e.name, e.department, ks.period
HAVING ks.period IS NOT NULL;

-- Function to generate sales performance report
CREATE VIEW IF NOT EXISTS sales_performance_report AS
SELECT 
    st.period,
    e.id as employee_id,
    e.name as employee_name,
    e.department,
    p.id as product_id,
    p.name as product_name,
    p.price as product_price,
    st.target_quantity,
    st.actual_quantity,
    CASE 
        WHEN st.target_quantity > 0 
        THEN ROUND((st.actual_quantity * 100.0 / st.target_quantity), 2)
        ELSE NULL
    END as achievement_percentage,
    CASE 
        WHEN st.actual_quantity IS NOT NULL
        THEN (st.actual_quantity * p.price)
        ELSE NULL
    END as actual_revenue,
    CASE 
        WHEN st.target_quantity IS NOT NULL
        THEN (st.target_quantity * p.price)
        ELSE NULL
    END as target_revenue
FROM sales_targets st
JOIN employees e ON st.employee_id = e.id
JOIN products p ON st.product_id = p.id
WHERE e.is_active = 1 AND p.is_active = 1;

-- =============================================
-- 5. BACKUP AND RESTORE FUNCTIONS
-- =============================================

-- Function to create data export
CREATE VIEW IF NOT EXISTS data_export_summary AS
SELECT 
    'employees' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM employees
WHERE is_active = 1

UNION ALL

SELECT 
    'products' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM products
WHERE is_active = 1

UNION ALL

SELECT 
    'territories' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM territories
WHERE is_active = 1

UNION ALL

SELECT 
    'employee_kpis' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM employee_kpis
WHERE is_active = 1

UNION ALL

SELECT 
    'kpi_scores' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM kpi_scores

UNION ALL

SELECT 
    'sales_targets' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM sales_targets

UNION ALL

SELECT 
    'market_data' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM market_data

UNION ALL

SELECT 
    'territory_market_shares' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM territory_market_shares;

-- =============================================
-- 6. STATISTICS AND ANALYTICS FUNCTIONS
-- =============================================

-- Function to get system statistics
CREATE VIEW IF NOT EXISTS system_statistics AS
SELECT 
    (SELECT COUNT(*) FROM employees WHERE is_active = 1) as active_employees,
    (SELECT COUNT(*) FROM products WHERE is_active = 1) as active_products,
    (SELECT COUNT(*) FROM territories WHERE is_active = 1) as active_territories,
    (SELECT COUNT(*) FROM territories WHERE type = 'province' AND is_active = 1) as provinces,
    (SELECT COUNT(*) FROM territories WHERE type = 'medical_center' AND is_active = 1) as medical_centers,
    (SELECT COUNT(*) FROM employee_kpis WHERE is_active = 1) as active_kpi_assignments,
    (SELECT COUNT(*) FROM kpi_scores) as total_kpi_scores,
    (SELECT COUNT(*) FROM sales_targets) as total_sales_targets,
    (SELECT COUNT(DISTINCT period) FROM kpi_scores) as periods_with_data,
    (SELECT COUNT(DISTINCT period) FROM sales_targets) as periods_with_sales_data;

-- Function to get performance trends
CREATE VIEW IF NOT EXISTS performance_trends AS
SELECT 
    ks.period,
    COUNT(DISTINCT e.id) as employees_with_scores,
    ROUND(AVG(CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        THEN (ks.actual_value * 100.0 / ek.target_value)
        ELSE NULL
    END), 2) as avg_achievement_percentage,
    COUNT(DISTINCT CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        AND (ks.actual_value * 100.0 / ek.target_value) >= 100
        THEN e.id
    END) as employees_achieving_targets,
    COUNT(DISTINCT CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        AND (ks.actual_value * 100.0 / ek.target_value) < 80
        THEN e.id
    END) as employees_below_80_percent
FROM kpi_scores ks
JOIN employee_kpis ek ON ks.employee_kpi_id = ek.id
JOIN employees e ON ek.employee_id = e.id
WHERE e.is_active = 1 AND ek.is_active = 1
GROUP BY ks.period
ORDER BY ks.period;

-- =============================================
-- UTILITIES COMPLETE
-- =============================================
