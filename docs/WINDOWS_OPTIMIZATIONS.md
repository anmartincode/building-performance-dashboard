# Windows Optimizations Guide

This guide provides Windows-specific optimizations and troubleshooting tips for the Building Performance Dashboard.

## Platform-Specific Scripts

The project includes several Windows-optimized scripts:

### Startup Scripts
- `scripts/start-servers.bat` - Command Prompt batch file
- `scripts/start-servers.ps1` - PowerShell script with better error handling
- `scripts/start-servers.js` - Node.js cross-platform launcher

### Setup Scripts
- `scripts/setup-windows.bat` - Windows-specific setup automation
- `scripts/setup.js` - Cross-platform setup script

## Performance Optimizations

### 1. Windows Defender Exclusions

Add the project directory to Windows Defender exclusions to improve performance:

1. Open Windows Security
2. Go to Virus & threat protection
3. Click "Manage settings" under Virus & threat protection settings
4. Scroll down to "Exclusions"
5. Add the project folder to exclusions

### 2. PowerShell Execution Policy

If you encounter execution policy issues:

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or set for all users (requires admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

### 3. Node.js Performance

Optimize Node.js for Windows:

```cmd
# Increase Node.js memory limit
set NODE_OPTIONS=--max-old-space-size=4096

# Use npm with better performance
npm config set registry https://registry.npmjs.org/
npm config set fetch-retries 3
npm config set fetch-retry-mintimeout 5000
npm config set fetch-retry-maxtimeout 60000
```

### 4. Python Virtual Environment

Use virtual environments for better dependency management:

```cmd
# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Startup Scripts Comparison

### Command Prompt (start-servers.bat)
```cmd
scripts\start-servers.bat
```
- **Pros**: Simple, works with any Windows version
- **Cons**: Limited error handling, basic output

### PowerShell (start-servers.ps1)
```powershell
.\scripts\start-servers.ps1
```
- **Pros**: Better error handling, colored output, progress indicators
- **Cons**: Requires PowerShell execution policy configuration

### Node.js (start-servers.js)
```cmd
node scripts/start-servers.js
```
- **Pros**: Cross-platform, advanced features, better logging
- **Cons**: Requires Node.js to be installed

## Troubleshooting

### Common Windows Issues

#### 1. Port Conflicts
```cmd
# Check what's using ports 3000 and 8000
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process by PID
taskkill /PID <process_id> /F
```

#### 2. MySQL Service Issues
```cmd
# Check MySQL service status
sc query mysql

# Start MySQL service
net start mysql

# If service won't start, try:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --install
net start mysql
```

#### 3. Permission Issues
```cmd
# Run as administrator if needed
# Or check folder permissions
icacls "C:\path\to\project" /grant Users:F
```

#### 4. Path Issues
```cmd
# Check if Python and Node.js are in PATH
where python
where node
where npm

# If not found, add to PATH or use full paths
```

### Performance Issues

#### Slow Startup
1. **Close unnecessary applications**
2. **Disable Windows Defender real-time protection temporarily**
3. **Increase virtual memory**
4. **Use SSD if available**

#### Memory Issues
1. **Close other applications**
2. **Restart the application**
3. **Check for memory leaks in browser**
4. **Increase Node.js memory limit**

#### Database Performance
1. **Optimize MySQL configuration**
2. **Use connection pooling**
3. **Index frequently queried columns**
4. **Regular database maintenance**

## Recommended Workflow

### For Development
```cmd
# 1. Use PowerShell for better experience
.\scripts\start-servers.ps1

# 2. Or use Node.js script for advanced features
node scripts/start-servers.js
```

### For Production
```cmd
# 1. Use Command Prompt for stability
scripts\start-servers.bat

# 2. Or use Node.js script with production settings
node scripts/start-servers.js --production
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=building_dashboard
DB_USER=root
DB_PASSWORD=your_password

# Application Settings
FLASK_ENV=development
SECRET_KEY=your_secret_key
DEBUG=True

# AI/ML Settings
MODEL_CACHE_DIR=./models
PREDICTION_INTERVAL=300
```

## Security Considerations

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

## Monitoring and Logging

### Application Logs
- Check terminal output for errors
- Monitor CPU and memory usage
- Watch for database connection issues

### System Monitoring
```cmd
# Monitor system resources
tasklist /FI "IMAGENAME eq python.exe"
tasklist /FI "IMAGENAME eq node.exe"

# Check disk space
dir /s

# Monitor network connections
netstat -an | findstr :3000
netstat -an | findstr :8000
```

## Next Steps

1. **Explore the dashboard interface**
2. **Review the API documentation at http://localhost:8000/docs**
3. **Customize the application for your needs**
4. **Set up production deployment if needed**
5. **Check other documentation in the `docs/` directory** 