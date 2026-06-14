#!/bin/bash
################################################################################
# Sales Dashboard - Automatic Backup System
# این اسکریپت بک‌آپ خودکار از دیتابیس و فایل‌های مهم ایجاد می‌کند
################################################################################

# تنظیمات
PROJECT_ROOT="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"
DATABASE_PATH="$PROJECT_ROOT/database/sales_dashboard.db"
BACKUP_ROOT="$PROJECT_ROOT/backups"
RETENTION_DAYS=30
MAX_BACKUPS=100

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع لاگ
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# ایجاد ساختار پوشه‌ها
create_backup_structure() {
    log_info "ایجاد ساختار پوشه‌های بک‌آپ..."
    
    mkdir -p "$BACKUP_ROOT"/{daily,weekly,monthly,database,full}
    mkdir -p "$PROJECT_ROOT/logs/backups"
    
    log_success "ساختار پوشه‌ها ایجاد شد"
}

# بک‌آپ دیتابیس
backup_database() {
    local TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    local BACKUP_DIR="$BACKUP_ROOT/database"
    local BACKUP_FILE="$BACKUP_DIR/sales_dashboard_${TIMESTAMP}.db"
    local BACKUP_LOG="$PROJECT_ROOT/logs/backups/database_${TIMESTAMP}.log"
    
    log_info "شروع بک‌آپ دیتابیس..."
    
    # بررسی وجود دیتابیس
    if [ ! -f "$DATABASE_PATH" ]; then
        log_error "فایل دیتابیس پیدا نشد: $DATABASE_PATH"
        return 1
    fi
    
    # بک‌آپ دیتابیس با sqlite3
    if command -v sqlite3 &> /dev/null; then
        sqlite3 "$DATABASE_PATH" ".backup '$BACKUP_FILE'" 2> "$BACKUP_LOG"
        
        if [ $? -eq 0 ]; then
            # فشرده‌سازی بک‌آپ
            gzip "$BACKUP_FILE"
            
            local SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
            log_success "بک‌آپ دیتابیس با موفقیت انجام شد (حجم: $SIZE)"
            echo "${BACKUP_FILE}.gz" >> "$BACKUP_ROOT/database/backup_list.txt"
            return 0
        else
            log_error "خطا در بک‌آپ دیتابیس. لاگ: $BACKUP_LOG"
            return 1
        fi
    else
        # بک‌آپ ساده با cp
        cp "$DATABASE_PATH" "$BACKUP_FILE"
        gzip "$BACKUP_FILE"
        log_success "بک‌آپ دیتابیس با cp انجام شد"
        return 0
    fi
}

# بک‌آپ کامل پروژه
backup_full() {
    local TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    local BACKUP_FILE="$BACKUP_ROOT/full/full_backup_${TIMESTAMP}.tar.gz"
    
    log_info "شروع بک‌آپ کامل پروژه..."
    
    cd "$PROJECT_ROOT" || return 1
    
    # بک‌آپ کامل با استثنای node_modules و فایل‌های موقت
    tar -czf "$BACKUP_FILE" \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='*.pid' \
        --exclude='backups' \
        --exclude='Sales-Analysis-Dashboard-main/node_modules' \
        --exclude='Sales-Analysis-Dashboard-main/dist' \
        --exclude='backend/node_modules' \
        . 2>/dev/null
    
    if [ $? -eq 0 ]; then
        local SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_success "بک‌آپ کامل با موفقیت انجام شد (حجم: $SIZE)"
        return 0
    else
        log_error "خطا در ایجاد بک‌آپ کامل"
        return 1
    fi
}

