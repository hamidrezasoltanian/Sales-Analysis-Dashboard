-- =============================================
-- Sales Management Dashboard Database Schema
-- Version: 1.0
-- Created: 2024
-- Description: Complete database schema for sales management system
-- =============================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =============================================
-- 1. CORE ENTITIES
-- =============================================

-- Table 1: Employees (کارمندان)
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    target_acquisition_rate DECIMAL(5,2) DEFAULT 10.0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (target_acquisition_rate >= 0 AND target_acquisition_rate <= 100),
    CHECK (name IS NOT NULL AND length(name) > 0),
    CHECK (title IS NOT NULL AND length(title) > 0),
    CHECK (department IS NOT NULL AND length(department) > 0)
);

-- Table 2: Products (محصولات)
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (price > 0),
    CHECK (name IS NOT NULL AND length(name) > 0)
);

-- Table 3: Territories (مناطق)
CREATE TABLE territories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('province', 'medical_center')),
    assigned_to_employee_id INTEGER,
    tags TEXT DEFAULT '[]',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (assigned_to_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    
    -- Constraints
    CHECK (name IS NOT NULL AND length(name) > 0),
    CHECK (id IS NOT NULL AND length(id) > 0)
);

-- Table: Mission Logs (ماموریت‌ها)
CREATE TABLE mission_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id INTEGER UNIQUE NOT NULL,
    center_id TEXT NOT NULL,
    personnel_id INTEGER,
    manager_id INTEGER,
    status TEXT NOT NULL,
    approved_at TEXT,
    completed_at TEXT,
    snap_latitude REAL,
    snap_longitude REAL,
    snap_address TEXT,
    snap_cost REAL,
    discount_code TEXT,
    discount_code_id INTEGER,
    discount_amount REAL,
    total_cost REAL,
    personal_payment REAL,
    notes TEXT,
    center_notes TEXT,
    manager_comment TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    synced_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (center_id) REFERENCES territories(id) ON DELETE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_mission_logs_external_id ON mission_logs(external_id);
CREATE INDEX idx_mission_logs_center ON mission_logs(center_id);
CREATE INDEX idx_mission_logs_personnel ON mission_logs(personnel_id);

-- =============================================
-- 2. PERFORMANCE & TARGETS
-- =============================================

-- Table 4: KPI_Configs (تنظیمات انواع KPI)
CREATE TABLE kpi_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    max_points INTEGER NOT NULL,
    formula TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (max_points > 0),
    CHECK (name IS NOT NULL AND length(name) > 0),
    CHECK (formula IN ('goal_achievement', 'direct_penalty'))
);

-- Table 5: Employee_KPIs (شاخص‌های عملکردی هر کارمند)
CREATE TABLE employee_kpis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    kpi_config_id TEXT NOT NULL,
    target_value INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (kpi_config_id) REFERENCES kpi_configs(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (target_value IS NULL OR target_value >= 0),
    
    -- Unique constraint to prevent duplicate KPI assignments
    UNIQUE (employee_id, kpi_config_id)
);

-- Table 6: KPI_Scores (امتیازات ثبت‌شده)
CREATE TABLE kpi_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_kpi_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    actual_value INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (employee_kpi_id) REFERENCES employee_kpis(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (actual_value >= 0),
    CHECK (period IS NOT NULL AND length(period) > 0),
    
    -- Unique constraint to prevent duplicate scores for same period
    UNIQUE (employee_kpi_id, period)
);

-- Table 7: Sales_Targets (اهداف فروش)
CREATE TABLE sales_targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    target_quantity INTEGER NOT NULL DEFAULT 0,
    actual_quantity INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (target_quantity >= 0),
    CHECK (actual_quantity IS NULL OR actual_quantity >= 0),
    CHECK (period IS NOT NULL AND length(period) > 0),
    
    -- Unique constraint to prevent duplicate targets
    UNIQUE (employee_id, product_id, period)
);

