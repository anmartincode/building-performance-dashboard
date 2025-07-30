#!/usr/bin/env python
"""
Database Setup Script for Windows
Sets up the MySQL database and initial data for the Building Performance Dashboard
"""

import os
import sys
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime, timedelta
import random

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Update this with your MySQL root password
    'database': 'building_dashboard',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect without specifying database
        connection = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']} CHARACTER SET {DB_CONFIG['charset']} COLLATE {DB_CONFIG['collation']}")
            print(f"✅ Database '{DB_CONFIG['database']}' created successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ Error creating database: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure MySQL is installed and running")
        print("2. Check your MySQL root password in the script")
        print("3. Try running: mysql -u root -p")
        return False
    
    return True

def create_tables():
    """Create all necessary tables"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'manager', 'technician', 'viewer') NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
            
            # Buildings table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS buildings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    address TEXT,
                    building_type VARCHAR(50),
                    total_area DECIMAL(10,2),
                    year_built INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # User-Building relationships
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_buildings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    building_id INT NOT NULL,
                    access_level ENUM('owner', 'manager', 'viewer') NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_user_building (user_id, building_id)
                )
            """)
            
            # Sensor data table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sensor_data (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    building_id INT NOT NULL,
                    sensor_type ENUM('temperature', 'humidity', 'energy', 'occupancy', 'lighting', 'hvac') NOT NULL,
                    value DECIMAL(10,4) NOT NULL,
                    unit VARCHAR(20),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
                )
            """)
            
            # Anomalies table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS anomalies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    building_id INT NOT NULL,
                    sensor_type VARCHAR(50) NOT NULL,
                    anomaly_type VARCHAR(50) NOT NULL,
                    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
                    description TEXT,
                    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    resolved_at TIMESTAMP NULL,
                    status ENUM('active', 'resolved', 'ignored') DEFAULT 'active',
                    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
                )
            """)
            
            # Predictions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS predictions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    building_id INT NOT NULL,
                    prediction_type VARCHAR(50) NOT NULL,
                    predicted_value DECIMAL(10,4) NOT NULL,
                    confidence DECIMAL(5,2),
                    prediction_horizon INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
                )
            """)
            
            # System events table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS system_events (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    building_id INT NOT NULL,
                    event_type VARCHAR(50) NOT NULL,
                    description TEXT,
                    severity ENUM('info', 'warning', 'error', 'critical') NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
                )
            """)
            
            connection.commit()
            print("✅ All tables created successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

def insert_sample_data():
    """Insert sample data for demonstration"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Insert sample users
            users_data = [
                ('admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8Kj1G', 'admin'),  # admin123
                ('facility_manager', 'manager@example.com', '$2b$12$8K1p/a0dL1bwxM7nKx3P3e6Q9rTtYyUuIiOoPpAqQsSrRrSsTtUuVv', 'manager'),  # fm123
                ('technician', 'tech@example.com', '$2b$12$9L2q/b1eM2cxN8oLy4Q4f7R0sUuVvWwXxJjKkLlMmNnOoPpQqRrSsTt', 'technician'),  # tech123
                ('guest', 'guest@example.com', '$2b$12$0M3r/c2fN3dyO9pMz5R5g8S1tVvWwXxYyZzAaBbCcDdEeFfGgHhIiJj', 'viewer')  # guest123
            ]
            
            cursor.executemany("""
                INSERT IGNORE INTO users (username, email, password_hash, role)
                VALUES (%s, %s, %s, %s)
            """, users_data)
            
            # Insert sample buildings
            buildings_data = [
                ('Office Tower A', '123 Main St, Downtown', 'office', 50000.00, 2015),
                ('Shopping Center B', '456 Commerce Ave', 'retail', 75000.00, 2018),
                ('Residential Complex C', '789 Living Blvd', 'residential', 30000.00, 2020),
                ('Industrial Warehouse D', '321 Industrial Way', 'industrial', 100000.00, 2012)
            ]
            
            cursor.executemany("""
                INSERT IGNORE INTO buildings (name, address, building_type, total_area, year_built)
                VALUES (%s, %s, %s, %s, %s)
            """, buildings_data)
            
            # Insert user-building relationships
            user_buildings_data = [
                (1, 1, 'owner'), (1, 2, 'owner'), (1, 3, 'owner'), (1, 4, 'owner'),  # Admin owns all
                (2, 1, 'manager'), (2, 2, 'manager'),  # Manager manages first two
                (3, 1, 'viewer'), (3, 3, 'viewer'), (3, 4, 'viewer'),  # Tech views most
                (4, 1, 'viewer')  # Guest views one
            ]
            
            cursor.executemany("""
                INSERT IGNORE INTO user_buildings (user_id, building_id, access_level)
                VALUES (%s, %s, %s)
            """, user_buildings_data)
            
            # Generate sample sensor data
            sensor_data = []
            for building_id in range(1, 5):
                for sensor_type in ['temperature', 'humidity', 'energy', 'occupancy']:
                    for i in range(24):  # 24 hours of data
                        timestamp = datetime.now() - timedelta(hours=i)
                        if sensor_type == 'temperature':
                            value = random.uniform(18, 25)
                            unit = '°C'
                        elif sensor_type == 'humidity':
                            value = random.uniform(40, 60)
                            unit = '%'
                        elif sensor_type == 'energy':
                            value = random.uniform(50, 200)
                            unit = 'kWh'
                        else:  # occupancy
                            value = random.randint(0, 100)
                            unit = 'people'
                        
                        sensor_data.append((building_id, sensor_type, value, unit, timestamp))
            
            cursor.executemany("""
                INSERT IGNORE INTO sensor_data (building_id, sensor_type, value, unit, timestamp)
                VALUES (%s, %s, %s, %s, %s)
            """, sensor_data)
            
            connection.commit()
            print("✅ Sample data inserted successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ Error inserting sample data: {e}")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🏗️ Setting up Building Performance Dashboard Database...")
    print("=" * 50)
    
    # Update database password if needed
    password = input("Enter your MySQL root password (or press Enter if none): ").strip()
    if password:
        DB_CONFIG['password'] = password
    
    # Create database
    if not create_database():
        return False
    
    # Create tables
    if not create_tables():
        return False
    
    # Insert sample data
    if not insert_sample_data():
        return False
    
    print("\n🎉 Database setup completed successfully!")
    print("\n📋 Next steps:")
    print("   1. Start the backend: python main.py")
    print("   2. Start the frontend: npm start")
    print("   3. Or use the Windows startup scripts:")
    print("      - start-servers.bat (Command Prompt)")
    print("      - start-servers.ps1 (PowerShell)")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 