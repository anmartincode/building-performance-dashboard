from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import random

# Import database and services
from database import get_db, init_db
from services import UserService, BuildingService, AnomalyService, PredictionService, AuthService
from sqlalchemy.orm import Session

app = FastAPI(
    title="Building Performance Dashboard API",
    description="AI-Powered Building Management System Backend with MySQL Database",
    version="2.0.0"
)

# CORS middleware to allow React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class UserLogin(BaseModel):
    username: str
    password: str

class BuildingData(BaseModel):
    building_id: str
    timestamp: datetime
    temperature: float
    humidity: float
    energy_consumption: float
    occupancy: int
    hvac_status: str
    lighting_status: str

class PredictionRequest(BaseModel):
    building_id: str
    feature: str
    hours_ahead: int = 24

class SensorDataCreate(BaseModel):
    building_id: str
    temperature: float
    humidity: float
    energy_consumption: float
    occupancy: int
    hvac_status: str
    lighting_status: str
    air_quality: Optional[float] = None
    hvac_efficiency: Optional[float] = None
    lighting_efficiency: Optional[float] = None

# Dependency to get current user from JWT token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = AuthService.verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    username = payload.get("username")
    user = UserService.get_user_by_username(db, username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

# Authentication endpoints
@app.post("/api/auth/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = UserService.authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Update last login
    UserService.update_last_login(db, user.id)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = AuthService.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

# Building management endpoints
@app.get("/api/buildings")
async def get_buildings(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get buildings that the user has access to
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    
    buildings_data = []
    for building in user_buildings:
        buildings_data.append({
            "id": building.id,
            "building_id": building.building_id,
            "name": building.name,
            "type": building.type,
            "floors": building.floors,
            "address": building.address,
            "total_area": building.total_area
        })
    
    return {"buildings": buildings_data}

@app.get("/api/buildings/{building_id}/data")
async def get_building_data(
    building_id: str,
    hours: int = 24,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has access to this building
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    building_ids = [b.building_id for b in user_buildings]
    
    if building_id not in building_ids:
        raise HTTPException(status_code=404, detail="Building not found or access denied")
    
    data = BuildingService.get_building_data(db, building_id, hours)
    
    return {"building_id": building_id, "data": data}

@app.post("/api/buildings/{building_id}/sensor-data")
async def create_sensor_data(
    building_id: str,
    sensor_data: SensorDataCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has access to this building
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    building_ids = [b.building_id for b in user_buildings]
    
    if building_id not in building_ids:
        raise HTTPException(status_code=404, detail="Building not found or access denied")
    
    # Get building
    building = BuildingService.get_building_by_id(db, building_id)
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    # Create sensor data record
    from database import SensorData
    new_sensor_data = SensorData(
        building_id=building.id,
        timestamp=sensor_data.timestamp or datetime.now(),
        temperature=sensor_data.temperature,
        humidity=sensor_data.humidity,
        energy_consumption=sensor_data.energy_consumption,
        occupancy=sensor_data.occupancy,
        hvac_status=sensor_data.hvac_status,
        lighting_status=sensor_data.lighting_status,
        air_quality=sensor_data.air_quality,
        hvac_efficiency=sensor_data.hvac_efficiency,
        lighting_efficiency=sensor_data.lighting_efficiency
    )
    
    db.add(new_sensor_data)
    db.commit()
    db.refresh(new_sensor_data)
    
    return {
        "message": "Sensor data created successfully",
        "id": new_sensor_data.id,
        "timestamp": new_sensor_data.timestamp.isoformat()
    }

# AI/ML endpoints
@app.post("/api/predictions")
async def get_predictions(
    request: PredictionRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has access to this building
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    building_ids = [b.building_id for b in user_buildings]
    
    if request.building_id not in building_ids:
        raise HTTPException(status_code=404, detail="Building not found or access denied")
    
    predictions = PredictionService.get_predictions(
        db, request.building_id, request.feature, request.hours_ahead
    )
    
    return {
        "building_id": request.building_id,
        "feature": request.feature,
        "predictions": predictions
    }

@app.get("/api/anomalies/{building_id}")
async def get_anomalies(
    building_id: str,
    limit: int = 10,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has access to this building
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    building_ids = [b.building_id for b in user_buildings]
    
    if building_id not in building_ids:
        raise HTTPException(status_code=404, detail="Building not found or access denied")
    
    anomalies = AnomalyService.get_anomalies(db, building_id, limit)
    
    return {"building_id": building_id, "anomalies": anomalies}

@app.post("/api/anomalies/{building_id}")
async def create_anomaly(
    building_id: str,
    anomaly_data: Dict[str, Any],
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has access to this building
    user_buildings = UserService.get_user_buildings(db, current_user.id)
    building_ids = [b.building_id for b in user_buildings]
    
    if building_id not in building_ids:
        raise HTTPException(status_code=404, detail="Building not found or access denied")
    
    try:
        anomaly = AnomalyService.create_anomaly(db, building_id, anomaly_data)
        return {
            "message": "Anomaly created successfully",
            "id": anomaly.id,
            "timestamp": anomaly.timestamp.isoformat()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# User management endpoints
@app.get("/api/users/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None
    }

@app.get("/api/users/me/buildings")
async def get_user_buildings(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    buildings = UserService.get_user_buildings(db, current_user.id)
    
    buildings_data = []
    for building in buildings:
        buildings_data.append({
            "id": building.id,
            "building_id": building.building_id,
            "name": building.name,
            "type": building.type,
            "floors": building.floors
        })
    
    return {"buildings": buildings_data}

# System health endpoint
@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    }

# Database initialization endpoint
@app.post("/api/init-db")
async def initialize_database():
    try:
        init_db()
        return {"message": "Database initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")

# Startup event
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting Building Performance Dashboard API with MySQL Database")
    print("📊 Database URL:", "mysql+pymysql://root:password@localhost:3306/building_dashboard")
    print("🔧 API Documentation available at: http://localhost:8000/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 