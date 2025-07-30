# Building Performance Dashboard - Python Backend

This is the Python FastAPI backend for the Building Performance Dashboard with **MySQL database integration**. It provides AI/ML functionality, authentication, and data management APIs with persistent storage.

## 🚀 Quick Start

### 1. Install MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/)

### 2. Setup Database (Automated)

```bash
cd backend
python3 setup_database.py
```

This script will:
- Check MySQL installation
- Create the database
- Install Python dependencies
- Initialize tables and sample data
- Create configuration files

### 3. Manual Setup (Alternative)

#### Install Dependencies
```bash
cd backend
pip3 install -r requirements.txt
```

#### Create Database
```sql
CREATE DATABASE building_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Configure Environment
Copy `env.example` to `.env` and update the MySQL credentials:
```bash
cp env.example .env
# Edit .env file with your MySQL password
```

#### Initialize Database
```bash
python3 database.py
```

### 4. Run the Backend Server

```bash
python3 main.py
```

The API will be available at: http://localhost:8000

### 5. API Documentation

Once running, visit: http://localhost:8000/docs

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── database.py          # Database models and configuration
├── services.py          # Business logic and database operations
├── ai_models.py         # AI/ML models and algorithms
├── setup_database.py    # Database setup script
├── requirements.txt     # Python dependencies
├── env.example          # Environment configuration template
├── .env                 # Environment variables (created by setup)
├── models/             # Saved ML models (auto-created)
└── README.md           # This file
```

## 🗄️ Database Schema

### Core Tables

#### Users
- `id` - Primary key
- `username` - Unique username
- `email` - User email
- `hashed_password` - Bcrypt hashed password
- `role` - User role (admin, facility_manager, technician, viewer)
- `is_active` - Account status
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

#### Buildings
- `id` - Primary key
- `building_id` - Unique building identifier
- `name` - Building name
- `type` - Building type (office, industrial, laboratory)
- `floors` - Number of floors
- `address` - Building address
- `total_area` - Total area in square feet
- `is_active` - Building status
- `created_at` - Creation timestamp

#### UserBuilding (Many-to-Many)
- `id` - Primary key
- `user_id` - Foreign key to users
- `building_id` - Foreign key to buildings
- `access_level` - Access permissions (view, edit, admin)
- `created_at` - Creation timestamp

#### SensorData
- `id` - Primary key
- `building_id` - Foreign key to buildings
- `timestamp` - Data timestamp
- `temperature` - Temperature reading
- `humidity` - Humidity reading
- `energy_consumption` - Energy consumption
- `occupancy` - Occupancy count
- `hvac_status` - HVAC system status
- `lighting_status` - Lighting system status
- `air_quality` - Air quality index
- `hvac_efficiency` - HVAC efficiency percentage
- `lighting_efficiency` - Lighting efficiency percentage
- `created_at` - Record creation timestamp

#### Anomalies
- `id` - Primary key
- `building_id` - Foreign key to buildings
- `timestamp` - Anomaly detection timestamp
- `anomaly_type` - Type of anomaly
- `severity` - Severity level (low, medium, high, critical)
- `confidence` - ML confidence score
- `description` - Anomaly description
- `feature_values` - JSON of feature values
- `is_resolved` - Resolution status
- `resolved_at` - Resolution timestamp
- `resolved_by` - User who resolved it
- `created_at` - Creation timestamp

#### Predictions
- `id` - Primary key
- `building_id` - Foreign key to buildings
- `timestamp` - Prediction timestamp
- `feature` - Predicted feature
- `predicted_value` - Predicted value
- `confidence` - Prediction confidence
- `model_type` - ML model used (lstm, random_forest)
- `factors` - JSON of prediction factors
- `created_at` - Creation timestamp

#### SystemEvents
- `id` - Primary key
- `building_id` - Foreign key to buildings
- `event_type` - Event type (maintenance, alert, system_change)
- `severity` - Event severity
- `title` - Event title
- `description` - Event description
- `created_by` - User who created the event
- `created_at` - Creation timestamp
- `resolved_at` - Resolution timestamp

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication with JWT

