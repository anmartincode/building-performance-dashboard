from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import random

app = FastAPI(
    title="Building Performance Dashboard API",
    description="AI-Powered Building Management System Backend",
    version="1.0.0"
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

# Mock user database
USERS = {
    "admin": {"password": "admin123", "role": "admin"},
    "facility_manager": {"password": "fm123", "role": "facility_manager"},
    "technician": {"password": "tech123", "role": "technician"},
    "guest": {"password": "guest123", "role": "viewer"}
}

# Mock building data
BUILDINGS = {
    "building_a": {"name": "Main Office", "type": "office", "floors": 10},
    "building_b": {"name": "Data Center", "type": "industrial", "floors": 3},
    "building_c": {"name": "Research Lab", "type": "laboratory", "floors": 5}
}

def authenticate_user(username: str, password: str):
    if username in USERS and USERS[username]["password"] == password:
        return {"username": username, "role": USERS[username]["role"]}
    return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In a real app, you'd verify JWT tokens here
    # For demo purposes, we'll use a simple approach
    token = credentials.credentials
    # Mock token validation
    if token in USERS:
        return {"username": token, "role": USERS[token]["role"]}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials"
    )

# Authentication endpoints
@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    user = authenticate_user(user_data.username, user_data.password)
    if user:
        return {
            "access_token": user_data.username,  # In real app, this would be a JWT
            "token_type": "bearer",
            "user": user
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )

# Building management endpoints
@app.get("/api/buildings")
async def get_buildings(current_user: dict = Depends(get_current_user)):
    return {"buildings": BUILDINGS}

@app.get("/api/buildings/{building_id}/data")
async def get_building_data(
    building_id: str,
    hours: int = 24,
    current_user: dict = Depends(get_current_user)
):
    if building_id not in BUILDINGS:
        raise HTTPException(status_code=404, detail="Building not found")
    
    # Generate mock time series data
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=hours)
    
    data = []
    current = start_time
    while current <= end_time:
        data.append({
            "timestamp": current.isoformat(),
            "temperature": round(random.uniform(18, 25), 1),
            "humidity": round(random.uniform(40, 60), 1),
            "energy_consumption": round(random.uniform(100, 500), 2),
            "occupancy": random.randint(0, 100),
            "hvac_status": random.choice(["active", "idle", "maintenance"]),
            "lighting_status": random.choice(["on", "off", "dimmed"])
        })
        current += timedelta(minutes=15)
    
    return {"building_id": building_id, "data": data}

# AI/ML endpoints
@app.post("/api/predictions")
async def get_predictions(
    request: PredictionRequest,
    current_user: dict = Depends(get_current_user)
):
    # Mock LSTM prediction
    predictions = []
    base_value = random.uniform(50, 200)
    
    for i in range(request.hours_ahead):
        # Simulate LSTM prediction with some trend and seasonality
        trend = 0.1 * i
        seasonality = 10 * np.sin(2 * np.pi * i / 24)
        noise = random.uniform(-5, 5)
        predicted_value = base_value + trend + seasonality + noise
        
        predictions.append({
            "timestamp": (datetime.now() + timedelta(hours=i)).isoformat(),
            "predicted_value": round(predicted_value, 2),
            "confidence": round(random.uniform(0.7, 0.95), 3)
        })
    
    return {
        "building_id": request.building_id,
        "feature": request.feature,
        "predictions": predictions
    }

@app.get("/api/anomalies/{building_id}")
async def get_anomalies(
    building_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Mock anomaly detection
    anomalies = []
    for i in range(random.randint(0, 3)):
        anomalies.append({
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat(),
            "type": random.choice(["temperature_spike", "energy_consumption_anomaly", "occupancy_anomaly"]),
            "severity": random.choice(["low", "medium", "high"]),
            "description": f"Anomaly detected in {building_id}",
            "confidence": round(random.uniform(0.8, 0.99), 3)
        })
    
    return {"building_id": building_id, "anomalies": anomalies}

# System health endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 