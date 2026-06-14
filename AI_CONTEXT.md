# 📋 Context File for AI - Sales Analysis Dashboard & Mission Management

## 🎯 Project Overview

This document provides comprehensive context about the Sales Analysis Dashboard and Mission Management applications, their shared database architecture, recent changes, and remaining tasks.

### Applications:

1. **Sales Analysis Dashboard** (Port 5000/3001)
   - Path: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main`
   - Backend: Node.js + Express + SQLite3
   - Frontend: React + Vite
   - Purpose: Sales analytics, KPI tracking, territory management

2. **Mission Management App** (Port 2000/2001)
   - Path: `/home/hamidreza/App/sales-mission-manager`
   - Backend: Node.js + Express + SQLite3 (migrated from sql.js)
   - Frontend: Next.js
   - Telegram Bot: Integrated for mission registration
   - Purpose: Mission/assignment tracking, center management

### Shared Database:

- **Path**: `/home/hamidreza/App/sales-mission-manager/backend/data/shared.db`
- **Type**: SQLite3 (file-based, supports concurrent access)
- **Shared Tables**: `personnel`, `centers`, `center_personnel`, `organization_positions`
- **Mission Tables**: `mission_assignments`, `mission_contacts`, `mission_discount_codes`, `mission_audit_logs`
- **Analysis Tables**: `analysis_employees`, `analysis_products`, `analysis_territories`, `analysis_kpi_configs`, `analysis_kpi_scores`, `analysis_employee_kpis`, `analysis_market_data`, `analysis_territory_market_shares`, `analysis_sales_targets`, `analysis_performance_notes`, `analysis_app_settings`, `analysis_activities`, `analysis_market_data`

---

## 🗄️ Database Schema

### Shared Tables:

#### `personnel`
- `id` INTEGER PRIMARY KEY
- `first_name` TEXT
- `last_name` TEXT
- `name` TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) VIRTUAL
- `phone` TEXT
- `telegram_id` TEXT UNIQUE
- `role` TEXT (admin, manager, staff)
- `isActive` INTEGER
- `createdAt` TEXT
- `updatedAt` TEXT

#### `centers`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `type` TEXT (lead, opportunity, customer, old_customer)
- `address` TEXT
- `city` TEXT
- `province` TEXT
- `responsiblePersonnelId` INTEGER REFERENCES personnel(id)
- `isActive` INTEGER
- `createdAt` TEXT
- `updatedAt` TEXT
- `tags` TEXT DEFAULT '[]'

#### `center_personnel`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `centerId` INTEGER REFERENCES centers(id)
- `personnelId` INTEGER REFERENCES personnel(id)
- `position` TEXT REFERENCES organization_positions(name)
- `createdAt` TEXT

#### `organization_positions`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT UNIQUE NOT NULL
- `createdAt` TEXT

### Mission-Specific Tables (prefix: `mission_`):

#### `mission_assignments`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `personnelId` INTEGER REFERENCES personnel(id)
- `centerId` INTEGER REFERENCES centers(id)
- `status` TEXT (pending, approved, rejected, completed)
- `managerId` INTEGER REFERENCES personnel(id)
- `approvedAt` TEXT
- `completedAt` TEXT
- `snapLocationLatitude` REAL
- `snapLocationLongitude` REAL
- `snapLocationAddress` TEXT
- `snapCost` REAL
- `discountCode` TEXT
- `discountCodeId` INTEGER REFERENCES mission_discount_codes(id)
- `notes` TEXT
- `centerNotes` TEXT
- `managerComment` TEXT
- `createdAt` TEXT
- `updatedAt` TEXT

#### `mission_contacts`
- Similar structure to assignments but for contact tracking

#### `mission_discount_codes`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `code` TEXT UNIQUE NOT NULL
- `discountPercentage` REAL
- `isActive` INTEGER
- `createdAt` TEXT
- `updatedAt` TEXT

### Analysis-Specific Tables (prefix: `analysis_`):

#### `analysis_kpi_scores`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `employeeId` INTEGER REFERENCES analysis_employees(id)
- `kpiConfigId` TEXT REFERENCES analysis_kpi_configs(id)
- `period` TEXT NOT NULL
- `score` REAL NOT NULL
- `actualValue` REAL
- `createdAt` TEXT DEFAULT CURRENT_TIMESTAMP
- `updated_at` TEXT (added via migration, no default)

#### `analysis_market_data`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `productId` INTEGER REFERENCES analysis_products(id)
- `territoryId` INTEGER REFERENCES analysis_territories(id) (NULL for national)
- `period` TEXT NOT NULL
- `marketShare` REAL
- `salesVolume` REAL
- `createdAt` TEXT DEFAULT CURRENT_TIMESTAMP
- `updatedAt` TEXT DEFAULT CURRENT_TIMESTAMP

---

## 🔄 Recent Changes & Migrations

### 1. Database Migration (sql.js → sqlite3)

**Problem**: Mission Management app was using `sql.js` (in-memory SQLite), incompatible with shared database.

**Solution**: Migrated all models and routes to use `sqlite3` (file-based native SQLite).

**Files Changed**:
- `backend/src/config/database.js`: Changed from `sql.js` to `sqlite3`
- All models (`Personnel.js`, `Center.js`, `Assignment.js`, `Contact.js`, `DiscountCode.js`): Converted synchronous operations to async/await
- All routes: Added async/await for model calls
- `backend/src/services/telegramBot.js`: Converted all database operations to async/await

### 2. Shared Database Setup

**Problem**: Two applications needed to share core data (personnel, centers).

**Solution**: Created shared database with hybrid approach:
- Shared tables: `personnel`, `centers`, `center_personnel`, `organization_positions`
- Prefixed tables: `mission_*` for Mission Management, `analysis_*` for Sales Analysis

**Migration Scripts**:
- `backend/scripts/migrate-to-shared-db.js`: Creates shared tables and migrates initial data
- `backend/scripts/migrate-mission-data.js`: Migrates Mission Management data to shared.db
- `backend/scripts/migrate-correct-analysis-data.js`: Migrates Sales Analysis Dashboard data to shared.db

### 3. Column Name Fixes

**Problem**: Column name mismatches between code and database schema.

**Fixed**:
- `actual_value` → `actualValue` in `analysis_kpi_scores`
- `assigned_to_employeeId` → `employeeId` in `analysis_territories`
- `updated_at` column added to `analysis_kpi_scores` (without DEFAULT due to SQLite limitation)

**Files Changed**:
- `backend/services/missionSync.js`
- `backend/services/statusKpiSync.js`
- `backend/config/database.js` (added `ensureKpiScoresUpdatedAtColumn`)

### 4. Market Data Fixes

**Problem**: Market data not saving, errors in queries.

**Fixed**:
- Convert `year` to string (`yearStr = String(year)`)
- Convert `marketSize` to number (`marketSizeNum = parseFloat(marketSize)`)
- Fixed `territoryId` handling (INTEGER, not string)
- Improved error handling in frontend and backend

**Files Changed**:
- `backend/routes/products.js`: Fixed INSERT/UPDATE queries
- `backend/routes/data.js`: Added `market_type` to query
- `Sales-Analysis-Dashboard-main/components/AutoTargetingView.tsx`: Improved error handling

### 5. Telegram Bot Fixes

**Problem**: `centers.slice is not a function` error.

**Fixed**: Added missing `await` for `Center.getAll()` calls.

**Files Changed**:
- `backend/src/services/telegramBot.js`: Lines 4112, 3322-3323

### 6. Product Price Migration

**Problem**: Product prices not migrated from old database.

**Fixed**: Added `price` column to `analysis_products` and migration script.

**Files Changed**:
- `backend/config/database.js`: Added `ensureProductsPriceColumn`
- `backend/scripts/fix-products-price.js`: Migration script

---

## 🐛 Known Issues & Solutions

### Issue 1: MissionSync Errors

**Error**: `SQLITE_ERROR: no such column: updated_at`

**Status**: ✅ Fixed
- Added `ensureKpiScoresUpdatedAtColumn` function
- Column added without DEFAULT (SQLite limitation)
- Existing rows updated with `datetime('now')`

### Issue 2: Market Data Not Saving

**Error**: `Failed to save market data`

**Status**: ✅ Fixed
- Fixed type conversions (`year` to string, `marketSize` to number)
- Fixed `territoryId` handling
- Improved error messages

### Issue 3: Telegram Bot Centers Error

**Error**: `centers.slice is not a function`

**Status**: ✅ Fixed
- Added missing `await` for async calls

---

## 📝 Remaining Tasks

### High Priority:

1. **Authentication**
   - Current: `currentUserId` is hardcoded
   - Task: Implement proper authentication system
   - Files: Frontend authentication context, backend auth middleware

2. **Full Testing**
   - Task: Test all new features after migration
   - Areas: Mission creation, contact registration, KPI calculations, market data

3. **Error Management**
   - Task: Improve error display to users
   - Current: Basic alerts, need better UX

### Medium Priority:

1. **Toast Notifications**
   - Task: Add toast notification system
   - Current: Using `alert()`

2. **Loading States**
   - Task: Improve loading indicators
   - Current: Basic loading states

3. **Responsive Design**
   - Task: Better mobile support
   - Current: Basic responsive design

4. **Pagination Review**
   - Task: Review and improve pagination across all pages
   - Current: Some pages have pagination, needs review

---

## 🔧 Important Commands

### Restart Backend (Sales Analysis Dashboard):

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

### Restart Backend (Mission Management):

```bash
cd /home/hamidreza/App/sales-mission-manager/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

