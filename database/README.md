# Sales Management Dashboard - Database Documentation

## Overview

This database schema is designed for a comprehensive sales management dashboard system that tracks employee performance, sales targets, territory management, and market analysis.

## Database Structure

### Core Entities

#### 1. Employees (کارمندان)
- **Purpose**: Stores basic employee information
- **Key Fields**: name, title, department, target_acquisition_rate
- **Relationships**: One-to-many with territories, KPIs, sales targets

#### 2. Products (محصولات)
- **Purpose**: Product catalog management
- **Key Fields**: name, price, description
- **Relationships**: One-to-many with sales targets, market data

#### 3. Territories (مناطق)
- **Purpose**: Geographic and medical center management
- **Key Fields**: name, type (province/medical_center), assigned_to_employee_id
- **Relationships**: Many-to-one with employees, one-to-many with market shares

### Performance & Targets

#### 4. KPI_Configs (تنظیمات KPI)
- **Purpose**: Defines KPI types and calculation formulas
- **Key Fields**: name, max_points, formula
- **Formulas**: goal_achievement, direct_penalty, conversion_from_leads

#### 5. Employee_KPIs (KPI های کارمندان)
- **Purpose**: Assigns KPIs to employees with targets
- **Key Fields**: employee_id, kpi_config_id, target_value
- **Relationships**: Many-to-one with employees and KPI configs

#### 6. KPI_Scores (امتیازات KPI)
- **Purpose**: Records actual performance scores
- **Key Fields**: employee_kpi_id, period, actual_value
- **Relationships**: Many-to-one with employee KPIs

#### 7. Sales_Targets (اهداف فروش)
- **Purpose**: Sales targets and actual performance
- **Key Fields**: employee_id, product_id, period, target_quantity, actual_quantity
- **Relationships**: Many-to-one with employees and products

#### 8. Performance_Notes (یادداشت‌های عملکرد)
- **Purpose**: Manager notes for each employee per period
- **Key Fields**: employee_id, period, note_text
- **Relationships**: Many-to-one with employees

### Market & Configurations

#### 9. Market_Data (داده‌های بازار)
- **Purpose**: Market size data by product and year
- **Key Fields**: product_id, year, market_size, market_type
- **Types**: national (provinces), tehran (medical centers)

#### 10. Territory_Market_Shares (سهم بازار مناطق)
- **Purpose**: Market share percentages by territory and product
- **Key Fields**: territory_id, product_id, share_percentage
- **Relationships**: Many-to-one with territories and products

#### 11. App_Settings (تنظیمات برنامه)
- **Purpose**: Application configuration storage
- **Key Fields**: key, value (JSON format)
- **Usage**: Theme, card size, sales config, etc.

## Advanced Features

### User Management
- **Users**: User accounts with roles (admin, manager, user)
- **User_Employees**: Links users to employee records
- **Sessions**: User session management

### Notification System
- **Notifications**: User notifications
- **Notification_Templates**: Reusable notification templates

### File Management
- **Files**: File storage metadata
- **File_Attachments**: Links files to entities

### Reporting System
- **Reports**: Custom report definitions
- **Report_Executions**: Report execution tracking

### Workflow Management
- **Workflows**: Workflow definitions
- **Workflow_Steps**: Individual workflow steps
- **Workflow_Instances**: Active workflow instances

### API Management
- **API_Keys**: API key management
- **API_Usage_Logs**: API usage tracking

### Backup & Recovery
- **Backups**: Backup records
- **Restore_Logs**: Restore operation logs

## Key Views

### Performance Views
- `employee_performance_calculated`: Calculated performance scores
- `territory_performance_summary`: Territory performance metrics
- `monthly_performance_report`: Monthly performance reports
- `sales_performance_report`: Sales performance analysis

### Analytics Views
- `system_statistics`: System-wide statistics
- `performance_trends`: Performance trend analysis
- `data_export_summary`: Data export information

### Utility Views
- `orphaned_records`: Data integrity checks
- `migration_status`: Migration tracking

## Data Integrity

### Constraints
- Foreign key constraints ensure referential integrity
- Check constraints validate data ranges and formats
- Unique constraints prevent duplicate records

### Triggers
- Automatic timestamp updates on record modifications
- Data validation triggers for critical operations
- Audit logging for important changes

### Indexes
- Performance-optimized indexes on frequently queried columns
- Composite indexes for complex queries
- Covering indexes for common access patterns

## Security Features

### Data Protection
- Password hashing for user accounts
- API key management with expiration
- Session management with timeout

### Audit Trail
- Comprehensive audit logging
- Change tracking for critical data
- User activity monitoring

## Performance Optimization

### Database Design
- Normalized structure reduces redundancy
- Proper indexing improves query performance
- Partitioned views for large datasets

### Query Optimization
- Materialized views for complex calculations
- Efficient joins and subqueries
- Optimized aggregation functions

## Backup Strategy

### Automated Backups
- Full database backups
- Incremental backups for changes
- Backup verification and testing

### Recovery Procedures
- Point-in-time recovery
- Data restoration procedures
- Disaster recovery planning

## Migration Management

### Version Control
- Migration tracking system
- Rollback capabilities
- Schema versioning

### Data Migration
- Safe data transformation
- Validation procedures
- Error handling and recovery

## Usage Examples

### Basic Queries

```sql
-- Get employee performance for a period
SELECT * FROM employee_performance_calculated 
WHERE period = 'خرداد 1404';

-- Get sales targets by employee
SELECT e.name, p.name as product, st.target_quantity, st.actual_quantity
FROM sales_targets st
JOIN employees e ON st.employee_id = e.id
JOIN products p ON st.product_id = p.id
WHERE st.period = 'خرداد 1404';

-- Get territory assignments
SELECT t.name as territory, e.name as employee, e.department
FROM territories t
LEFT JOIN employees e ON t.assigned_to_employee_id = e.id
WHERE t.is_active = 1;
```

### Advanced Analytics

```sql
-- Performance trends over time
SELECT period, avg_achievement_percentage, employees_achieving_targets
FROM performance_trends
ORDER BY period;

-- Sales performance by product
SELECT product_name, 
       SUM(target_quantity) as total_targets,
       SUM(actual_quantity) as total_actuals,
       AVG(achievement_percentage) as avg_achievement
FROM sales_performance_report
GROUP BY product_name;
```

## Maintenance

### Regular Tasks
- Update statistics and indexes
- Clean up old audit logs
- Verify data integrity
- Monitor performance metrics

### Monitoring
- Database size monitoring
- Query performance tracking
- Error log analysis
- User activity monitoring

## Troubleshooting

### Common Issues
- Foreign key constraint violations
- Data type mismatches
- Performance bottlenecks
- Index fragmentation

### Solutions
- Data validation procedures
- Performance tuning guidelines
- Error handling strategies
- Recovery procedures

---

This database schema provides a robust foundation for a comprehensive sales management system with advanced features for performance tracking, territory management, and business intelligence.
