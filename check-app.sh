#!/bin/bash
################################################################################
# بررسی سریع وضعیت اپلیکیشن
################################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  بررسی وضعیت Sales Dashboard         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# بررسی Backend
echo -e "${BLUE}🔧 Backend (Port 6001):${NC}"
if curl -s http://localhost:6001/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ در حال اجرا${NC}"
    curl -s http://localhost:6001/health | python3 -m json.tool 2>/dev/null
else
    echo -e "  ${RED}✗ در دسترس نیست${NC}"
fi
echo ""

# بررسی Frontend
echo -e "${BLUE}🌐 Frontend (Port 6000):${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6000)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "  ${GREEN}✓ در حال اجرا (HTTP $HTTP_CODE)${NC}"
else
    echo -e "  ${RED}✗ در دسترس نیست${NC}"
fi
echo ""

# نمایش آدرس‌ها
echo -e "${CYAN}📍 آدرس‌های دسترسی:${NC}"
echo -e "  ${GREEN}Local:${NC}    http://localhost:6000"
echo -e "  ${GREEN}Network:${NC}  http://192.168.4.29:6000"
echo ""

# بررسی پروسه‌ها
echo -e "${CYAN}⚙️  پروسه‌ها:${NC}"
BACKEND_PID=$(cat /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.pid 2>/dev/null)
FRONTEND_PID=$(cat /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/frontend.pid 2>/dev/null)

if [ -n "$BACKEND_PID" ] && ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Backend:  PID $BACKEND_PID"
else
    echo -e "  ${RED}✗${NC} Backend:  متوقف"
fi

if [ -n "$FRONTEND_PID" ] && ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Frontend: PID $FRONTEND_PID"
else
    echo -e "  ${RED}✗${NC} Frontend: متوقف"
fi
echo ""

# راهنما
echo -e "${YELLOW}💡 دستورات مفید:${NC}"
echo -e "  مشاهده وضعیت: ./start-production.sh status"
echo -e "  مشاهده لاگ‌ها: ./start-production.sh logs"
echo -e "  ری‌استارت:    ./start-production.sh restart"





