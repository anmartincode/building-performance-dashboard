# Building Performance Dashboard - Python Backend

This is the Python FastAPI backend for the Building Performance Dashboard. It provides AI/ML functionality, authentication, and data management APIs.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Backend Server

```bash
python main.py
```

The API will be available at: http://localhost:8000

### 3. API Documentation

Once running, visit: http://localhost:8000/docs

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── ai_models.py         # AI/ML models and algorithms
├── requirements.txt     # Python dependencies
├── models/             # Saved ML models (auto-created)
└── README.md           # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Building Management
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/{building_id}/data` - Get building sensor data

### AI/ML Features
- `POST /api/predictions` - Get LSTM predictions
- `GET /api/anomalies/{building_id}` - Get anomaly detection results

### System
- `GET /api/health` - Health check

## 🤖 AI/ML Features

### 1. LSTM Neural Networks
- Energy consumption prediction
- Time series forecasting
- Pattern recognition

### 2. Random Forest Anomaly Detection
- Real-time anomaly detection
- Multiple sensor fusion
- Confidence scoring

### 3. K-means Clustering
- Usage pattern analysis
- Building behavior classification
- Optimization recommendations

## 🔐 Authentication

The API uses Bearer token authentication. Demo users:

- **Admin:** `admin` / `admin123`
- **Manager:** `facility_manager` / `fm123`
- **Tech:** `technician` / `tech123`
- **Guest:** `guest` / `guest123`

## 🛠️ Development

### Adding New AI Models

1. Add your model to `ai_models.py`
2. Create corresponding API endpoints in `main.py`
3. Update the frontend to use new endpoints

### Environment Variables

Create a `.env` file for configuration:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
MODEL_PATH=./models
```

## 📊 Data Format

### Building Data
```json
{
  "building_id": "building_a",
  "timestamp": "2024-01-15T10:30:00",
  "temperature": 22.5,
  "humidity": 45.2,
  "energy_consumption": 325.8,
  "occupancy": 45,
  "hvac_status": "active",
  "lighting_status": "on"
}
```

### Prediction Response
```json
{
  "building_id": "building_a",
  "feature": "energy_consumption",
  "predictions": [
    {
      "timestamp": "2024-01-15T11:00:00",
      "predicted_value": 340.2,
      "confidence": 0.89
    }
  ]
}
```

## 🔗 Frontend Integration

The React frontend communicates with this backend via HTTP requests. Make sure CORS is properly configured for your frontend URL.

## 🚀 Production Deployment

For production deployment:

1. Use a production ASGI server like Gunicorn
2. Set up proper environment variables
3. Configure database connections
4. Set up monitoring and logging
5. Use HTTPS with proper certificates

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
``` 