# 📋 فایل Context برای هوش مصنوعی - داشبورد آنالیز فروش و مدیریت ماموریت

## 🎯 نمای کلی پروژه

این سند شامل اطلاعات جامع درباره اپلیکیشن‌های داشبورد آنالیز فروش و مدیریت ماموریت، معماری دیتابیس مشترک، تغییرات اخیر و کارهای باقی‌مانده است.

### اپلیکیشن‌ها:

1. **داشبورد آنالیز فروش** (پورت 5000/3001)
   - مسیر: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main`
   - Backend: Node.js + Express + SQLite3
   - Frontend: React + Vite
   - هدف: آنالیز فروش، ردیابی KPI، مدیریت استان‌ها

2. **اپلیکیشن مدیریت ماموریت** (پورت 2000/2001)
   - مسیر: `/home/hamidreza/App/sales-mission-manager`
   - Backend: Node.js + Express + SQLite3 (مهاجرت از sql.js)
   - Frontend: Next.js
   - ربات تلگرام: یکپارچه برای ثبت ماموریت
   - هدف: ردیابی ماموریت/وظایف، مدیریت مراکز

### دیتابیس مشترک:

- **مسیر**: `/home/hamidreza/App/sales-mission-manager/backend/data/shared.db`
- **نوع**: SQLite3 (فایل‌محور، پشتیبانی از دسترسی همزمان)
- **جداول مشترک**: `personnel`, `centers`, `center_personnel`, `organization_positions`
- **جداول ماموریت**: `mission_assignments`, `mission_contacts`, `mission_discount_codes`, `mission_audit_logs`
- **جداول آنالیز**: `analysis_employees`, `analysis_products`, `analysis_territories`, `analysis_kpi_configs`, `analysis_kpi_scores`, `analysis_employee_kpis`, `analysis_market_data`, `analysis_territory_market_shares`, `analysis_sales_targets`, `analysis_performance_notes`, `analysis_app_settings`, `analysis_activities`, `analysis_market_data`

---

## 🗄️ ساختار دیتابیس

### جداول مشترک:

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

### جداول ماموریت (پیشوند: `mission_`):

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

### جداول آنالیز (پیشوند: `analysis_`):

#### `analysis_kpi_scores`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `employeeId` INTEGER REFERENCES analysis_employees(id)
- `kpiConfigId` TEXT REFERENCES analysis_kpi_configs(id)
- `period` TEXT NOT NULL
- `score` REAL NOT NULL
- `actualValue` REAL
- `createdAt` TEXT DEFAULT CURRENT_TIMESTAMP
- `updated_at` TEXT (اضافه شده از طریق migration، بدون DEFAULT)

#### `analysis_market_data`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `productId` INTEGER REFERENCES analysis_products(id)
- `territoryId` INTEGER REFERENCES analysis_territories(id) (NULL برای ملی)
- `period` TEXT NOT NULL
- `marketShare` REAL
- `salesVolume` REAL
- `createdAt` TEXT DEFAULT CURRENT_TIMESTAMP
- `updatedAt` TEXT DEFAULT CURRENT_TIMESTAMP

---

## 🔄 تغییرات و Migration های اخیر

### 1. Migration دیتابیس (sql.js → sqlite3)

**مشکل**: اپلیکیشن مدیریت ماموریت از `sql.js` (SQLite در حافظه) استفاده می‌کرد که با دیتابیس مشترک سازگار نبود.

**راه حل**: تمام مدل‌ها و route ها به `sqlite3` (SQLite فایل‌محور) مهاجرت شدند.

**فایل‌های تغییر یافته**:
- `backend/src/config/database.js`: تغییر از `sql.js` به `sqlite3`
- تمام مدل‌ها (`Personnel.js`, `Center.js`, `Assignment.js`, `Contact.js`, `DiscountCode.js`): تبدیل عملیات synchronous به async/await
- تمام route ها: اضافه کردن async/await برای فراخوانی مدل‌ها
- `backend/src/services/telegramBot.js`: تبدیل تمام عملیات دیتابیس به async/await

### 2. راه‌اندازی دیتابیس مشترک

**مشکل**: دو اپلیکیشن نیاز به اشتراک داده‌های اصلی (personnel, centers) داشتند.

**راه حل**: ایجاد دیتابیس مشترک با رویکرد ترکیبی:
- جداول مشترک: `personnel`, `centers`, `center_personnel`, `organization_positions`
- جداول با پیشوند: `mission_*` برای مدیریت ماموریت، `analysis_*` برای آنالیز فروش

**اسکریپت‌های Migration**:
- `backend/scripts/migrate-to-shared-db.js`: ایجاد جداول مشترک و migration داده‌های اولیه
- `backend/scripts/migrate-mission-data.js`: migration داده‌های مدیریت ماموریت به shared.db
- `backend/scripts/migrate-correct-analysis-data.js`: migration داده‌های داشبورد آنالیز فروش به shared.db

### 3. اصلاح نام ستون‌ها

**مشکل**: عدم تطابق نام ستون‌ها بین کد و schema دیتابیس.

**اصلاح شده**:
- `actual_value` → `actualValue` در `analysis_kpi_scores`
- `assigned_to_employeeId` → `employeeId` در `analysis_territories`
- ستون `updated_at` به `analysis_kpi_scores` اضافه شد (بدون DEFAULT به دلیل محدودیت SQLite)

**فایل‌های تغییر یافته**:
- `backend/services/missionSync.js`
- `backend/services/statusKpiSync.js`
- `backend/config/database.js` (اضافه کردن `ensureKpiScoresUpdatedAtColumn`)

### 4. اصلاحات Market Data

**مشکل**: Market data ذخیره نمی‌شد، خطا در query ها.

**اصلاح شده**:
- تبدیل `year` به string (`yearStr = String(year)`)
- تبدیل `marketSize` به number (`marketSizeNum = parseFloat(marketSize)`)
- اصلاح handling `territoryId` (INTEGER، نه string)
- بهبود error handling در frontend و backend

**فایل‌های تغییر یافته**:
- `backend/routes/products.js`: اصلاح query های INSERT/UPDATE
- `backend/routes/data.js`: اضافه کردن `market_type` به query
- `Sales-Analysis-Dashboard-main/components/AutoTargetingView.tsx`: بهبود error handling

### 5. اصلاحات ربات تلگرام

**مشکل**: خطای `centers.slice is not a function`.

**اصلاح شده**: اضافه کردن `await` برای فراخوانی‌های `Center.getAll()`.

**فایل‌های تغییر یافته**:
- `backend/src/services/telegramBot.js`: خطوط 4112, 3322-3323

### 6. Migration قیمت محصولات

**مشکل**: قیمت‌های محصولات از دیتابیس قدیمی migrate نشده بودند.

**اصلاح شده**: اضافه کردن ستون `price` به `analysis_products` و اسکریپت migration.

**فایل‌های تغییر یافته**:
- `backend/config/database.js`: اضافه کردن `ensureProductsPriceColumn`
- `backend/scripts/fix-products-price.js`: اسکریپت migration

---

## 🐛 مشکلات شناخته شده و راه‌حل‌ها

### مشکل 1: خطاهای MissionSync

**خطا**: `SQLITE_ERROR: no such column: updated_at`

**وضعیت**: ✅ حل شده
- اضافه کردن تابع `ensureKpiScoresUpdatedAtColumn`
- ستون بدون DEFAULT اضافه شد (محدودیت SQLite)
- ردیف‌های موجود با `datetime('now')` update شدند

### مشکل 2: Market Data ذخیره نمی‌شود

**خطا**: `Failed to save market data`

**وضعیت**: ✅ حل شده
- اصلاح تبدیل نوع (`year` به string، `marketSize` به number)
- اصلاح handling `territoryId`
- بهبود پیام‌های خطا

### مشکل 3: خطای مراکز در ربات تلگرام

**خطا**: `centers.slice is not a function`

**وضعیت**: ✅ حل شده
- اضافه کردن `await` برای فراخوانی‌های async

---

## 📝 کارهای باقی‌مانده

### اولویت بالا:

1. **احراز هویت**
   - وضعیت فعلی: `currentUserId` hardcode شده
   - کار: پیاده‌سازی سیستم احراز هویت مناسب
   - فایل‌ها: Frontend authentication context، backend auth middleware

2. **تست کامل**
   - کار: تست تمام ویژگی‌های جدید بعد از migration
   - حوزه‌ها: ایجاد ماموریت، ثبت تماس، محاسبات KPI، market data

3. **مدیریت خطا**
   - کار: بهبود نمایش خطا به کاربران
   - وضعیت فعلی: alert های ساده، نیاز به UX بهتر

### اولویت متوسط:

1. **Toast Notifications**
   - کار: اضافه کردن سیستم toast notification
   - وضعیت فعلی: استفاده از `alert()`

2. **Loading States**
   - کار: بهبود loading indicators
   - وضعیت فعلی: loading state های ساده

3. **طراحی Responsive**
   - کار: پشتیبانی بهتر موبایل
   - وضعیت فعلی: طراحی responsive ساده

4. **بررسی Pagination**
   - کار: بررسی و بهبود pagination در تمام صفحات
   - وضعیت فعلی: برخی صفحات pagination دارند، نیاز به بررسی

---

## 🔧 دستورات مهم

### Restart Backend (داشبورد آنالیز فروش):

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

### Restart Backend (مدیریت ماموریت):

```bash
cd /home/hamidreza/App/sales-mission-manager/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
tail -30 ../backend.log
```

### بررسی دیتابیس:

```bash
sqlite3 /home/hamidreza/App/sales-mission-manager/backend/data/shared.db
```

### مشاهده Log ها:

```bash
# داشبورد آنالیز فروش
tail -f /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log

