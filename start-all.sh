#!/bin/bash

PROJECT_DIR="/home/hamidreza/Downloads/Sales-Analysis-Dashboard-main"
LOG_DIR="$PROJECT_DIR/logs"

# Create logs directory
mkdir -p "$LOG_DIR"

# Stop any existing instances
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite.*6000" 2>/dev/null
sleep 2

# Start Backend
echo "🚀 Starting Backend..."
cd "$PROJECT_DIR/backend"
nohup node server.js > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_DIR/backend.pid"
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:6001/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed, but continuing..."
fi

# Start Frontend
echo "🎨 Starting Frontend..."
cd "$PROJECT_DIR/Sales-Analysis-Dashboard-main"
nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PROJECT_DIR/frontend.pid"
echo "✅ Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sales Dashboard is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Backend API: http://localhost:6001"
echo "🎨 Frontend UI: http://localhost:6000"
echo "🌐 Network URL: http://$(hostname -I | awk '{print $1}'):6000"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f $LOG_DIR/backend.log"
echo "   Frontend: tail -f $LOG_DIR/frontend.log"
echo ""
echo "🛑 To stop: $PROJECT_DIR/stop-all.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