-- Table 8: Performance_Notes (یادداشت‌های عملکرد)
CREATE TABLE performance_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    note_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (note_text IS NOT NULL AND length(note_text) > 0),
    CHECK (period IS NOT NULL AND length(period) > 0),
    
    -- Unique constraint to prevent duplicate notes for same period
    UNIQUE (employee_id, period)
);

-- =============================================
-- 3. MARKET & CONFIGURATIONS
-- =============================================

-- Table 9: Market_Data (داده‌های بازار)
CREATE TABLE market_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    market_size INTEGER NOT NULL,
    market_type TEXT NOT NULL CHECK (market_type IN ('national', 'tehran')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (market_size >= 0),
    CHECK (year > 1300 AND year < 1500), -- Reasonable year range
    
    -- Unique constraint to prevent duplicate market data
    UNIQUE (product_id, year, market_type)
);

-- Table 10: Territory_Market_Shares (سهم بازار مناطق)
CREATE TABLE territory_market_shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    territory_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    share_percentage DECIMAL(5,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Constraints
    CHECK (share_percentage >= 0 AND share_percentage <= 100),
    
    -- Unique constraint to prevent duplicate shares
    UNIQUE (territory_id, product_id)
);

-- Table 11: App_Settings (تنظیمات برنامه)
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (key IS NOT NULL AND length(key) > 0),
    CHECK (value IS NOT NULL)
);

-- =============================================
-- 4. AUDIT & LOGGING TABLES
-- =============================================

-- Table 12: Audit_Logs (لاگ تغییرات)
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values TEXT, -- JSON format
    new_values TEXT, -- JSON format
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (table_name IS NOT NULL AND length(table_name) > 0),
    CHECK (record_id IS NOT NULL AND length(record_id) > 0)
);

-- Table 13: User_Sessions (جلسات کاربری)
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (session_token IS NOT NULL AND length(session_token) > 0),
    CHECK (expires_at > created_at)
);

-- =============================================
-- 5. INDEXES FOR PERFORMANCE
-- =============================================

-- Employee indexes
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_active ON employees(is_active);

-- Product indexes
CREATE INDEX idx_products_active ON products(is_active);

-- Territory indexes
CREATE INDEX idx_territories_type ON territories(type);
CREATE INDEX idx_territories_assigned ON territories(assigned_to_employee_id);
CREATE INDEX idx_territories_active ON territories(is_active);

-- KPI indexes
CREATE INDEX idx_employee_kpis_employee ON employee_kpis(employee_id);
CREATE INDEX idx_employee_kpis_kpi_config ON employee_kpis(kpi_config_id);
CREATE INDEX idx_kpi_scores_period ON kpi_scores(period);
CREATE INDEX idx_kpi_scores_employee_kpi ON kpi_scores(employee_kpi_id);

-- Sales targets indexes
CREATE INDEX idx_sales_targets_employee ON sales_targets(employee_id);
CREATE INDEX idx_sales_targets_product ON sales_targets(product_id);
CREATE INDEX idx_sales_targets_period ON sales_targets(period);

-- Performance notes indexes
CREATE INDEX idx_performance_notes_employee ON performance_notes(employee_id);
CREATE INDEX idx_performance_notes_period ON performance_notes(period);

-- Market data indexes
CREATE INDEX idx_market_data_product ON market_data(product_id);
CREATE INDEX idx_market_data_year ON market_data(year);
CREATE INDEX idx_market_data_type ON market_data(market_type);

-- Territory market shares indexes
CREATE INDEX idx_territory_shares_territory ON territory_market_shares(territory_id);
CREATE INDEX idx_territory_shares_product ON territory_market_shares(product_id);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- User sessions indexes
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- =============================================
-- 6. TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Trigger to update updated_at timestamp for employees
CREATE TRIGGER update_employees_timestamp 
    AFTER UPDATE ON employees
    FOR EACH ROW
BEGIN
    UPDATE employees SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for products
CREATE TRIGGER update_products_timestamp 
    AFTER UPDATE ON products
    FOR EACH ROW
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for territories
CREATE TRIGGER update_territories_timestamp 
    AFTER UPDATE ON territories
    FOR EACH ROW
