# 🏢 Building Performance Dashboard

An AI-powered building management system with real-time monitoring, predictive analytics, and intelligent automation.

## 🚀 Features

### 🔐 Multi-User Authentication
- Role-based access control (Admin, Manager, Technician, Viewer)
- Secure JWT-based authentication
- Permission-based feature access

### 📊 Real-Time Monitoring
- Live sensor data from multiple buildings
- HVAC, Lighting, and Security system monitoring
- Energy consumption tracking
- Occupancy analytics

### 🤖 AI/ML Capabilities
- **LSTM Neural Networks** for energy consumption prediction
- **Random Forest** anomaly detection
- **K-means clustering** for usage pattern analysis
- Real-time predictive analytics

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Interactive charts and visualizations
- Real-time data updates
- Mobile-friendly interface

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Python FastAPI) ←→ AI/ML Models
```

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
- **Authentication**: JWT tokens
- **Documentation**: Auto-generated Swagger UI

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)
```bash
./start-servers.sh
```

### Option 2: Manual Setup

#### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip3 install fastapi uvicorn numpy pandas scikit-learn
```

#### 2. Start the Backend
```bash
cd backend
python3 main.py
```

#### 3. Start the Frontend
```bash
export PATH="/opt/homebrew/bin:$PATH"
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
├── src/                    # React frontend
│   ├── dashboard.js       # Main dashboard component
│   ├── api.js            # API service layer
│   └── index.js          # React entry point
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── ai_models.py      # ML models and algorithms
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── public/               # Static assets
├── package.json          # Node.js dependencies
├── start-servers.sh      # Server startup script
└── README.md            # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication

### Building Management
- `GET /api/buildings` - List all buildings
- `GET /api/buildings/{id}/data` - Get building sensor data

### AI/ML Features
- `POST /api/predictions` - Get LSTM predictions
- `GET /api/anomalies/{id}` - Get anomaly detection results

### System
- `GET /api/health` - Health check

## 🤖 AI/ML Features

### 1. LSTM Neural Networks
- **Purpose**: Energy consumption forecasting
- **Input**: Historical sensor data
- **Output**: 24-hour predictions with confidence scores
- **Features**: Business hours, weekly patterns, seasonal trends

### 2. Random Forest Anomaly Detection
- **Purpose**: Real-time anomaly detection
- **Input**: Multi-sensor data streams
- **Output**: Anomaly scores and classifications
- **Features**: Temperature spikes, energy anomalies, occupancy patterns

### 3. K-means Clustering
- **Purpose**: Usage pattern analysis
- **Input**: Building behavior data
- **Output**: Pattern classifications
- **Features**: High/low activity detection, optimization recommendations

## 🛠️ Development

### Adding New Features

1. **Backend API**: Add endpoints in `backend/main.py`
2. **AI Models**: Implement in `backend/ai_models.py`
3. **Frontend**: Update components in `src/dashboard.js`
4. **API Integration**: Use `src/api.js` for communication

### Environment Variables

Create `.env` files for configuration:

**Backend (.env):**
```env
SECRET_KEY=your-secret-key
MODEL_PATH=./models
DEBUG=True
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
curl -H "Authorization: Bearer admin" \
  http://localhost:8000/api/buildings/building_a/data
```

## 🚀 Production Deployment

### Frontend
```bash
npm run build
# Deploy build/ folder to your web server
```

### Backend
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📊 Data Flow

1. **Sensors** → **Backend API** → **AI Models** → **Frontend Dashboard**
2. **User Actions** → **Frontend** → **Backend API** → **Database/ML Models**
3. **Real-time Updates** → **WebSocket/SSE** → **Frontend Charts**

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- CORS protection
- Input validation with Pydantic
- Secure password handling

## 📈 Performance

- **Frontend**: React 18 with optimized rendering
- **Backend**: FastAPI with async/await
- **ML Models**: Optimized scikit-learn implementations
- **Real-time**: Efficient data streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, FastAPI, and AI/ML technologies**
