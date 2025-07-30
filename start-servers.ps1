# Building Performance Dashboard - Server Startup Script for Windows PowerShell
Write-Host "🚀 Starting Building Performance Dashboard Servers..." -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    }
    catch {
        return $false
    }
}

# Check if Python backend is running
if (Test-Port 8000) {
    Write-Host "✅ Python Backend (FastAPI) is already running on http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host "🔧 Starting Python Backend..." -ForegroundColor Yellow
    Set-Location backend
    Start-Process -FilePath "python" -ArgumentList "main.py" -WindowStyle Hidden
    Set-Location ..
    Write-Host "✅ Python Backend started" -ForegroundColor Green
}

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Check if React frontend is running
if (Test-Port 3000) {
    Write-Host "✅ React Frontend is already running on http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "🔧 Starting React Frontend..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Hidden
    Write-Host "✅ React Frontend started" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Both servers are now running!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Demo Login Credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin / admin123" -ForegroundColor White
Write-Host "   Manager: facility_manager / fm123" -ForegroundColor White
Write-Host "   Tech: technician / tech123" -ForegroundColor White
Write-Host "   Guest: guest / guest123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
Write-Host ""

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "Shutting down servers..." -ForegroundColor Yellow
} 