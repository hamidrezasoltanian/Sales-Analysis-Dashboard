#!/bin/bash

PROJECT_DIR="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Sales Dashboard Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Backend
echo "🔍 Backend (Port 6001):"
if [ -f "$PROJECT_DIR/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "   Status: ✅ Running (PID: $BACKEND_PID)"
        if curl -s http://localhost:6001/health > /dev/null 2>&1; then
            echo "   Health: ✅ Healthy"
        else
            echo "   Health: ⚠️  Not responding"
        fi
    else
        echo "   Status: ❌ Not running (stale PID file)"
    fi
else
    echo "   Status: ❌ Not running"
fi

echo ""

# Check Frontend
echo "🎨 Frontend (Port 6000):"
if [ -f "$PROJECT_DIR/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_DIR/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "   Status: ✅ Running (PID: $FRONTEND_PID)"
        if curl -s http://localhost:6000 > /dev/null 2>&1; then
            echo "   Health: ✅ Responding"
        else
            echo "   Health: ⚠️  Not responding"
        fi
    else
        echo "   Status: ❌ Not running (stale PID file)"
    fi
else
    echo "   Status: ❌ Not running"
fi

echo ""

# Check ports
echo "🔌 Port Status:"
if ss -tuln | grep -q ":6000 "; then
    echo "   Port 6000: ✅ In use"
else
    echo "   Port 6000: ❌ Free"
fi

if ss -tuln | grep -q ":6001 "; then
    echo "   Port 6001: ✅ In use"
else
    echo "   Port 6001: ❌ Free"
fi

echo ""

# URLs
echo "🌐 URLs:"
echo "   Backend:  http://localhost:6001"
echo "   Frontend: http://localhost:6000"
NETWORK_IP=$(hostname -I | awk '{print $1}')
if [ -n "$NETWORK_IP" ]; then
    echo "   Network:  http://$NETWORK_IP:6000"
fi

echo ""

# Logs
echo "📝 Logs:"
if [ -d "$PROJECT_DIR/logs" ]; then
    if [ -f "$PROJECT_DIR/logs/backend.log" ]; then
        BACKEND_LOG_SIZE=$(du -h "$PROJECT_DIR/logs/backend.log" | cut -f1)
        echo "   Backend:  $PROJECT_DIR/logs/backend.log ($BACKEND_LOG_SIZE)"
    fi
    if [ -f "$PROJECT_DIR/logs/frontend.log" ]; then
        FRONTEND_LOG_SIZE=$(du -h "$PROJECT_DIR/logs/frontend.log" | cut -f1)
        echo "   Frontend: $PROJECT_DIR/logs/frontend.log ($FRONTEND_LOG_SIZE)"
    fi
else
    echo "   No logs directory found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"







