@echo off
REM Building Performance Dashboard - Server Startup Script for Windows
echo 🚀 Starting Building Performance Dashboard Servers...

REM Function to check if a port is in use
:check_port
netstat -an | find ":%1" >nul 2>&1
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

REM Check if Python backend is running
call :check_port 8000
if %errorlevel% equ 0 (
    echo ✅ Python Backend (FastAPI) is already running on http://localhost:8000
) else (
    echo 🔧 Starting Python Backend...
    cd backend
    start /B python main.py
    cd ..
    echo ✅ Python Backend started
)

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Check if React frontend is running
call :check_port 3000
if %errorlevel% equ 0 (
    echo ✅ React Frontend is already running on http://localhost:3000
) else (
    echo 🔧 Starting React Frontend...
    start /B npm start
    echo ✅ React Frontend started
)

echo.
echo 🎉 Both servers are now running!
echo.
echo 📊 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo 🔐 Demo Login Credentials:
echo    Admin: admin / admin123
echo    Manager: facility_manager / fm123
echo    Tech: technician / tech123
echo    Guest: guest / guest123
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Keep the script running
pause 