# پاک‌سازی بک‌آپ‌های قدیمی
cleanup_old_backups() {
    log_info "شروع پاک‌سازی بک‌آپ‌های قدیمی (قدیمی‌تر از $RETENTION_DAYS روز)..."
    
    local DELETED_COUNT=0
    
    # پاک کردن بک‌آپ‌های دیتابیس قدیمی
    find "$BACKUP_ROOT/database" -name "*.gz" -type f -mtime +$RETENTION_DAYS -print0 | while IFS= read -r -d '' file; do
        rm -f "$file"
        ((DELETED_COUNT++))
        log_info "حذف شد: $(basename "$file")"
    done
    
    # پاک کردن بک‌آپ‌های کامل قدیمی
    find "$BACKUP_ROOT/full" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -print0 | while IFS= read -r -d '' file; do
        rm -f "$file"
        ((DELETED_COUNT++))
        log_info "حذف شد: $(basename "$file")"
    done
    
    # محدود کردن تعداد بک‌آپ‌ها
    local BACKUP_COUNT=$(find "$BACKUP_ROOT/database" -name "*.gz" | wc -l)
    if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
        log_warning "تعداد بک‌آپ‌ها بیش از حد مجاز ($MAX_BACKUPS) است"
        find "$BACKUP_ROOT/database" -name "*.gz" -type f -printf '%T@ %p\n' | \
            sort -n | head -n -$MAX_BACKUPS | cut -d' ' -f2- | xargs rm -f
    fi
    
    log_success "پاک‌سازی بک‌آپ‌های قدیمی انجام شد"
}

# نمایش آمار بک‌آپ
show_backup_stats() {
    log_info "آمار بک‌آپ‌ها:"
    
    echo -e "\n${BLUE}📊 آمار بک‌آپ‌های دیتابیس:${NC}"
    local DB_COUNT=$(find "$BACKUP_ROOT/database" -name "*.gz" | wc -l)
    local DB_SIZE=$(du -sh "$BACKUP_ROOT/database" 2>/dev/null | cut -f1)
    echo -e "  تعداد: $DB_COUNT"
    echo -e "  حجم کل: $DB_SIZE"
    
    if [ $DB_COUNT -gt 0 ]; then
        echo -e "\n  جدیدترین بک‌آپ:"
        find "$BACKUP_ROOT/database" -name "*.gz" -type f -printf '%T@ %p\n' | \
            sort -rn | head -1 | awk '{print "  - " $2 " (" strftime("%Y-%m-%d %H:%M:%S", $1) ")"}'
    fi
    
    echo -e "\n${BLUE}📦 آمار بک‌آپ‌های کامل:${NC}"
    local FULL_COUNT=$(find "$BACKUP_ROOT/full" -name "*.tar.gz" 2>/dev/null | wc -l)
    local FULL_SIZE=$(du -sh "$BACKUP_ROOT/full" 2>/dev/null | cut -f1)
    echo -e "  تعداد: $FULL_COUNT"
    echo -e "  حجم کل: $FULL_SIZE"
    
    echo -e "\n${BLUE}💾 حجم کل بک‌آپ‌ها:${NC}"
    local TOTAL_SIZE=$(du -sh "$BACKUP_ROOT" 2>/dev/null | cut -f1)
    echo -e "  $TOTAL_SIZE"
    echo ""
}

# تابع اصلی
main() {
    local BACKUP_TYPE="${1:-database}"
    
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║   Sales Dashboard - Automatic Backup System           ║"
    echo "║   سیستم بک‌آپ خودکار داشبورد فروش                    ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    create_backup_structure
    
    case "$BACKUP_TYPE" in
        database|db)
            backup_database
            ;;
        full)
            backup_database
            backup_full
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        stats)
            show_backup_stats
            ;;
        all)
            backup_database
            backup_full
            cleanup_old_backups
            show_backup_stats
            ;;
        *)
            log_error "نوع بک‌آپ نامعتبر: $BACKUP_TYPE"
            echo "استفاده: $0 [database|full|cleanup|stats|all]"
            exit 1
            ;;
    esac
    
    log_success "عملیات بک‌آپ با موفقیت انجام شد"
}

# اجرای برنامه
main "$@"





