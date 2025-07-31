# Scripts Directory

This directory contains all the setup and startup scripts for the Building Performance Dashboard.

## Server Startup Scripts

### Cross-Platform
- **`start-servers.js`** - Node.js script that starts both frontend and backend servers
- **`start-servers.sh`** - Bash script for macOS/Linux systems
- **`start-servers.bat`** - Batch script for Windows Command Prompt
- **`start-servers.ps1`** - PowerShell script for Windows PowerShell

### Platform-Specific
- **`start-servers-venv.sh`** - Bash script with virtual environment activation for macOS/Linux

## Setup Scripts

### Cross-Platform
- **`setup.js`** - Node.js setup script for initial project configuration

### Windows-Specific
- **`setup-windows.bat`** - Windows batch script for initial setup

## Usage

### Starting the Application

**macOS/Linux:**
```bash
# Using bash script
./scripts/start-servers.sh

# Using bash script with virtual environment
./scripts/start-servers-venv.sh

# Using Node.js script
node scripts/start-servers.js
```

**Windows Command Prompt:**
```cmd
scripts\start-servers.bat
```

**Windows PowerShell:**
```powershell
.\scripts\start-servers.ps1
```

### Initial Setup

**Cross-Platform:**
```bash
node scripts/setup.js
```

**Windows:**
```cmd
scripts\setup-windows.bat
```

## Script Details

### start-servers.js
- Starts both frontend (React) and backend (Flask) servers
- Handles port configuration
- Provides real-time logging for both servers

### start-servers.sh / start-servers.bat / start-servers.ps1
- Platform-specific versions of the startup script
- Same functionality as the Node.js version but optimized for each platform

### start-servers-venv.sh
- Includes virtual environment activation for Python backend
- Ensures proper Python environment isolation

### setup.js
- Installs Node.js dependencies
- Sets up environment variables
- Configures initial project settings

### setup-windows.bat
- Windows-specific setup script
- Handles Windows-specific configurations and dependencies 