#!/bin/bash
################################################################################
# Sales Dashboard - Auto-start Installation Script
# اسکریپت نصب سیستم auto-start
################################################################################

PROJECT_ROOT="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"
SERVICE_FILE="$PROJECT_ROOT/sales-dashboard.service"
SYSTEMD_DIR="/etc/systemd/system"
CRON_BACKUP_SCHEDULE="0 */6 * * *"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# بررسی دسترسی root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "این اسکریپت نیاز به دسترسی root دارد"
        echo "لطفاً با sudo اجرا کنید: sudo $0"
        exit 1
    fi
}

# نصب systemd service
install_systemd() {
    log_info "نصب systemd service..."
    
    if [ ! -f "$SERVICE_FILE" ]; then
        log_error "فایل service پیدا نشد: $SERVICE_FILE"
        return 1
    fi
    
    # کپی فایل service
    cp "$SERVICE_FILE" "$SYSTEMD_DIR/sales-dashboard.service"
    
    # تنظیم permissions
    chmod 644 "$SYSTEMD_DIR/sales-dashboard.service"
    
    # reload systemd
    systemctl daemon-reload
    
    # فعال‌سازی service
    systemctl enable sales-dashboard.service
    
    log_success "systemd service با موفقیت نصب شد"
    
    echo ""
    echo "دستورات مفید:"
    echo "  شروع:    sudo systemctl start sales-dashboard"
    echo "  توقف:    sudo systemctl stop sales-dashboard"
    echo "  ری‌استارت: sudo systemctl restart sales-dashboard"
    echo "  وضعیت:  sudo systemctl status sales-dashboard"
    echo "  لاگ‌ها:  sudo journalctl -u sales-dashboard -f"
    echo ""
}

# نصب cron job برای بک‌آپ خودکار
install_backup_cron() {
    log_info "نصب cron job برای بک‌آپ خودکار..."
    
    local BACKUP_SCRIPT="$PROJECT_ROOT/backup-system.sh"
    local CRON_COMMAND="$CRON_BACKUP_SCHEDULE $BACKUP_SCRIPT database >> $PROJECT_ROOT/logs/backup-cron.log 2>&1"
    
    # بررسی وجود cron job قبلی
    crontab -u hamidreza -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"
    if [ $? -eq 0 ]; then
        log_warning "cron job قبلاً نصب شده است"
        return 0
    fi
    
    # اضافه کردن cron job
    (crontab -u hamidreza -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -u hamidreza -
    
    log_success "cron job برای بک‌آپ خودکار نصب شد"
    log_info "زمان‌بندی: هر 6 ساعت یکبار"
    
    # نمایش cron jobs
    echo ""
    log_info "cron jobs فعلی:"
    crontab -u hamidreza -l | grep sales-dashboard
    echo ""
}

# نصب بک‌آپ هفتگی و ماهانه
install_advanced_backup() {
    log_info "تنظیم بک‌آپ‌های پیشرفته..."
    
    local BACKUP_SCRIPT="$PROJECT_ROOT/backup-system.sh"
    
    # بک‌آپ هفتگی (یکشنبه‌ها ساعت 2 صبح)
    local WEEKLY_CRON="0 2 * * 0 $BACKUP_SCRIPT full >> $PROJECT_ROOT/logs/backup-weekly.log 2>&1"
    
    # بک‌آپ پاک‌سازی (روزانه ساعت 3 صبح)
    local CLEANUP_CRON="0 3 * * * $BACKUP_SCRIPT cleanup >> $PROJECT_ROOT/logs/backup-cleanup.log 2>&1"
    
    # اضافه کردن به crontab
    (crontab -u hamidreza -l 2>/dev/null | grep -v "$BACKUP_SCRIPT"; \
     echo "# Sales Dashboard Automatic Backups"; \
     echo "$CRON_BACKUP_SCHEDULE $BACKUP_SCRIPT database >> $PROJECT_ROOT/logs/backup-cron.log 2>&1"; \
     echo "$WEEKLY_CRON"; \
     echo "$CLEANUP_CRON"; \
     echo "") | crontab -u hamidreza -
    
    log_success "بک‌آپ‌های پیشرفته تنظیم شد:"
    echo "  📅 روزانه هر 6 ساعت: بک‌آپ دیتابیس"
    echo "  📅 هفتگی (یکشنبه 2 صبح): بک‌آپ کامل"
    echo "  🗑️  روزانه (3 صبح): پاک‌سازی بک‌آپ‌های قدیمی"
}

# حذف auto-start
uninstall() {
    log_warning "حذف auto-start و cron jobs..."
    
    # توقف و غیرفعال کردن service
    systemctl stop sales-dashboard.service 2>/dev/null
    systemctl disable sales-dashboard.service 2>/dev/null
    
    # حذف service file
    rm -f "$SYSTEMD_DIR/sales-dashboard.service"
    systemctl daemon-reload
    
    # حذف cron jobs
    crontab -u hamidreza -l 2>/dev/null | grep -v "sales-dashboard" | grep -v "$PROJECT_ROOT" | crontab -u hamidreza -
    
    log_success "auto-start حذف شد"
}

# تست سیستم
test_system() {
    log_info "تست سیستم..."
    
    # تست اسکریپت production
    if [ ! -x "$PROJECT_ROOT/start-production.sh" ]; then
        log_error "اسکریپت production قابل اجرا نیست"
        return 1
    fi
    
    # تست اسکریپت بک‌آپ
    if [ ! -x "$PROJECT_ROOT/backup-system.sh" ]; then
        log_error "اسکریپت بک‌آپ قابل اجرا نیست"
        return 1
    fi
    
    # تست دیتابیس
    if [ ! -f "$PROJECT_ROOT/database/sales_dashboard.db" ]; then
        log_warning "دیتابیس پیدا نشد"
    fi
    
    log_success "تست‌های اولیه موفق بود"
}

# منوی اصلی
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║   Sales Dashboard - Auto-start Installation           ║"
    echo "║   نصب سیستم راه‌اندازی خودکار                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    case "${1:-install}" in
        install)
            check_root
            test_system
            echo ""
            install_systemd
            install_advanced_backup
            echo ""
            log_success "🎉 نصب کامل شد!"
            echo ""
            log_info "برای شروع سرویس:"
            echo "  sudo systemctl start sales-dashboard"
            echo ""
            log_info "سرویس به صورت خودکار با بوت سیستم اجرا می‌شود"
            ;;
        uninstall)
            check_root
            uninstall
            ;;
        test)
            test_system
            ;;
        *)
            echo "استفاده: $0 {install|uninstall|test}"
            echo ""
            echo "Commands:"
            echo "  install   - نصب auto-start و cron jobs"
            echo "  uninstall - حذف auto-start و cron jobs"
            echo "  test      - تست سیستم"
            exit 1
            ;;
    esac
}

main "$@"