# مدیریت ماموریت
tail -f /home/hamidreza/App/sales-mission-manager/backend.log
```

---

## 📁 مسیرهای فایل‌های کلیدی

### داشبورد آنالیز فروش:

- Backend Config: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/config/database.js`
- Routes: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/routes/`
- Services: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend/services/`
- Frontend: `/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/Sales-Analysis-Dashboard-main/`

### مدیریت ماموریت:

- Backend Config: `/home/hamidreza/App/sales-mission-manager/backend/src/config/database.js`
- Models: `/home/hamidreza/App/sales-mission-manager/backend/src/models/`
- Routes: `/home/hamidreza/App/sales-mission-manager/backend/src/routes/`
- ربات تلگرام: `/home/hamidreza/App/sales-mission-manager/backend/src/services/telegramBot.js`
- Frontend: `/home/hamidreza/App/sales-mission-manager/frontend/`

### دیتابیس:

- دیتابیس مشترک: `/home/hamidreza/App/sales-mission-manager/backend/data/shared.db`
- اسکریپت‌های Migration: `/home/hamidreza/App/sales-mission-manager/backend/scripts/`

---

## ⚠️ نکات مهم

1. **دسترسی دیتابیس**: هر دو اپلیکیشن از همان فایل `shared.db` استفاده می‌کنند. SQLite3 از خواندن همزمان پشتیبانی می‌کند اما نوشتن serialized است.

