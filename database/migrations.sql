-- =============================================
-- Sales Management Dashboard - Migration Scripts
-- Version: 1.0
-- Description: Database migration management system
-- =============================================

-- =============================================
-- Migration Tracking Table
-- =============================================

CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT
);

-- =============================================
-- Migration 001: Initial Schema
-- =============================================

-- Check if migration 001 has been applied
INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('001', 'Initial database schema creation', 'a1b2c3d4e5f6');

-- =============================================
-- Migration 002: Add User Management
-- =============================================

-- Check if migration 002 has been applied
INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('002', 'Add user management tables', 'b2c3d4e5f6g7');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (username IS NOT NULL AND length(username) > 0),
    CHECK (email IS NOT NULL AND length(email) > 0),
    CHECK (password_hash IS NOT NULL AND length(password_hash) > 0)
);

-- Create user_employees junction table
CREATE TABLE IF NOT EXISTS user_employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    
    UNIQUE (user_id, employee_id)
);

-- Add indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Add indexes for user_employees
CREATE INDEX IF NOT EXISTS idx_user_employees_user ON user_employees(user_id);
CREATE INDEX IF NOT EXISTS idx_user_employees_employee ON user_employees(employee_id);

-- =============================================
-- Migration 003: Add Notification System
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('003', 'Add notification system', 'c3d4e5f6g7h8');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT 0,
    action_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (title IS NOT NULL AND length(title) > 0),
    CHECK (message IS NOT NULL AND length(message) > 0)
);

-- Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    title_template TEXT NOT NULL,
    message_template TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (name IS NOT NULL AND length(name) > 0),
    CHECK (title_template IS NOT NULL AND length(title_template) > 0),
    CHECK (message_template IS NOT NULL AND length(message_template) > 0)
);

-- Add indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Add indexes for notification_templates
CREATE INDEX IF NOT EXISTS idx_notification_templates_name ON notification_templates(name);
CREATE INDEX IF NOT EXISTS idx_notification_templates_active ON notification_templates(is_active);

-- =============================================
-- Migration 004: Add File Management
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('004', 'Add file management system', 'd4e5f6g7h8i9');

-- Create files table
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'document', 'spreadsheet', 'other')),
    uploaded_by INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (filename IS NOT NULL AND length(filename) > 0),
    CHECK (original_filename IS NOT NULL AND length(original_filename) > 0),
    CHECK (file_path IS NOT NULL AND length(file_path) > 0),
    CHECK (file_size > 0)
);

-- Create file_attachments table for linking files to other entities
CREATE TABLE IF NOT EXISTS file_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('employee', 'product', 'territory', 'report')),
    entity_id TEXT NOT NULL,
    attachment_type TEXT NOT NULL DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    
    CHECK (entity_type IS NOT NULL AND length(entity_type) > 0),
    CHECK (entity_id IS NOT NULL AND length(entity_id) > 0)
);

-- Add indexes for files
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_active ON files(is_active);

-- Add indexes for file_attachments
CREATE INDEX IF NOT EXISTS idx_file_attachments_file ON file_attachments(file_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_entity ON file_attachments(entity_type, entity_id);

-- =============================================
-- Migration 005: Add Reporting System
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('005', 'Add advanced reporting system', 'e5f6g7h8i9j0');

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'sales', 'territory', 'custom')),
    query_template TEXT NOT NULL,
    parameters TEXT, -- JSON format for report parameters
    created_by INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (name IS NOT NULL AND length(name) > 0),
    CHECK (query_template IS NOT NULL AND length(query_template) > 0)
);

-- Create report_executions table for tracking report runs
CREATE TABLE IF NOT EXISTS report_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    executed_by INTEGER NOT NULL,
    parameters TEXT, -- JSON format
    execution_time_ms INTEGER,
    result_count INTEGER,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (executed_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for reports
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_active ON reports(is_active);

-- Add indexes for report_executions
CREATE INDEX IF NOT EXISTS idx_report_executions_report ON report_executions(report_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_executed_by ON report_executions(executed_by);
CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status);

-- =============================================
-- Migration 006: Add Workflow Management
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('006', 'Add workflow and approval system', 'f6g7h8i9j0k1');

-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    workflow_type TEXT NOT NULL CHECK (workflow_type IN ('approval', 'notification', 'automation')),
    is_active BOOLEAN DEFAULT 1,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (name IS NOT NULL AND length(name) > 0)
);

