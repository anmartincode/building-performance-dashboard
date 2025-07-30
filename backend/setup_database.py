#!/usr/bin/env python3
"""
Database setup script for Building Performance Dashboard
This script helps set up MySQL database and initialize tables
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

load_dotenv()

def check_mysql_installed():
    """Check if MySQL is installed and running"""
    try:
        result = subprocess.run(['mysql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ MySQL is installed")
            return True
        else:
            print("❌ MySQL is not installed or not in PATH")
            return False
    except FileNotFoundError:
        print("❌ MySQL is not installed or not in PATH")
        return False

def check_mysql_connection():
    """Check if we can connect to MySQL"""
    try:
        # Try to connect with default credentials
        result = subprocess.run([
            'mysql', '-u', 'root', '-p', '-e', 'SELECT 1;'
        ], capture_output=True, text=True, input='\n')
        
        if result.returncode == 0:
            print("✅ MySQL connection successful")
            return True
        else:
            print("❌ MySQL connection failed")
            print("Error:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ MySQL connection error: {e}")
        return False

def create_database():
    """Create the building_dashboard database"""
    try:
        # Create database
        create_db_sql = """
        CREATE DATABASE IF NOT EXISTS building_dashboard 
        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """
        
        result = subprocess.run([
            'mysql', '-u', 'root', '-p'
        ], capture_output=True, text=True, input=create_db_sql)
        
        if result.returncode == 0:
            print("✅ Database 'building_dashboard' created successfully")
            return True
        else:
            print("❌ Failed to create database")
            print("Error:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ Database creation error: {e}")
        return False

def install_python_dependencies():
    """Install required Python packages"""
    try:
        print("📦 Installing Python dependencies...")
        result = subprocess.run([
            'pip3', 'install', '-r', 'requirements.txt'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Python dependencies installed successfully")
            return True
        else:
            print("❌ Failed to install Python dependencies")
            print("Error:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ Dependency installation error: {e}")
        return False

def initialize_database_tables():
    """Initialize database tables and sample data"""
    try:
        print("🗄️ Initializing database tables...")
        from database import init_db
        init_db()
        print("✅ Database tables initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = '.env'
    if not os.path.exists(env_file):
        print("📝 Creating .env file...")
        env_content = """# Database Configuration
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/building_dashboard

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
MODEL_PATH=./models

# MySQL Connection Settings
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=building_dashboard
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️  Please update the MySQL password in .env file if different from 'password'")
    else:
        print("✅ .env file already exists")

def main():
    """Main setup function"""
    print("🚀 Building Performance Dashboard - Database Setup")
    print("=" * 50)
    
    # Check MySQL installation
    if not check_mysql_installed():
        print("\n📋 To install MySQL:")
        print("   macOS: brew install mysql")
        print("   Ubuntu: sudo apt-get install mysql-server")
        print("   Windows: Download from https://dev.mysql.com/downloads/")
        return False
    
    # Check MySQL connection
    if not check_mysql_connection():
        print("\n📋 MySQL connection issues:")
        print("   1. Make sure MySQL service is running")
        print("   2. Check your MySQL root password")
        print("   3. Update the password in .env file if needed")
        return False
    
    # Create database
    if not create_database():
        print("\n📋 Database creation failed")
        return False
    
    # Install Python dependencies
    if not install_python_dependencies():
        print("\n📋 Python dependency installation failed")
        return False
    
    # Create .env file
    create_env_file()
    
    # Initialize database tables
    if not initialize_database_tables():
        print("\n📋 Database table initialization failed")
        return False
    
    print("\n🎉 Database setup completed successfully!")
    print("\n📋 Next steps:")
    print("   1. Start the backend: python3 main.py")
    print("   2. Start the frontend: npm start")
    print("   3. Access the dashboard: http://localhost:3000")
    print("   4. API docs: http://localhost:8000/docs")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 