2. **نام‌گذاری ستون‌ها**: 
   - جداول مشترک از camelCase استفاده می‌کنند: `employeeId`, `actualValue`, `createdAt`
   - برخی جداول آنالیز از snake_case استفاده می‌کنند: `updated_at` (به دلیل محدودیت‌های SQLite)

3. **Async/Await**: تمام عملیات دیتابیس اکنون async هستند. همیشه از `await` هنگام فراخوانی متدهای مدل استفاده کنید.

4. **پیشوند جداول**: 
   - جداول ماموریت: `mission_*`
   - جداول آنالیز: `analysis_*`
   - جداول مشترک: بدون پیشوند

5. **Foreign Keys**: محدودیت‌های foreign key فعال هستند (`PRAGMA foreign_keys = ON`).

6. **WAL Mode**: دیتابیس از WAL mode برای concurrency بهتر استفاده می‌کند (`PRAGMA journal_mode = WAL`).

---

## 🔍 نکات Debugging

1. **بررسی Log ها**: همیشه ابتدا log های backend را بررسی کنید
2. **Schema دیتابیس**: از `PRAGMA table_info(table_name)` برای بررسی نام ستون‌ها استفاده کنید
3. **Foreign Keys**: در صورت خطای INSERT، محدودیت‌های foreign key را بررسی کنید
4. **Type Mismatches**: از صحت نوع‌ها اطمینان حاصل کنید (INTEGER vs TEXT و غیره)
5. **مشکلات Async**: برای `await` های گم‌شده بررسی کنید

---

## 📚 فایل‌های مستندات مرتبط

- `MIGRATION_SUMMARY.md`: خلاصه migration
- `MIGRATION_FIX_SUMMARY.md`: اصلاحات migration
- `ARCHITECTURE_PROPOSAL.md`: معماری دیتابیس مشترک
- `DATABASE_STRUCTURE.md`: جزئیات ساختار دیتابیس
- `FIXES_SUMMARY.md`: خلاصه اصلاحات اخیر
- `MARKET_DATA_DEBUG.md`: Debugging market data
- `MISSIONSYNC_FIX.md`: اصلاحات MissionSync
- `UPDATED_AT_FIX_V2.md`: اصلاح ستون updated_at

---

## 🚀 مراحل بعدی

1. تکمیل پیاده‌سازی احراز هویت
2. اضافه کردن error handling جامع
3. پیاده‌سازی toast notifications
4. بهبود loading states
5. تست کامل تمام ویژگی‌ها
6. بررسی و بهبود pagination
7. بهبود responsive موبایل

---

**آخرین به‌روزرسانی**: 2024-01-XX
**نگهداری شده توسط**: AI Assistant
**نسخه**: 1.0

