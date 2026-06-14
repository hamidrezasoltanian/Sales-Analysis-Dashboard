# Auto Startup Script for Sales Dashboard
# This script automatically starts both backend and frontend servers

Write-Host "🚀 Starting Sales Dashboard Auto Setup..." -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to wait for server to be ready
function Wait-ForServer {
    param([int]$Port, [string]$Name)
    Write-Host "⏳ Waiting for $Name to start on port $Port..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        if (Test-Port -Port $Port) {
            Write-Host "✅ $Name is ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        $attempt++
        Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    }
    
    Write-Host "❌ $Name failed to start after $maxAttempts attempts" -ForegroundColor Red
    return $false
}

# Kill any existing processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "D:\Sales-Analysis-Dashboard-main\backend" -PassThru -WindowStyle Hidden

# Wait for backend to be ready
if (Wait-ForServer -Port 8000 -Name "Backend") {
    Write-Host "✅ Backend is running on http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
    exit 1
}

# Test authentication
Write-Host "🔐 Testing authentication..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"password"}'
    Write-Host "✅ Authentication working!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test data endpoint
Write-Host "📊 Testing data endpoint..." -ForegroundColor Cyan
try {
    $dataResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/data" -Method GET
    Write-Host "✅ Data endpoint working!" -ForegroundColor Green
    Write-Host "Employees: $($dataResponse.employees.Count)" -ForegroundColor Gray
    Write-Host "Products: $($dataResponse.products.Count)" -ForegroundColor Gray
    Write-Host "Provinces: $($dataResponse.provinces.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Data endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start Frontend
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "D:\Sales-Analysis-Dashboard-main\Sales-Analysis-Dashboard-main" -PassThru -WindowStyle Hidden

# Wait for frontend to be ready
if (Wait-ForServer -Port 8001 -Name "Frontend") {
    Write-Host "✅ Frontend is running on http://localhost:8001" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend failed to start" -ForegroundColor Red
    Write-Host "You can manually start it with: cd Sales-Analysis-Dashboard-main; npm run dev" -ForegroundColor Yellow
}

# Final status
Write-Host ""
Write-Host "🎉 Sales Dashboard Setup Complete!" -ForegroundColor Green
Write-Host "📊 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:8001" -ForegroundColor Cyan
Write-Host "🔍 Health Check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Process IDs:" -ForegroundColor Yellow
Write-Host "Backend PID: $($backendProcess.Id)" -ForegroundColor Gray
Write-Host "Frontend PID: $($frontendProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep script running and handle cleanup
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Check if processes are still running
        if ($backendProcess.HasExited) {
            Write-Host "❌ Backend process has stopped" -ForegroundColor Red
            break
        }
        
        if ($frontendProcess.HasExited) {
            Write-Host "❌ Frontend process has stopped" -ForegroundColor Red
            break
        }
    }
} finally {
    Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
    if (!$backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    if (!$frontendProcess.HasExited) {
        $frontendProcess.Kill()
    }
    Write-Host "✅ Servers stopped" -ForegroundColor Green
}
