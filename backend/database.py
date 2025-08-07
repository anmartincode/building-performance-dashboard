"""
Database configuration and models for Building Performance Dashboard
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root@127.0.0.1:3306/building_dashboard"
)

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="viewer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    user_buildings = relationship("UserBuilding", back_populates="user")

class Building(Base):
    __tablename__ = "buildings"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # office, industrial, laboratory, etc.
    floors = Column(Integer, default=1)
    address = Column(String(255), nullable=True)
    total_area = Column(Float, nullable=True)  # square feet
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user_buildings = relationship("UserBuilding", back_populates="building")
    sensor_data = relationship("SensorData", back_populates="building")
    anomalies = relationship("Anomaly", back_populates="building")
    predictions = relationship("Prediction", back_populates="building")

class UserBuilding(Base):
    __tablename__ = "user_buildings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    access_level = Column(String(50), default="view")  # view, edit, admin
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_buildings")
    building = relationship("Building", back_populates="user_buildings")

class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    energy_consumption = Column(Float, nullable=False)
    occupancy = Column(Integer, nullable=False)
    hvac_status = Column(String(50), nullable=False)
    lighting_status = Column(String(50), nullable=False)
    air_quality = Column(Float, nullable=True)
    hvac_efficiency = Column(Float, nullable=True)
    lighting_efficiency = Column(Float, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    building = relationship("Building", back_populates="sensor_data")

class Anomaly(Base):
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    anomaly_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)  # low, medium, high, critical
    confidence = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    feature_values = Column(Text, nullable=True)  # JSON string
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    building = relationship("Building", back_populates="anomalies")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    feature = Column(String(50), nullable=False)  # energy_consumption, temperature, etc.
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    model_type = Column(String(50), nullable=False)  # lstm, random_forest, etc.
    factors = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    building = relationship("Building", back_populates="predictions")

class SystemEvent(Base):
    __tablename__ = "system_events"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    event_type = Column(String(100), nullable=False)  # maintenance, alert, system_change
    severity = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    resolved_at = Column(DateTime, nullable=True)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Database initialization
def init_db():
    """Initialize the database with tables and sample data"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already initialized with data")
            return
        
        # Create sample users
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        users = [
            User(
                username="admin",
                email="admin@building.com",
                hashed_password=pwd_context.hash("admin123"),
                role="admin"
            ),
            User(
                username="facility_manager",
                email="manager@building.com",
                hashed_password=pwd_context.hash("fm123"),
                role="facility_manager"
            ),
            User(
                username="technician",
                email="tech@building.com",
                hashed_password=pwd_context.hash("tech123"),
                role="technician"
            ),
            User(
                username="guest",
                email="guest@building.com",
                hashed_password=pwd_context.hash("guest123"),
                role="viewer"
            )
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Create sample buildings
        buildings = [
            Building(
                building_id="building_a",
                name="Main Office",
                type="office",
                floors=10,
                address="123 Main St, City, State",
                total_area=50000.0
            ),
            Building(
                building_id="building_b",
                name="Data Center",
                type="industrial",
                floors=3,
                address="456 Tech Ave, City, State",
                total_area=25000.0
            ),
            Building(
                building_id="building_c",
                name="Research Lab",
                type="laboratory",
                floors=5,
                address="789 Science Blvd, City, State",
                total_area=30000.0
            )
        ]
        
        for building in buildings:
            db.add(building)
        db.commit()
        
        # Create user-building relationships
        user_buildings = []
        for user in users:
            for building in buildings:
                access_level = "admin" if user.role == "admin" else "view"
                user_buildings.append(UserBuilding(
                    user_id=user.id,
                    building_id=building.id,
                    access_level=access_level
                ))
        
        for ub in user_buildings:
            db.add(ub)
        db.commit()
        
        print("Database initialized successfully with sample data")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 