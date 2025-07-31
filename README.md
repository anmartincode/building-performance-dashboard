# 🏢 Building Performance Dashboard

An AI-powered building management system with real-time monitoring, predictive analytics, intelligent automation, and **MySQL database integration**.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [💻 Cross-Platform Compatibility](#-cross-platform-compatibility)
- [🚀 Quick Start](#-quick-start)
- [🌐 Access Points](#-access-points)
- [🔐 Demo Accounts](#-demo-accounts)
- [🗄️ Database Schema](#️-database-schema)
- [🔧 API Endpoints](#-api-endpoints)
- [🤖 AI/ML Features](#-ai-ml-features-1)
- [🛠️ Development](#️-development)
- [🚀 Production Deployment](#-production-deployment)
- [📊 Data Flow](#-data-flow)
- [🔒 Security Features](#-security-features)
- [📈 Performance](#-performance)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Features

### 🔐 Multi-User Authentication
- Role-based access control (Admin, Manager, Technician, Viewer)
- Secure JWT-based authentication with bcrypt password hashing
- Permission-based feature access
- Persistent user management

### 📊 Real-Time Monitoring
- Live sensor data from multiple buildings
- HVAC, Lighting, and Security system monitoring
- Energy consumption tracking
- Occupancy analytics
- **Persistent data storage in MySQL**

### 🤖 AI/ML Capabilities
- **LSTM Neural Networks** for energy consumption prediction
- **Random Forest** anomaly detection
- **K-means clustering** for usage pattern analysis
- Real-time predictive analytics
- **ML model persistence and caching**

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Interactive charts and visualizations
- Real-time data updates
- Mobile-friendly interface

### 🗄️ Database Features
- **MySQL database integration**
- Persistent data storage
- User management and authentication
- Building and sensor data management
- Anomaly and prediction history
- Role-based access control

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Python FastAPI) ←→ MySQL Database
                                    ↓
                              AI/ML Models
```

## 📁 Project Structure

```
building-performance-dashboard/
├── backend/                 # Python Flask backend
│   ├── main.py             # Main Flask application
│   ├── database.py         # Database models and operations
│   ├── services.py         # Business logic services
│   ├── ai_models.py        # AI/ML model integration
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend-specific documentation
├── src/                    # Frontend React application
│   ├── dashboard.js        # Main dashboard component
│   ├── api.js             # API integration
│   └── index.js           # Application entry point
├── public/                 # Static assets
├── scripts/                # Setup and startup scripts
│   ├── README.md          # Scripts documentation
│   ├── start-servers.*    # Platform-specific startup scripts
│   └── setup-*            # Setup scripts
├── docs/                   # Documentation
│   ├── README.md          # Documentation index
│   ├── VENV_SETUP.md      # Virtual environment setup
│   ├── WINDOWS_SETUP.md   # Windows setup guide
│   └── WINDOWS_OPTIMIZATIONS.md # Windows optimizations
├── package.json           # Node.js dependencies
└── README.md              # Main project README
```

## 💻 Cross-Platform Compatibility

This application is designed to work across multiple platforms:

### ✅ Supported Platforms
- **Windows 10/11** (with Windows Scripts)
- **macOS** (Intel & Apple Silicon)
- **Linux** (Ubuntu, Debian, CentOS)

### 🔧 Platform-Specific Features
- **Windows**: Batch files (`.bat`) and PowerShell scripts (`.ps1`)
- **macOS/Linux**: Bash scripts (`.sh`)
- **Universal**: Python and Node.js applications work on all platforms

### 📁 Platform-Specific Files
- `scripts/start-servers.sh` - macOS/Linux startup script
- `scripts/start-servers.bat` - Windows Command Prompt startup script  
- `scripts/start-servers.ps1` - Windows PowerShell startup script
- `scripts/setup-windows.bat` - Windows automated setup
- `backend/setup_database_windows.py` - Windows database setup
- `docs/WINDOWS_SETUP.md` - Comprehensive Windows guide

### Frontend (React)
- **Location**: `src/`
- **Port**: 3000
- **Framework**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend (Python FastAPI)
- **Location**: `backend/`
- **Port**: 8000
- **Framework**: FastAPI
- **ML Libraries**: scikit-learn, pandas, numpy
- **Authentication**: JWT tokens with bcrypt
- **Database**: MySQL with SQLAlchemy ORM
- **Documentation**: Auto-generated Swagger UI

### Database (MySQL)
- **Type**: MySQL 8.0+
- **ORM**: SQLAlchemy
- **Features**: User management, sensor data, predictions, anomalies
- **Security**: Password hashing, role-based access

## 🚀 Quick Start

### Prerequisites

> **📋 Platform-Specific Setup**
> - **Windows**: See [docs/WINDOWS_SETUP.md](docs/WINDOWS_SETUP.md) for detailed Windows installation guide
> - **macOS/Linux**: Follow the instructions below

1. **Install MySQL**
   ```bash
   # macOS
   brew install mysql
   brew services start mysql
   
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   
   # Windows: Download from https://dev.mysql.com/downloads/
   ```

2. **Install Node.js and npm** (if not already installed)

### Option 1: Automated Setup (Recommended)

#### Cross-Platform (All OS)
```bash
# Clone the repository
git clone <repository-url>
cd building-performance-dashboard

# Run cross-platform setup
node scripts/setup.js

# Start both servers
node scripts/start-servers.js
```

#### macOS/Linux
```bash
# Clone the repository
git clone <repository-url>
cd building-performance-dashboard

# Setup database and backend
cd backend
python3 setup_database.py

# Start both servers
cd ..
./scripts/start-servers.sh
```

#### Windows
```cmd
# Clone the repository
git clone <repository-url>
cd building-performance-dashboard

# Run automated setup
scripts\setup-windows.bat

# Start both servers
scripts\start-servers.bat
```

### Option 2: Manual Setup

#### macOS/Linux
```bash
# 1. Setup Database
cd backend
python3 setup_database.py

# 2. Install Frontend Dependencies
cd ..
npm install

# 3. Start the Backend
cd backend
python3 main.py

# 4. Start the Frontend (in new terminal)
export PATH="/opt/homebrew/bin:$PATH"
npm start
```

#### Windows
```cmd
# 1. Setup Database
cd backend
python setup_database_windows.py

# 2. Install Frontend Dependencies
cd ..
npm install

# 3. Start the Backend
cd backend
python main.py

# 4. Start the Frontend (in new terminal)
npm start
```

## 🌐 Access Points

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔐 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Manager** | `facility_manager` | `fm123` |
| **Technician** | `technician` | `tech123` |
| **Viewer** | `guest` | `guest123` |

## 📁 Project Structure

```
building-performance-dashboard/
├── src/                           # React frontend
│   ├── dashboard.js              # Main dashboard component
│   ├── api.js                   # API service layer
│   └── index.js                 # React entry point
├── backend/                      # Python FastAPI backend
│   ├── main.py                  # FastAPI application
│   ├── database.py              # Database models and configuration
│   ├── services.py              # Business logic and database operations
│   ├── ai_models.py             # ML models and algorithms
│   ├── setup_database.py        # Database setup script (macOS/Linux)
│   ├── setup_database_windows.py # Database setup script (Windows)
│   ├── requirements.txt         # Python dependencies
│   ├── env.example              # Environment configuration template
│   └── README.md                # Backend documentation
├── public/                      # Static assets
├── package.json                 # Node.js dependencies
├── start-servers.sh             # Server startup script (macOS/Linux)
├── start-servers.bat            # Server startup script (Windows CMD)
├── start-servers.ps1            # Server startup script (Windows PowerShell)
├── start-servers.js             # Cross-platform server launcher
├── setup.js                     # Cross-platform setup script
├── setup-windows.bat            # Windows setup script
├── WINDOWS_SETUP.md             # Windows setup guide
└── README.md                   # This file

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts and authentication
- **Buildings**: Building information and metadata
- **UserBuilding**: Many-to-many user-building relationships
- **SensorData**: Real-time sensor readings
- **Anomalies**: Detected anomalies and alerts
- **Predictions**: ML model predictions
- **SystemEvents**: System events and maintenance

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

## 🤖 AI/ML Features

### 1. LSTM Neural Networks
- **Purpose**: Energy consumption forecasting
- **Input**: Historical sensor data from MySQL
- **Output**: 24-hour predictions with confidence scores
- **Features**: Business hours, weekly patterns, seasonal trends

### 2. Random Forest Anomaly Detection
- **Purpose**: Real-time anomaly detection
- **Input**: Multi-sensor data streams from database
- **Output**: Anomaly scores and classifications
- **Features**: Temperature spikes, energy anomalies, occupancy patterns

### 3. K-means Clustering
- **Purpose**: Usage pattern analysis
- **Input**: Building behavior data from MySQL
- **Output**: Pattern classifications
- **Features**: High/low activity detection, optimization recommendations

## 🛠️ Development

### Adding New Features

1. **Database Models**: Add to `backend/database.py`
2. **Business Logic**: Add to `backend/services.py`
3. **API Endpoints**: Add to `backend/main.py`
4. **Frontend**: Update components in `src/dashboard.js`
5. **API Integration**: Use `src/api.js` for communication

### Environment Variables

Create `.env` files for configuration:

**Backend (.env):**
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

### Testing the API

```bash
# Health check
curl http://localhost:8000/api/health

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get building data (with auth token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/buildings/building_a/data
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

### Frontend
```bash
npm run build
# Deploy build/ folder to your web server
```

### Backend
```bash
pip3 install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment Configuration
```env
DATABASE_URL=mysql+pymysql://dashboard_user:secure_password@localhost:3306/building_dashboard_prod
SECRET_KEY=your-production-secret-key
DEBUG=False
```

## 📊 Data Flow

1. **Sensors** → **API Endpoints** → **MySQL Database** → **AI Models** → **Frontend Dashboard**
2. **User Actions** → **Frontend** → **Backend API** → **MySQL Database** → **ML Processing**
3. **Real-time Updates** → **Database Triggers** → **WebSocket/SSE** → **Frontend Charts**

## 🔒 Security Features

- JWT token authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- SQL injection protection with SQLAlchemy
- CORS protection
- Input validation with Pydantic
- Secure environment variable handling

## 📈 Performance

- **Frontend**: React 18 with optimized rendering
- **Backend**: FastAPI with async/await
- **Database**: Optimized MySQL queries with indexes
- **ML Models**: Cached predictions and efficient algorithms
- **Real-time**: Efficient data streaming

## 🐛 Troubleshooting

### Common Issues

1. **MySQL Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Database Setup Issues**
   - Run: `cd backend && python3 setup_database.py`
   - Check MySQL permissions
   - Verify database exists

3. **Import Errors**
   - Install dependencies: `pip3 install -r requirements.txt`
   - Check Python path and virtual environment

4. **Authentication Issues**
   - Check JWT token expiration
   - Verify user exists in database
   - Check password hashing

### Debug Mode
Set `DEBUG=True` in `.env` for detailed error messages and SQL query logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, FastAPI, MySQL, and AI/ML technologies**
