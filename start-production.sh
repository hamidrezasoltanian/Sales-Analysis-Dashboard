#!/bin/bash
################################################################################
# Sales Dashboard - Production Start Script
# اسکریپت راه‌اندازی production با auto-start
################################################################################

PROJECT_ROOT="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/Sales-Analysis-Dashboard-main"
LOGS_DIR="$PROJECT_ROOT/logs"
BACKEND_PID_FILE="$PROJECT_ROOT/backend.pid"
FRONTEND_PID_FILE="$PROJECT_ROOT/frontend.pid"

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# ایجاد پوشه‌های لازم
create_directories() {
    mkdir -p "$LOGS_DIR"
    mkdir -p "$PROJECT_ROOT/backups"
    mkdir -p "$BACKEND_DIR/uploads"
}

# بررسی وضعیت سرویس‌ها
check_status() {
    local backend_running=false
    local frontend_running=false
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE")
        if ps -p "$backend_pid" > /dev/null 2>&1; then
            backend_running=true
            echo -e "${GREEN}✓${NC} Backend در حال اجرا است (PID: $backend_pid, Port: 6001)"
        else
            echo -e "${RED}✗${NC} Backend متوقف است (PID قدیمی: $backend_pid)"
        fi
    else
        echo -e "${RED}✗${NC} Backend متوقف است"
    fi
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE")
        if ps -p "$frontend_pid" > /dev/null 2>&1; then
            frontend_running=true
            echo -e "${GREEN}✓${NC} Frontend در حال اجرا است (PID: $frontend_pid, Port: 6000)"
        else
            echo -e "${RED}✗${NC} Frontend متوقف است (PID قدیمی: $frontend_pid)"
        fi
    else
        echo -e "${RED}✗${NC} Frontend متوقف است"
    fi
    
    echo ""
    echo -e "${CYAN}دسترسی به اپلیکیشن:${NC}"
    if [ "$frontend_running" = true ]; then
        echo -e "  🌐 Frontend: ${GREEN}http://localhost:6000${NC}"
    else
        echo -e "  🌐 Frontend: ${RED}غیرفعال${NC}"
    fi
    
    if [ "$backend_running" = true ]; then
        echo -e "  🔧 Backend:  ${GREEN}http://localhost:6001${NC}"
        echo -e "  ❤️  Health:   ${GREEN}http://localhost:6001/health${NC}"
    else
        echo -e "  🔧 Backend:  ${RED}غیرفعال${NC}"
    fi
}

# شروع Backend
start_backend() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_warning "Backend در حال حاضر در حال اجرا است (PID: $pid)"
            return 0
        else
            rm -f "$BACKEND_PID_FILE"
        fi
    fi
    
    log_info "شروع Backend (Port: 6001)..."
    
    cd "$BACKEND_DIR" || return 1
    
    # بررسی وجود node_modules
    if [ ! -d "node_modules" ]; then
        log_info "نصب dependencies برای Backend..."
        npm install --production
    fi
    
    # راه‌اندازی Backend
    nohup node server.js > "$LOGS_DIR/backend.log" 2>&1 &
    local PID=$!
    echo $PID > "$BACKEND_PID_FILE"
    
    sleep 3
    
    if ps -p $PID > /dev/null 2>&1; then
        log_success "Backend با موفقیت راه‌اندازی شد (PID: $PID)"
        
        # بررسی health endpoint
        sleep 2
        if curl -s http://localhost:6001/health > /dev/null 2>&1; then
            log_success "Backend health check موفق بود ✓"
        else
            log_warning "Backend health check ناموفق بود"
        fi
        return 0
    else
        log_error "خطا در راه‌اندازی Backend"
        rm -f "$BACKEND_PID_FILE"
        return 1
    fi
}

# شروع Frontend
start_frontend() {
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_warning "Frontend در حال حاضر در حال اجرا است (PID: $pid)"
            return 0
        else
            rm -f "$FRONTEND_PID_FILE"
        fi
    fi
    
    log_info "شروع Frontend (Port: 6000)..."
    
    cd "$FRONTEND_DIR" || return 1
    
    # بررسی وجود node_modules
    if [ ! -d "node_modules" ]; then
        log_info "نصب dependencies برای Frontend..."
        npm install
    fi
    
    # راه‌اندازی Frontend
    nohup npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
    local PID=$!
    echo $PID > "$FRONTEND_PID_FILE"
    
    sleep 5
    
    if ps -p $PID > /dev/null 2>&1; then
        log_success "Frontend با موفقیت راه‌اندازی شد (PID: $PID)"
        return 0
    else
        log_error "خطا در راه‌اندازی Frontend"
        rm -f "$FRONTEND_PID_FILE"
        return 1
    fi
}

