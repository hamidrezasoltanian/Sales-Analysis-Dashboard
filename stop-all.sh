#!/bin/bash

PROJECT_DIR="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"

echo "🛑 Stopping Sales Dashboard..."
echo ""

# Stop Backend
if [ -f "$PROJECT_DIR/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend process not found (PID: $BACKEND_PID)"
    fi
    rm "$PROJECT_DIR/backend.pid"
else
    echo "⚠️  Backend PID file not found"
fi

# Stop Frontend
if [ -f "$PROJECT_DIR/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_DIR/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend process not found (PID: $FRONTEND_PID)"
    fi
    rm "$PROJECT_DIR/frontend.pid"
else
    echo "⚠️  Frontend PID file not found"
fi

# Kill any remaining node processes for this project
echo ""
echo "🧹 Cleaning up any remaining processes..."
pkill -f "node.*server.js" 2>/dev/null && echo "✅ Killed node server processes"
pkill -f "vite.*6000" 2>/dev/null && echo "✅ Killed vite processes"

# Check if ports are free
echo ""
echo "🔍 Checking ports..."
if ! ss -tuln | grep -q ":6000 "; then
    echo "✅ Port 6000 is free"
else
    echo "⚠️  Port 6000 is still in use"
fi

if ! ss -tuln | grep -q ":6001 "; then
    echo "✅ Port 6001 is free"
else
    echo "⚠️  Port 6001 is still in use"
fi

echo ""
echo "✅ All services stopped!"

