"""
Data validation models and business logic for real-time features
"""

from pydantic import BaseModel, field_validator, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
import re

class SensorStatus(str, Enum):
    ACTIVE = "active"
    IDLE = "idle"
    MAINTENANCE = "maintenance"
    ERROR = "error"
    OFFLINE = "offline"

class LightingStatus(str, Enum):
    ON = "on"
    OFF = "off"
    DIMMED = "dimmed"
    AUTO = "auto"

class AnomalySeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class RealTimeSensorData(BaseModel):
    """Real-time sensor data with comprehensive validation"""
    building_id: str = Field(..., min_length=1, max_length=50, description="Building identifier")
    sensor_id: str = Field(..., min_length=1, max_length=50, description="Sensor identifier")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data timestamp")
    
    # Environmental data
    temperature: float = Field(..., ge=-50, le=100, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    air_quality: Optional[float] = Field(None, ge=0, le=500, description="Air quality index")
    
    # Energy data
    energy_consumption: float = Field(..., ge=0, le=10000, description="Energy consumption in kWh")
    power_factor: Optional[float] = Field(None, ge=0, le=1, description="Power factor")
    voltage: Optional[float] = Field(None, ge=0, le=1000, description="Voltage in volts")
    current: Optional[float] = Field(None, ge=0, le=1000, description="Current in amperes")
    
    # Occupancy and usage
    occupancy: int = Field(..., ge=0, le=1000, description="Number of occupants")
    occupancy_density: Optional[float] = Field(None, ge=0, le=10, description="Occupants per square meter")
    
    # System status
    hvac_status: SensorStatus = Field(..., description="HVAC system status")
    lighting_status: LightingStatus = Field(..., description="Lighting system status")
    hvac_efficiency: Optional[float] = Field(None, ge=0, le=100, description="HVAC efficiency percentage")
    lighting_efficiency: Optional[float] = Field(None, ge=0, le=100, description="Lighting efficiency percentage")
    
    # Additional metadata
    location: Optional[str] = Field(None, max_length=100, description="Sensor location within building")
    floor: Optional[int] = Field(None, ge=0, le=200, description="Floor number")
    zone: Optional[str] = Field(None, max_length=50, description="Building zone")
    
    @field_validator('building_id')
    @classmethod
    def validate_building_id(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Building ID must contain only alphanumeric characters, hyphens, and underscores')
        return v
    
    @field_validator('sensor_id')
    @classmethod
    def validate_sensor_id(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Sensor ID must contain only alphanumeric characters, hyphens, and underscores')
        return v
    
    @field_validator('temperature', 'humidity', 'energy_consumption')
    @classmethod
    def validate_realistic_values(cls, v, info):
        field_name = info.field_name
        if field_name == 'temperature' and (v < -20 or v > 50):
            raise ValueError('Temperature seems unrealistic for indoor environment')
        elif field_name == 'humidity' and (v < 10 or v > 90):
            raise ValueError('Humidity seems unrealistic for indoor environment')
        elif field_name == 'energy_consumption' and v > 5000:
            raise ValueError('Energy consumption seems unusually high')
        return v
    
    @field_validator('occupancy')
    @classmethod
    def validate_occupancy(cls, v, info):
        # Get the data from the model being validated
        data = info.data
        if data and 'occupancy_density' in data and data['occupancy_density']:
            # Validate occupancy density consistency
            pass
        return v

class RealTimeAlert(BaseModel):
    """Real-time alert with validation"""
    alert_id: str = Field(..., description="Unique alert identifier")
    building_id: str = Field(..., description="Building identifier")
    sensor_id: Optional[str] = Field(None, description="Sensor identifier")
    alert_type: str = Field(..., description="Type of alert")
    severity: AnomalySeverity = Field(..., description="Alert severity")
    message: str = Field(..., max_length=500, description="Alert message")
    timestamp: datetime = Field(default_factory=datetime.now, description="Alert timestamp")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional alert data")
    is_acknowledged: bool = Field(default=False, description="Whether alert is acknowledged")
    acknowledged_by: Optional[str] = Field(None, description="User who acknowledged the alert")
    acknowledged_at: Optional[datetime] = Field(None, description="When alert was acknowledged")

class RealTimeCommand(BaseModel):
    """Real-time command for controlling building systems"""
    command_id: str = Field(..., description="Unique command identifier")
    building_id: str = Field(..., description="Building identifier")
    target_system: str = Field(..., description="Target system (hvac, lighting, security)")
    command_type: str = Field(..., description="Type of command")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Command parameters")
    timestamp: datetime = Field(default_factory=datetime.now, description="Command timestamp")
    priority: int = Field(default=1, ge=1, le=10, description="Command priority (1-10)")
    expires_at: Optional[datetime] = Field(None, description="Command expiration time")
    
    @field_validator('target_system')
    @classmethod
    def validate_target_system(cls, v):
        allowed_systems = ['hvac', 'lighting', 'security', 'ventilation', 'access_control']
        if v not in allowed_systems:
            raise ValueError(f'Target system must be one of: {allowed_systems}')
        return v
    
    @field_validator('priority')
    @classmethod
    def validate_priority(cls, v):
        if v < 1 or v > 10:
            raise ValueError('Priority must be between 1 and 10')
        return v

class WebSocketMessage(BaseModel):
    """WebSocket message structure"""
    message_type: str = Field(..., description="Type of message")
    data: Dict[str, Any] = Field(..., description="Message data")
    timestamp: datetime = Field(default_factory=datetime.now, description="Message timestamp")
    message_id: Optional[str] = Field(None, description="Unique message identifier")
    
    @field_validator('message_type')
    @classmethod
    def validate_message_type(cls, v):
        allowed_types = ['sensor_data', 'alert', 'command', 'status_update', 'heartbeat']
        if v not in allowed_types:
            raise ValueError(f'Message type must be one of: {allowed_types}')
        return v 