### Check Database:

```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db
```

### View Logs:

```bash
# Sales Analysis Dashboard
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log

# Mission Management
tail -f /home/hamidreza/App/sales-mission-manager/backend.log
```

---

## 📁 Key File Locations

### Sales Analysis Dashboard:

- Backend Config: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/config/database.js`
- Routes: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/routes/`
- Services: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/services/`
- Frontend: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/Sales-Analysis-Dashboard-main/`

### Mission Management:

- Backend Config: `/home/hamidreza/App/sales-mission-manager/backend/src/config/database.js`
- Models: `/home/hamidreza/App/sales-mission-manager/backend/src/models/`
- Routes: `/home/hamidreza/App/sales-mission-manager/backend/src/routes/`
- Telegram Bot: `/home/hamidreza/App/sales-mission-manager/backend/src/services/telegramBot.js`
- Frontend: `/home/hamidreza/App/sales-mission-manager/frontend/`

### Database:

- Shared DB: `/home/hamidreza/App/sales-mission-manager/backend/data/shared.db`
- Migration Scripts: `/home/hamidreza/App/sales-mission-manager/backend/scripts/`

---

## ⚠️ Important Notes

1. **Database Access**: Both applications use the same `shared.db` file. SQLite3 supports concurrent reads but writes are serialized.

