"""
Services layer for database operations and business logic
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from datetime import datetime, timedelta
import json
import random
from typing import List, Dict, Any, Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import math

from database import User, Building, SensorData, Anomaly, Prediction, UserBuilding, SystemEvent

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

class UserService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()
        if not user or not UserService.verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def update_last_login(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.last_login = datetime.now()
            db.commit()
    
    @staticmethod
    def get_user_buildings(db: Session, user_id: int) -> List[Building]:
        user_buildings = db.query(UserBuilding).filter(UserBuilding.user_id == user_id).all()
        building_ids = [ub.building_id for ub in user_buildings]
        return db.query(Building).filter(Building.id.in_(building_ids)).all()

class BuildingService:
    @staticmethod
    def get_buildings(db: Session) -> List[Building]:
        return db.query(Building).filter(Building.is_active == True).all()
    
    @staticmethod
    def get_building_by_id(db: Session, building_id: str) -> Optional[Building]:
        return db.query(Building).filter(Building.building_id == building_id).first()
    
    @staticmethod
    def get_building_data(db: Session, building_id: str, hours: int = 24) -> List[Dict[str, Any]]:
        building = BuildingService.get_building_by_id(db, building_id)
        if not building:
            return []
        
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        # Get existing data from database
        existing_data = db.query(SensorData).filter(
            and_(
                SensorData.building_id == building.id,
                SensorData.timestamp >= start_time,
                SensorData.timestamp <= end_time
            )
        ).order_by(SensorData.timestamp).all()
        
        # If we don't have enough data, generate some
        if len(existing_data) < hours * 4:  # 4 data points per hour
            BuildingService._generate_sample_data(db, building.id, start_time, end_time)
            existing_data = db.query(SensorData).filter(
                and_(
                    SensorData.building_id == building.id,
                    SensorData.timestamp >= start_time,
                    SensorData.timestamp <= end_time
                )
            ).order_by(SensorData.timestamp).all()
        
        return [
            {
                "timestamp": data.timestamp.isoformat(),
                "temperature": data.temperature,
                "humidity": data.humidity,
                "energy_consumption": data.energy_consumption,
                "occupancy": data.occupancy,
                "hvac_status": data.hvac_status,
                "lighting_status": data.lighting_status,
                "air_quality": data.air_quality,
                "hvac_efficiency": data.hvac_efficiency,
                "lighting_efficiency": data.lighting_efficiency
            }
            for data in existing_data
        ]
    
    @staticmethod
    def _generate_sample_data(db: Session, building_id: int, start_time: datetime, end_time: datetime):
        """Generate sample sensor data for the given time range"""
        current = start_time
        data_points = []
        
        while current <= end_time:
            # Generate realistic data based on time of day
            hour = current.hour
            day_of_week = current.weekday()
            
            # Business hours factor
            business_factor = 1.5 if 8 <= hour <= 18 else 0.7
            # Weekend factor
            weekend_factor = 0.6 if day_of_week >= 5 else 1.0
            
            # Base values
            base_temp = 22 + 3 * math.sin((hour - 12) / 12 * math.pi)
            base_energy = 200 * business_factor * weekend_factor
            base_occupancy = 50 * business_factor * weekend_factor
            
            data_point = SensorData(
                building_id=building_id,
                timestamp=current,
                temperature=round(base_temp + random.uniform(-2, 2), 1),
                humidity=round(random.uniform(40, 60), 1),
                energy_consumption=round(base_energy + random.uniform(-20, 20), 2),
                occupancy=round(base_occupancy + random.uniform(-10, 10)),
                hvac_status=random.choice(["active", "idle", "maintenance"]),
                lighting_status=random.choice(["on", "off", "dimmed"]),
                air_quality=round(random.uniform(80, 95), 1),
                hvac_efficiency=round(random.uniform(75, 95), 1),
                lighting_efficiency=round(random.uniform(70, 90), 1)
            )
            data_points.append(data_point)
            current += timedelta(minutes=15)
        
        db.add_all(data_points)
        db.commit()

class AnomalyService:
    @staticmethod
    def get_anomalies(db: Session, building_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        building = BuildingService.get_building_by_id(db, building_id)
        if not building:
            return []
        
        anomalies = db.query(Anomaly).filter(
            and_(
                Anomaly.building_id == building.id,
                Anomaly.is_resolved == False
            )
        ).order_by(desc(Anomaly.timestamp)).limit(limit).all()
        
        return [
            {
                "timestamp": anomaly.timestamp.isoformat(),
                "type": anomaly.anomaly_type,
                "severity": anomaly.severity,
                "description": anomaly.description,
                "confidence": anomaly.confidence,
                "feature_values": json.loads(anomaly.feature_values) if anomaly.feature_values else {}
            }
            for anomaly in anomalies
        ]
    
    @staticmethod
    def create_anomaly(db: Session, building_id: str, anomaly_data: Dict[str, Any]) -> Anomaly:
        building = BuildingService.get_building_by_id(db, building_id)
        if not building:
            raise ValueError("Building not found")
        
        anomaly = Anomaly(
            building_id=building.id,
            timestamp=anomaly_data.get("timestamp", datetime.now()),
            anomaly_type=anomaly_data["type"],
            severity=anomaly_data["severity"],
            confidence=anomaly_data["confidence"],
            description=anomaly_data.get("description", ""),
            feature_values=json.dumps(anomaly_data.get("feature_values", {}))
        )
        
        db.add(anomaly)
        db.commit()
        db.refresh(anomaly)
        return anomaly

class PredictionService:
    @staticmethod
    def get_predictions(db: Session, building_id: str, feature: str, hours_ahead: int = 24) -> List[Dict[str, Any]]:
        building = BuildingService.get_building_by_id(db, building_id)
        if not building:
            return []
        
        # Get recent predictions or generate new ones
        recent_predictions = db.query(Prediction).filter(
            and_(
                Prediction.building_id == building.id,
                Prediction.feature == feature,
                Prediction.timestamp >= datetime.now() - timedelta(hours=1)
            )
        ).order_by(desc(Prediction.timestamp)).limit(hours_ahead).all()
        
        if len(recent_predictions) < hours_ahead:
            # Generate new predictions
            predictions = PredictionService._generate_predictions(building.id, feature, hours_ahead)
            db.add_all(predictions)
            db.commit()
            recent_predictions = predictions
        
        return [
            {
                "timestamp": pred.timestamp.isoformat(),
                "predicted_value": pred.predicted_value,
                "confidence": pred.confidence,
                "factors": json.loads(pred.factors) if pred.factors else {}
            }
            for pred in recent_predictions
        ]
    
    @staticmethod
    def _generate_predictions(building_id: int, feature: str, hours_ahead: int) -> List[Prediction]:
        """Generate LSTM-like predictions"""
        predictions = []
        base_value = random.uniform(200, 400)
        
        for i in range(hours_ahead):
            future_time = datetime.now() + timedelta(hours=i)
            hour_of_day = future_time.hour
            
            # Business hours pattern
            business_factor = 1.5 if 8 <= hour_of_day <= 18 else 0.7
            # Weekly pattern
            weekly_factor = 0.6 if future_time.weekday() >= 5 else 1.0
            # Seasonal trend
            seasonal_factor = 1.3 if future_time.month in [12, 1, 2] else (1.2 if future_time.month in [6, 7, 8] else 1.0)
            
            # Add noise
            noise = random.uniform(-5, 5)
            predicted_value = base_value * business_factor * weekly_factor * seasonal_factor + noise
            
            prediction = Prediction(
                building_id=building_id,
                timestamp=future_time,
                feature=feature,
                predicted_value=round(max(0, predicted_value), 2),
                confidence=round(random.uniform(0.75, 0.95), 3),
                model_type="lstm",
                factors=json.dumps({
                    "business_hours": business_factor,
                    "weekly_pattern": weekly_factor,
                    "seasonal": seasonal_factor
                })
            )
            predictions.append(prediction)
        
        return predictions

class AuthService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            return {"username": username}
        except JWTError:
            return None 