-- Create workflow_steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,
    step_order INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    step_type TEXT NOT NULL CHECK (step_type IN ('approval', 'notification', 'data_update')),
    assigned_to INTEGER,
    conditions TEXT, -- JSON format for step conditions
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    
    CHECK (step_name IS NOT NULL AND length(step_name) > 0),
    CHECK (step_order > 0)
);

-- Create workflow_instances table
CREATE TABLE IF NOT EXISTS workflow_instances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    current_step_id INTEGER,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'failed')),
    initiated_by INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (current_step_id) REFERENCES workflow_steps(id) ON DELETE SET NULL,
    FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (entity_type IS NOT NULL AND length(entity_type) > 0),
    CHECK (entity_id IS NOT NULL AND length(entity_id) > 0)
);

-- Add indexes for workflows
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(is_active);

-- Add indexes for workflow_steps
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_order ON workflow_steps(workflow_id, step_order);

-- Add indexes for workflow_instances
CREATE INDEX IF NOT EXISTS idx_workflow_instances_workflow ON workflow_instances(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_status ON workflow_instances(status);

-- =============================================
-- Migration 007: Add API Management
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('007', 'Add API key management', 'g7h8i9j0k1l2');

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name TEXT NOT NULL,
    key_value TEXT NOT NULL UNIQUE,
    permissions TEXT NOT NULL, -- JSON format for permissions
    created_by INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    last_used DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (key_name IS NOT NULL AND length(key_name) > 0),
    CHECK (key_value IS NOT NULL AND length(key_value) > 0)
);

-- Create api_usage_logs table
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id INTEGER NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
    
    CHECK (endpoint IS NOT NULL AND length(endpoint) > 0),
    CHECK (method IS NOT NULL AND length(method) > 0),
    CHECK (status_code >= 100 AND status_code < 600)
);

-- Add indexes for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_by ON api_keys(created_by);

-- Add indexes for api_usage_logs
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);

-- =============================================
-- Migration 008: Add Backup and Recovery
-- =============================================

INSERT OR IGNORE INTO migrations (version, description, checksum) 
VALUES ('008', 'Add backup and recovery system', 'h8i9j0k1l2m3');

-- Create backups table
CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_name TEXT NOT NULL,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential')),
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    CHECK (backup_name IS NOT NULL AND length(backup_name) > 0),
    CHECK (file_path IS NOT NULL AND length(file_path) > 0),
    CHECK (file_size > 0)
);

-- Create restore_logs table
CREATE TABLE IF NOT EXISTS restore_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_id INTEGER NOT NULL,
    restored_by INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    error_message TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    
    FOREIGN KEY (backup_id) REFERENCES backups(id) ON DELETE CASCADE,
    FOREIGN KEY (restored_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for backups
CREATE INDEX IF NOT EXISTS idx_backups_type ON backups(backup_type);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);
CREATE INDEX IF NOT EXISTS idx_backups_created_by ON backups(created_by);

-- Add indexes for restore_logs
CREATE INDEX IF NOT EXISTS idx_restore_logs_backup ON restore_logs(backup_id);
CREATE INDEX IF NOT EXISTS idx_restore_logs_status ON restore_logs(status);

-- =============================================
-- Migration Utility Functions
-- =============================================

-- Function to check if migration has been applied
CREATE VIEW IF NOT EXISTS migration_status AS
SELECT 
    m.version,
    m.description,
    m.applied_at,
    CASE 
        WHEN m.version IS NOT NULL THEN 'Applied'
        ELSE 'Pending'
    END as status
FROM migrations m
ORDER BY m.version;

-- =============================================
-- MIGRATIONS COMPLETE
-- =============================================