2. **Column Naming**: 
   - Shared tables use camelCase: `employeeId`, `actualValue`, `createdAt`
   - Some analysis tables use snake_case: `updated_at` (due to SQLite limitations)

3. **Async/Await**: All database operations are now async. Always use `await` when calling model methods.

4. **Table Prefixes**: 
   - Mission tables: `mission_*`
   - Analysis tables: `analysis_*`
   - Shared tables: no prefix

5. **Foreign Keys**: Foreign key constraints are enabled (`PRAGMA foreign_keys = ON`).

6. **WAL Mode**: Database uses WAL mode for better concurrency (`PRAGMA journal_mode = WAL`).

---

## 🔍 Debugging Tips

1. **Check Logs**: Always check backend logs first
2. **Database Schema**: Use `PRAGMA table_info(table_name)` to check column names
3. **Foreign Keys**: Check foreign key constraints if INSERT fails
4. **Type Mismatches**: Ensure correct types (INTEGER vs TEXT, etc.)
5. **Async Issues**: Check for missing `await` keywords

---

## 📚 Related Documentation Files

- `MIGRATION_SUMMARY.md`: Detailed migration summary
- `MIGRATION_FIX_SUMMARY.md`: Migration fixes
- `ARCHITECTURE_PROPOSAL.md`: Shared database architecture
- `DATABASE_STRUCTURE.md`: Database structure details
- `FIXES_SUMMARY.md`: Recent fixes summary
- `MARKET_DATA_DEBUG.md`: Market data debugging
- `MISSIONSYNC_FIX.md`: MissionSync fixes
- `UPDATED_AT_FIX_V2.md`: Updated_at column fix

---

## 🚀 Next Steps

1. Complete authentication implementation
2. Add comprehensive error handling
3. Implement toast notifications
4. Improve loading states
5. Test all features thoroughly
6. Review and improve pagination
7. Enhance mobile responsiveness

---

**Last Updated**: 2024-01-XX
**Maintained By**: AI Assistant
**Version**: 1.0

