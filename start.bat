@echo off
REM Sales Dashboard Full Stack Startup Script for Windows
REM This script starts both backend and frontend servers

echo 🚀 Starting Sales Dashboard Full Stack Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

REM Function to start backend
:start_backend
echo 📦 Starting Backend Server...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📥 Installing backend dependencies...
    npm install
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo ⚙️ Creating .env file...
    copy env.example .env
    echo ⚠️ Please update .env file with your configuration
)

REM Start backend server
echo 🔧 Starting backend on port 8000...
start "Backend Server" cmd /k "npm run dev"
cd ..

REM Function to start frontend
:start_frontend
echo 🎨 Starting Frontend Server...
cd Sales-Analysis-Dashboard-main

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📥 Installing frontend dependencies...
    npm install
)

REM Start frontend server
echo 🎨 Starting frontend on port 8001...
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 Sales Dashboard is starting up!
echo 📊 Backend API: http://localhost:8000
echo 🎨 Frontend: http://localhost:8001
echo 📝 Logs: ./logs/
echo.
echo Press any key to exit...
pause >nul