# توقف Backend
stop_backend() {
    if [ ! -f "$BACKEND_PID_FILE" ]; then
        log_info "Backend در حال اجرا نیست"
        return 0
    fi
    
    local PID=$(cat "$BACKEND_PID_FILE")
    
    if ps -p $PID > /dev/null 2>&1; then
        log_info "توقف Backend (PID: $PID)..."
        kill -TERM $PID
        
        # انتظار برای توقف graceful
        local count=0
        while ps -p $PID > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            ((count++))
        done
        
        # اگر هنوز در حال اجرا است، force kill
        if ps -p $PID > /dev/null 2>&1; then
            log_warning "Force stopping Backend..."
            kill -9 $PID
        fi
        
        log_success "Backend متوقف شد"
    else
        log_info "Backend PID قدیمی دارد، پاک می‌شود"
    fi
    
    rm -f "$BACKEND_PID_FILE"
}

# توقف Frontend
stop_frontend() {
    if [ ! -f "$FRONTEND_PID_FILE" ]; then
        log_info "Frontend در حال اجرا نیست"
        return 0
    fi
    
    local PID=$(cat "$FRONTEND_PID_FILE")
    
    if ps -p $PID > /dev/null 2>&1; then
        log_info "توقف Frontend (PID: $PID)..."
        
        # پیدا کردن و کشتن تمام پروسه‌های فرزند
        pkill -P $PID 2>/dev/null
        kill -TERM $PID
        
        local count=0
        while ps -p $PID > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            ((count++))
        done
        
        if ps -p $PID > /dev/null 2>&1; then
            log_warning "Force stopping Frontend..."
            kill -9 $PID
        fi
        
        log_success "Frontend متوقف شد"
    else
        log_info "Frontend PID قدیمی دارد، پاک می‌شود"
    fi
    
    rm -f "$FRONTEND_PID_FILE"
}

# راه‌اندازی کامل
start_all() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║   Sales Dashboard - Production Start                  ║"
    echo "║   راه‌اندازی داشبورد فروش در حالت Production          ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    create_directories
    
    log_info "شروع راه‌اندازی سرویس‌ها..."
    
    # شروع Backend
    if ! start_backend; then
        log_error "خطا در راه‌اندازی Backend"
        return 1
    fi
    
    # شروع Frontend
    if ! start_frontend; then
        log_error "خطا در راه‌اندازی Frontend"
        stop_backend
        return 1
    fi
    
    echo ""
    log_success "🎉 تمام سرویس‌ها با موفقیت راه‌اندازی شدند!"
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║      دسترسی به اپلیکیشن:             ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  🌐 Frontend: http://localhost:6000  ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  🔧 Backend:  http://localhost:6001  ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ❤️  Health:   http://localhost:6001/health  ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    # اجرای بک‌آپ اولیه
    log_info "ایجاد بک‌آپ اولیه..."
    "$PROJECT_ROOT/backup-system.sh" database > /dev/null 2>&1
    
    log_success "✓ سیستم آماده استفاده است"
}

# توقف کامل
stop_all() {
    echo -e "${YELLOW}توقف سرویس‌ها...${NC}\n"
    
    stop_frontend
    stop_backend
    
    log_success "تمام سرویس‌ها متوقف شدند"
}

# ری‌استارت
restart_all() {
    log_info "Restart سرویس‌ها..."
    stop_all
    sleep 2
    start_all
}

# نمایش لاگ‌ها
show_logs() {
    local service="${1:-all}"
    
    case "$service" in
        backend)
            tail -f "$LOGS_DIR/backend.log"
            ;;
        frontend)
            tail -f "$LOGS_DIR/frontend.log"
            ;;
        all|*)
            tail -f "$LOGS_DIR/backend.log" "$LOGS_DIR/frontend.log"
            ;;
    esac
}

# منوی اصلی
case "${1:-start}" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    status)
        echo -e "${CYAN}وضعیت سرویس‌ها:${NC}\n"
        check_status
        ;;
    logs)
        show_logs "${2:-all}"
        ;;
    backup)
        "$PROJECT_ROOT/backup-system.sh" "${2:-database}"
        ;;
    restore)
        "$PROJECT_ROOT/restore-backup.sh"
        ;;
    *)
        echo "استفاده: $0 {start|stop|restart|status|logs|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  start     - راه‌اندازی تمام سرویس‌ها"
        echo "  stop      - توقف تمام سرویس‌ها"
        echo "  restart   - ری‌استارت تمام سرویس‌ها"
        echo "  status    - نمایش وضعیت سرویس‌ها"
        echo "  logs      - نمایش لاگ‌ها [backend|frontend|all]"
        echo "  backup    - ایجاد بک‌آپ [database|full|all]"
        echo "  restore   - بازیابی بک‌آپ"
        exit 1
        ;;
esac





