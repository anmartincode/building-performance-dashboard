# Virtual Environment Setup Guide

This guide explains how to run the Building Performance Dashboard using a Python virtual environment.

## Benefits of Using Virtual Environment

- **Isolation**: Python dependencies are isolated from your system Python
- **Clean Environment**: No conflicts with other Python projects
- **Reproducible**: Same environment across different machines
- **Easy Management**: Simple to create, activate, and deactivate

## Quick Start

### Option 1: Using the Virtual Environment Script (Recommended)

```bash
# Start both servers using the virtual environment
npm run start-servers-venv
```

### Option 2: Manual Setup

```bash
# 1. Create virtual environment (already done)
cd backend
python3 -m venv venv

# 2. Activate virtual environment
source venv/bin/activate

# 3. Install dependencies (already done)
pip install -r requirements.txt

# 4. Start the backend
python main.py

# 5. In another terminal, start the frontend
cd ..
npm start
```

## Virtual Environment Commands

### Activate Virtual Environment
```bash
cd backend
source venv/bin/activate
```

### Deactivate Virtual Environment
```bash
deactivate
```

### Check if Virtual Environment is Active
Look for `(venv)` at the beginning of your terminal prompt.

### Install New Dependencies
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install package_name
```

### Update Requirements File
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip freeze > requirements.txt
```

## Accessing the Application

Once the servers are running:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Demo Login Credentials
- **Admin**: admin / admin123
- **Manager**: facility_manager / fm123
- **Tech**: technician / tech123
- **Guest**: guest / guest123

## Troubleshooting

### Virtual Environment Not Found
If you get an error about the virtual environment not existing:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Port Already in Use
If ports 3000 or 8000 are already in use:
```bash
# Find processes using the ports
lsof -i :3000 -i :8000

# Kill the processes
kill -9 <PID>
```

### Permission Denied
If you get permission errors:
```bash
chmod +x start-servers-venv.sh
```

## Differences from Regular Setup

- **Backend**: Uses isolated Python environment with `venv/bin/python`
- **Dependencies**: Installed only in the virtual environment
- **Path**: Python packages are in `backend/venv/lib/python3.x/site-packages/`
- **Activation**: Virtual environment must be activated before running backend

## Clean Up

To remove the virtual environment:
```bash
cd backend
rm -rf venv
```

**Note**: You'll need to recreate it if you want to use the virtual environment again. 