#!/bin/bash
################################################################################
# Sales Dashboard - Restore Backup Script
# اسکریپت بازیابی بک‌آپ
################################################################################

PROJECT_ROOT="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"
DATABASE_PATH="$PROJECT_ROOT/database/sales_dashboard.db"
BACKUP_ROOT="$PROJECT_ROOT/backups"

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# لیست بک‌آپ‌های موجود
list_backups() {
    echo -e "${BLUE}📋 بک‌آپ‌های موجود:${NC}\n"
    
    if [ ! -d "$BACKUP_ROOT/database" ]; then
        log_error "پوشه بک‌آپ پیدا نشد"
        return 1
    fi
    
    local BACKUPS=($(find "$BACKUP_ROOT/database" -name "*.gz" -type f -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-))
    
    if [ ${#BACKUPS[@]} -eq 0 ]; then
        log_warning "هیچ بک‌آپی یافت نشد"
        return 1
    fi
    
    local i=1
    for backup in "${BACKUPS[@]}"; do
        local filename=$(basename "$backup")
        local size=$(du -h "$backup" | cut -f1)
        local date=$(stat -c %y "$backup" | cut -d'.' -f1)
        echo -e "$i) $filename"
        echo -e "   📅 تاریخ: $date"
        echo -e "   💾 حجم: $size"
        echo ""
        ((i++))
    done
    
    echo "${#BACKUPS[@]}"
}

# بازیابی بک‌آپ
restore_backup() {
    local BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "فایل بک‌آپ پیدا نشد: $BACKUP_FILE"
        return 1
    fi
    
    log_warning "⚠️  هشدار: این عملیات دیتابیس فعلی را جایگزین می‌کند!"
    echo -n "آیا مطمئن هستید؟ (yes/no): "
    read -r CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        log_info "عملیات لغو شد"
        return 0
    fi
    
    log_info "ایجاد بک‌آپ از دیتابیس فعلی قبل از بازیابی..."
    local SAFETY_BACKUP="$DATABASE_PATH.before_restore.$(date +%Y%m%d_%H%M%S)"
    cp "$DATABASE_PATH" "$SAFETY_BACKUP"
    log_success "بک‌آپ ایمنی ایجاد شد: $SAFETY_BACKUP"
    
    log_info "شروع بازیابی..."
    
    # استخراج فایل فشرده
    local TEMP_FILE="/tmp/sales_dashboard_restore_$$.db"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    
    if [ $? -ne 0 ]; then
        log_error "خطا در استخراج فایل بک‌آپ"
        rm -f "$TEMP_FILE"
        return 1
    fi
    
    # جایگزینی دیتابیس
    mv "$TEMP_FILE" "$DATABASE_PATH"
    
    if [ $? -eq 0 ]; then
        log_success "✅ بازیابی با موفقیت انجام شد!"
        log_info "دیتابیس به حالت زمان بک‌آپ بازگردانده شد"
        log_info "بک‌آپ ایمنی در: $SAFETY_BACKUP"
        return 0
    else
        log_error "خطا در جایگزینی دیتابیس"
        # بازگردانی بک‌آپ ایمنی
        if [ -f "$SAFETY_BACKUP" ]; then
            cp "$SAFETY_BACKUP" "$DATABASE_PATH"
            log_info "دیتابیس به حالت قبل بازگردانده شد"
        fi
        return 1
    fi
}

# منوی اصلی
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║   Sales Dashboard - Restore Backup                    ║"
    echo "║   بازیابی بک‌آپ داشبورد فروش                         ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    local BACKUP_COUNT=$(list_backups)
    
    if [ $BACKUP_COUNT -eq 0 ]; then
        exit 1
    fi
    
    echo -n "شماره بک‌آپ مورد نظر برای بازیابی (0 برای لغو): "
    read -r CHOICE
    
    if [ "$CHOICE" = "0" ]; then
        log_info "عملیات لغو شد"
        exit 0
    fi
    
    if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt $BACKUP_COUNT ]; then
        log_error "انتخاب نامعتبر"
        exit 1
    fi
    
    local BACKUPS=($(find "$BACKUP_ROOT/database" -name "*.gz" -type f -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-))
    local SELECTED_BACKUP="${BACKUPS[$((CHOICE-1))]}"
    
    echo ""
    log_info "بک‌آپ انتخاب شده: $(basename "$SELECTED_BACKUP")"
    
    restore_backup "$SELECTED_BACKUP"
}

# اجرای برنامه
if [ "$1" = "--file" ] && [ -n "$2" ]; then
    restore_backup "$2"
else
    main
fi





