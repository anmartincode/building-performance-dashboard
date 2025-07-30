# 🪟 Windows Setup Guide

This guide will help you set up and run the Building Performance Dashboard on Windows systems.

## 📋 Prerequisites

### 1. Install Python
- Download Python from [python.org](https://www.python.org/downloads/)
- **Important**: Check "Add Python to PATH" during installation
- Recommended version: Python 3.8 or higher
- Verify installation: Open Command Prompt and run `python --version`

### 2. Install Node.js
- Download Node.js from [nodejs.org](https://nodejs.org/)
- Choose the LTS (Long Term Support) version
- **Important**: npm comes with Node.js installation
- Verify installation: Open Command Prompt and run `node --version` and `npm --version`

### 3. Install MySQL
- Download MySQL from [dev.mysql.com](https://dev.mysql.com/downloads/)
- Choose MySQL Community Server
- During installation:
  - Set a root password (remember this!)
  - Choose "Developer Default" or "Server only" installation
  - Enable MySQL as a Windows Service
- Verify installation: Open Command Prompt and run `mysql --version`

## 🚀 Quick Setup (Recommended)

### Option 1: Automated Setup
1. Open Command Prompt as Administrator
2. Navigate to your project directory
3. Run the automated setup script:
   ```cmd
   setup-windows.bat
   ```
4. Follow the prompts and enter your MySQL root password when asked

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```cmd
# Install Python dependencies
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cd ..

# Install Node.js dependencies
npm install
```

#### Step 2: Setup Database
```cmd
cd backend
python setup_database_windows.py
cd ..
```

## 🏃‍♂️ Running the Application

### Option 1: Using Windows Scripts (Recommended)

#### Command Prompt
```cmd
start-servers.bat
```

#### PowerShell
```powershell
.\start-servers.ps1
```

### Option 2: Manual Startup

#### Terminal 1 - Backend
```cmd
cd backend
python main.py
```

#### Terminal 2 - Frontend
```cmd
npm start
```

## 🌐 Access Points

Once running, access the application at:
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔐 Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Manager** | `facility_manager` | `fm123` |
| **Technician** | `technician` | `tech123` |
| **Viewer** | `guest` | `guest123` |

## 🔧 Troubleshooting

### Common Issues

#### 1. "Python is not recognized"
- **Solution**: Reinstall Python and make sure to check "Add Python to PATH"
- **Alternative**: Use the full path to Python executable

#### 2. "MySQL connection failed"
- **Solution**: Make sure MySQL service is running
- **Check**: Open Services (services.msc) and verify "MySQL" is running
- **Start manually**: `net start mysql`

#### 3. "Port already in use"
- **Solution**: Stop existing processes on ports 3000 and 8000
- **Check**: `netstat -ano | findstr :3000` and `netstat -ano | findstr :8000`
- **Kill process**: `taskkill /PID <process_id> /F`

#### 4. "Permission denied"
- **Solution**: Run Command Prompt as Administrator
- **Alternative**: Check Windows Defender Firewall settings

#### 5. "npm install fails"
- **Solution**: Clear npm cache: `npm cache clean --force`
- **Alternative**: Delete `node_modules` folder and run `npm install` again

### Database Issues

#### MySQL Service Not Starting
```cmd
# Check MySQL service status
sc query mysql

# Start MySQL service
net start mysql

# If that fails, try:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --install
net start mysql
```

#### Reset Database
```cmd
cd backend
python setup_database_windows.py
```

### Performance Issues

#### Slow Startup
- Close unnecessary applications
- Disable Windows Defender real-time protection temporarily
- Increase virtual memory

#### Memory Issues
- Close other applications
- Restart the application
- Check for memory leaks in browser

## 📁 File Structure for Windows

```
building-performance-dashboard/
├── src/                           # React frontend
├── backend/                       # Python FastAPI backend
│   ├── setup_database_windows.py  # Windows-specific DB setup
│   └── ...
├── start-servers.bat              # Windows Command Prompt script
├── start-servers.ps1              # Windows PowerShell script
├── setup-windows.bat              # Windows setup script
├── start-servers.sh               # Original Mac/Linux script
└── WINDOWS_SETUP.md               # This file
```

## 🔄 Updating the Application

### Update Dependencies
```cmd
# Update Python dependencies
cd backend
python -m pip install --upgrade -r requirements.txt
cd ..

# Update Node.js dependencies
npm update
```

### Update Database Schema
```cmd
cd backend
python setup_database_windows.py
cd ..
```

## 🛡️ Security Considerations

### Windows Security
- Keep Windows updated
- Use Windows Defender or another antivirus
- Configure Windows Firewall appropriately

### Application Security
- Change default passwords in production
- Use environment variables for sensitive data
- Regularly update dependencies

### Database Security
- Use strong MySQL root password
- Create dedicated database user for the application
- Restrict database access to localhost only

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed correctly
3. Check the application logs in the terminal
4. Ensure MySQL service is running
5. Try restarting the application

## 🎯 Next Steps

After successful setup:
1. Explore the dashboard interface
2. Review the API documentation at http://localhost:8000/docs
3. Customize the application for your needs
4. Set up production deployment if needed 