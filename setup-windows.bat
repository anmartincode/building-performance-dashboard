@echo off
REM Building Performance Dashboard - Windows Setup Script
echo 🏗️ Setting up Building Performance Dashboard for Windows...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    echo Please install npm (usually comes with Node.js)
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Install Python dependencies
echo 🔧 Installing Python dependencies...
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..

REM Install Node.js dependencies
echo 🔧 Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Setup database
echo 🗄️ Setting up database...
cd backend
python setup_database.py
if %errorlevel% neq 0 (
    echo ❌ Failed to setup database
    echo Please make sure MySQL is installed and running
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo 🚀 To start the servers, run one of the following:
echo    - start-servers.bat (Command Prompt)
echo    - start-servers.ps1 (PowerShell)
echo.
echo 📊 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:8000
echo.
pause 