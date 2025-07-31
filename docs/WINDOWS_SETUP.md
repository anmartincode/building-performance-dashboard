# Windows Setup Guide

This comprehensive guide will help you set up the Building Performance Dashboard on Windows 10/11.

## Prerequisites

- Windows 10 or 11
- Git for Windows
- Python 3.8 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher

## Quick Start (Automated Setup)

### Option 1: Automated Setup Script (Recommended)

1. **Clone the repository**
   ```cmd
   git clone <repository-url>
   cd building-performance-dashboard
   ```

2. **Run the automated setup**
   ```cmd
   scripts\setup-windows.bat
   ```

3. **Start the application**
   ```cmd
   scripts\start-servers.bat
   ```

### Option 2: PowerShell Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd building-performance-dashboard
   ```

2. **Run the automated setup**
   ```powershell
   .\scripts\setup-windows.bat
   ```

3. **Start the application**
   ```powershell
   .\scripts\start-servers.ps1
   ```

## Manual Setup

### Step 1: Install Required Software

#### 1.1 Install Python
1. Download Python from [python.org](https://www.python.org/downloads/)
2. During installation, check "Add Python to PATH"
3. Verify installation:
   ```cmd
   python --version
   pip --version
   ```

#### 1.2 Install Node.js
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install with default settings
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### 1.3 Install MySQL
1. Download MySQL from [dev.mysql.com](https://dev.mysql.com/downloads/)
2. Install with default settings
3. Set a root password during installation
4. Verify installation:
   ```cmd
   mysql --version
   ```

### Step 2: Setup Backend

1. **Navigate to backend directory**
   ```cmd
   cd backend
   ```

2. **Create virtual environment**
   ```cmd
   python -m venv venv
   ```

3. **Activate virtual environment**
   ```cmd
   venv\Scripts\activate
   ```

4. **Install Python dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

5. **Setup database**
   ```cmd
   python setup_database_windows.py
   ```

6. **Configure environment variables**
   ```cmd
   copy env.example .env
   ```
   Edit `.env` file with your database credentials.

### Step 3: Setup Frontend

1. **Return to project root**
   ```cmd
   cd ..
   ```

2. **Install Node.js dependencies**
   ```cmd
   npm install
   ```

### Step 4: Start the Application

#### Using Command Prompt:
```cmd
scripts\start-servers.bat
```

#### Using PowerShell:
```powershell
.\scripts\start-servers.ps1
```

#### Manual Startup:
1. **Start backend** (in one terminal):
   ```cmd
   cd backend
   venv\Scripts\activate
   python main.py
   ```

2. **Start frontend** (in another terminal):
   ```cmd
   npm start
   ```

## Project Structure

```
building-performance-dashboard/
├── backend/                    # Python Flask backend
│   ├── main.py                # Main Flask application
│   ├── database.py            # Database models and operations
│   ├── services.py            # Business logic services
│   ├── ai_models.py           # AI/ML model integration
│   ├── setup_database_windows.py # Windows database setup
│   ├── requirements.txt       # Python dependencies
│   ├── env.example           # Environment variables template
│   └── README.md             # Backend documentation
├── src/                       # Frontend React application
│   ├── dashboard.js           # Main dashboard component
│   ├── api.js                # API integration
│   └── index.js              # Application entry point
├── public/                    # Static assets
├── scripts/                   # Setup and startup scripts
│   ├── start-servers.bat      # Windows Command Prompt script
│   ├── start-servers.ps1      # Windows PowerShell script
│   ├── start-servers.sh       # Original Mac/Linux script
│   ├── setup-windows.bat      # Windows setup script
│   └── setup.js              # Cross-platform setup
├── docs/                      # Documentation
│   ├── WINDOWS_SETUP.md      # This file
│   ├── WINDOWS_OPTIMIZATIONS.md # Windows optimizations
│   └── VENV_SETUP.md         # Virtual environment guide
├── package.json              # Node.js dependencies
└── README.md                 # Main project README
``` 