#!/bin/bash

# Sales Dashboard Startup Script

echo "🚀 Starting Sales Dashboard Services..."

# Kill any existing processes
pkill -f "Sales-Analysis.*server.js" 2>/dev/null
pkill -f "Sales-Analysis.*vite" 2>/dev/null
sleep 2

# Start Backend
echo "📡 Starting Sales Backend on port 3001..."
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
node server.js > /tmp/sales-backend-startup.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Start Frontend
echo "🌐 Starting Sales Frontend on port 5000..."
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/Sales-Analysis-Dashboard-main
npm run dev > /tmp/sales-frontend-startup.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Save PIDs
echo $BACKEND_PID > /tmp/sales-backend.pid
echo $FRONTEND_PID > /tmp/sales-frontend.pid

echo "✅ Sales Dashboard started successfully!"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:5000"