### Building Management
- `GET /api/buildings` - Get user's accessible buildings
- `GET /api/buildings/{id}/data` - Get building sensor data
- `POST /api/buildings/{id}/sensor-data` - Create new sensor data

### AI/ML Features
- `POST /api/predictions` - Get LSTM predictions
- `GET /api/anomalies/{id}` - Get anomaly detection results
- `POST /api/anomalies/{id}` - Create new anomaly

### User Management
- `GET /api/users/me` - Get current user info
- `GET /api/users/me/buildings` - Get user's buildings

### System
- `GET /api/health` - Health check with database status
- `POST /api/init-db` - Initialize database tables

## 🔐 Authentication & Security

### JWT Token Authentication
- Tokens expire after 30 minutes
- Secure password hashing with bcrypt
- Role-based access control

### User Roles
- **Admin**: Full access to all buildings and features
- **Facility Manager**: Access to assigned buildings, can edit data
- **Technician**: Access to assigned buildings, maintenance features
- **Viewer**: Read-only access to assigned buildings

### Demo Users (Created by setup script)
- **Admin**: `admin` / `admin123`
- **Manager**: `facility_manager` / `fm123`
- **Tech**: `technician` / `tech123`
- **Guest**: `guest` / `guest123`

## 🤖 AI/ML Features

### 1. LSTM Neural Networks
- Energy consumption forecasting
- Time series prediction with confidence scores
- Business hours and seasonal pattern recognition

### 2. Random Forest Anomaly Detection
- Real-time anomaly detection
- Multi-sensor data fusion
- Confidence scoring and severity classification

### 3. K-means Clustering
- Usage pattern analysis
- Building behavior classification
- Optimization recommendations

## 🛠️ Development

### Environment Variables

Create a `.env` file with:
```env
# Database Configuration
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/building_dashboard

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
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=building_dashboard
```

### Adding New Features

1. **Database Models**: Add to `database.py`
2. **Business Logic**: Add to `services.py`
3. **API Endpoints**: Add to `main.py`
4. **Frontend Integration**: Update `src/api.js`

### Database Migrations

For schema changes:
```bash
# Drop and recreate (development only)
python3 database.py

# For production, use proper migrations
# (Consider using Alembic for production)
```

## 🚀 Production Deployment

### Database Setup
```bash
# Create production database
mysql -u root -p -e "CREATE DATABASE building_dashboard_prod;"

# Create production user
mysql -u root -p -e "CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'secure_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON building_dashboard_prod.* TO 'dashboard_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Application Deployment
```bash
# Install production dependencies
pip3 install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment Configuration
```env
DATABASE_URL=mysql+pymysql://dashboard_user:secure_password@localhost:3306/building_dashboard_prod
SECRET_KEY=your-production-secret-key
DEBUG=False
```

## 📊 Data Flow

1. **Sensors** → **API Endpoints** → **Database** → **AI Models** → **Frontend**
2. **User Actions** → **Frontend** → **API** → **Database** → **ML Processing**
3. **Real-time Updates** → **Database Triggers** → **WebSocket/SSE** → **Frontend**

## 🔒 Security Features

- JWT token authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- SQL injection protection with SQLAlchemy
- CORS protection
- Input validation with Pydantic
- Secure environment variable handling

## 📈 Performance

- **Database**: Optimized MySQL queries with indexes
- **API**: FastAPI with async/await support
- **ML Models**: Cached predictions and efficient algorithms
- **Caching**: Consider Redis for production caching

## 🐛 Troubleshooting

### Common Issues

1. **MySQL Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Import Errors**
   - Install missing dependencies: `pip3 install -r requirements.txt`
   - Check Python path and virtual environment

3. **Database Initialization Failed**
   - Run setup script: `python3 setup_database.py`
   - Check MySQL permissions
   - Verify database exists

4. **Authentication Issues**
   - Check JWT token expiration
   - Verify user exists in database
   - Check password hashing

### Debug Mode
Set `DEBUG=True` in `.env` for detailed error messages and SQL query logging.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using FastAPI, SQLAlchemy, MySQL, and AI/ML technologies** 