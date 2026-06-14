#!/bin/bash

# Sales Dashboard Full Stack Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting Sales Dashboard Full Stack Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Function to start backend
start_backend() {
    echo "📦 Starting Backend Server..."
    cd backend
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing backend dependencies..."
        npm install
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "⚙️ Creating .env file..."
        cp env.example .env
        echo "⚠️ Please update .env file with your configuration"
    fi
    
    # Start backend server
    echo "🔧 Starting backend on port 8000..."
    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    cd Sales-Analysis-Dashboard-main
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend server
    echo "🎨 Starting frontend on port 8001..."
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    cd ..
}

# Function to stop servers
stop_servers() {
    echo "🛑 Stopping servers..."
    
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm logs/backend.pid
        echo "✅ Backend stopped"
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm logs/frontend.pid
        echo "✅ Frontend stopped"
    fi
}

# Function to check server status
check_status() {
    echo "📊 Checking server status..."
    
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            echo "✅ Backend is running (PID: $BACKEND_PID)"
        else
            echo "❌ Backend is not running"
        fi
    else
        echo "❌ Backend is not running"
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            echo "✅ Frontend is running (PID: $FRONTEND_PID)"
        else
            echo "❌ Frontend is not running"
        fi
    else
        echo "❌ Frontend is not running"
    fi
}

# Handle command line arguments
case "$1" in
    start)
        start_backend
        sleep 3  # Wait for backend to start
        start_frontend
        echo ""
        echo "🎉 Sales Dashboard is starting up!"
        echo "📊 Backend API: http://localhost:8000"
        echo "🎨 Frontend: http://localhost:8001"
        echo "📝 Logs: ./logs/"
        echo ""
        echo "Press Ctrl+C to stop all servers"
        
        # Wait for user interrupt
        trap stop_servers INT
        wait
        ;;
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 2
        start_backend
        sleep 3
        start_frontend
        echo "🔄 Servers restarted"
        ;;
    status)
        check_status
        ;;
    logs)
        echo "📝 Showing logs..."
        echo "Backend logs:"
        tail -f logs/backend.log
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both backend and frontend servers"
        echo "  stop    - Stop all servers"
        echo "  restart - Restart all servers"
        echo "  status  - Check server status"
        echo "  logs    - Show backend logs"
        exit 1
        ;;
esac
