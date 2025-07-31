# Virtual Environment Setup Guide

This guide will help you set up a Python virtual environment for the Building Performance Dashboard backend.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd building-performance-dashboard
```

## Step 2: Create Virtual Environment

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python3 -m venv venv
```

## Step 3: Activate Virtual Environment

### On macOS/Linux:
```bash
source venv/bin/activate
```

### On Windows:
```cmd
venv\Scripts\activate
```

## Step 4: Install Dependencies

With the virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

## Step 5: Setup Database

Run the database setup script:

```bash
python setup_database.py
```

## Step 6: Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit the `.env` file with your database credentials and other settings.

## Step 7: Start the Application

### Option 1: Using the Virtual Environment Script (Recommended)

From the project root directory:

```bash
./scripts/start-servers-venv.sh
```

### Option 2: Manual Startup

1. Activate the virtual environment:
   ```bash
   cd backend
   source venv/bin/activate
   ```

2. Start the backend server:
   ```bash
   python main.py
   ```

3. In a new terminal, start the frontend:
   ```bash
   npm install
   npm start
   ```

## Troubleshooting

### Virtual Environment Issues

If you encounter issues with the virtual environment:

1. **Permission Denied**: Make sure the script is executable:
   ```bash
   chmod +x scripts/start-servers-venv.sh
   ```

2. **Python Not Found**: Ensure Python 3.8+ is installed and in your PATH

3. **Package Installation Errors**: Try upgrading pip:
   ```bash
   pip install --upgrade pip
   ```

### Database Connection Issues

1. Ensure MySQL is running
2. Verify database credentials in `.env` file
3. Check that the database exists and is accessible

### Port Conflicts

If ports 3000 (frontend) or 8000 (backend) are already in use:

1. Stop the conflicting services
2. Or modify the port configuration in the respective configuration files

## Next Steps

- See the main [README.md](../README.md) for more information
- Check [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for Windows-specific instructions
- Review [WINDOWS_OPTIMIZATIONS.md](./WINDOWS_OPTIMIZATIONS.md) for performance tips 