BEGIN
    UPDATE territories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for employee_kpis
CREATE TRIGGER update_employee_kpis_timestamp 
    AFTER UPDATE ON employee_kpis
    FOR EACH ROW
BEGIN
    UPDATE employee_kpis SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for kpi_scores
CREATE TRIGGER update_kpi_scores_timestamp 
    AFTER UPDATE ON kpi_scores
    FOR EACH ROW
BEGIN
    UPDATE kpi_scores SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for sales_targets
CREATE TRIGGER update_sales_targets_timestamp 
    AFTER UPDATE ON sales_targets
    FOR EACH ROW
BEGIN
    UPDATE sales_targets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for performance_notes
CREATE TRIGGER update_performance_notes_timestamp 
    AFTER UPDATE ON performance_notes
    FOR EACH ROW
BEGIN
    UPDATE performance_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for market_data
CREATE TRIGGER update_market_data_timestamp 
    AFTER UPDATE ON market_data
    FOR EACH ROW
BEGIN
    UPDATE market_data SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for territory_market_shares
CREATE TRIGGER update_territory_market_shares_timestamp 
    AFTER UPDATE ON territory_market_shares
    FOR EACH ROW
BEGIN
    UPDATE territory_market_shares SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp for app_settings
CREATE TRIGGER update_app_settings_timestamp 
    AFTER UPDATE ON app_settings
    FOR EACH ROW
BEGIN
    UPDATE app_settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
END;

-- =============================================
-- 7. VIEWS FOR COMMON QUERIES
-- =============================================

-- View: Employee Performance Summary
CREATE VIEW employee_performance_summary AS
SELECT 
    e.id,
    e.name,
    e.title,
    e.department,
    e.target_acquisition_rate,
    COUNT(DISTINCT ek.id) as total_kpis,
    COUNT(DISTINCT ks.id) as scored_periods,
    AVG(CASE 
        WHEN ks.actual_value IS NOT NULL AND ek.target_value IS NOT NULL AND ek.target_value > 0
        THEN (ks.actual_value * 100.0 / ek.target_value)
        ELSE NULL
    END) as avg_performance_percentage
FROM employees e
LEFT JOIN employee_kpis ek ON e.id = ek.employee_id AND ek.is_active = 1
LEFT JOIN kpi_scores ks ON ek.id = ks.employee_kpi_id
WHERE e.is_active = 1
GROUP BY e.id, e.name, e.title, e.department, e.target_acquisition_rate;

-- View: Territory Assignment Summary
CREATE VIEW territory_assignment_summary AS
SELECT 
    t.id,
    t.name,
    t.type,
    e.name as assigned_employee_name,
    e.department as assigned_employee_department,
    COUNT(tms.id) as total_products_with_shares
FROM territories t
LEFT JOIN employees e ON t.assigned_to_employee_id = e.id
LEFT JOIN territory_market_shares tms ON t.id = tms.territory_id
WHERE t.is_active = 1
GROUP BY t.id, t.name, t.type, e.name, e.department;

-- View: Sales Performance by Period
CREATE VIEW sales_performance_by_period AS
SELECT 
    st.period,
    e.name as employee_name,
    e.department,
    p.name as product_name,
    st.target_quantity,
    st.actual_quantity,
    CASE 
        WHEN st.target_quantity > 0 
        THEN ROUND((st.actual_quantity * 100.0 / st.target_quantity), 2)
        ELSE NULL
    END as achievement_percentage,
    CASE 
        WHEN st.actual_quantity IS NOT NULL AND st.target_quantity IS NOT NULL
        THEN (st.actual_quantity * p.price)
        ELSE NULL
    END as actual_revenue
FROM sales_targets st
JOIN employees e ON st.employee_id = e.id
JOIN products p ON st.product_id = p.id
WHERE e.is_active = 1 AND p.is_active = 1;

-- =============================================
-- SCHEMA CREATION COMPLETE
-- =============================================
