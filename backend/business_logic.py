"""
Business logic for real-time building management
"""

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import asyncio
import json
import math
from dataclasses import dataclass
from enum import Enum

from validators import RealTimeSensorData, RealTimeAlert, RealTimeCommand, SensorStatus, AnomalySeverity
from database import get_db, SensorData, Anomaly, Building
from sqlalchemy.orm import Session

class AlertType(str, Enum):
    TEMPERATURE_ANOMALY = "temperature_anomaly"
    ENERGY_SPIKE = "energy_spike"
    OCCUPANCY_ANOMALY = "occupancy_anomaly"
    SYSTEM_FAILURE = "system_failure"
    MAINTENANCE_REQUIRED = "maintenance_required"
    SECURITY_BREACH = "security_breach"
    AIR_QUALITY_ISSUE = "air_quality_issue"

class SystemType(str, Enum):
    HVAC = "hvac"
    LIGHTING = "lighting"
    SECURITY = "security"
    VENTILATION = "ventilation"
    ACCESS_CONTROL = "access_control"

@dataclass
class ThresholdConfig:
    """Configuration for system thresholds"""
    temperature_min: float = 18.0
    temperature_max: float = 26.0
    humidity_min: float = 30.0
    humidity_max: float = 70.0
    energy_threshold: float = 1000.0
    occupancy_max: int = 500
    air_quality_min: float = 50.0
    hvac_efficiency_min: float = 70.0
    lighting_efficiency_min: float = 80.0

class RealTimeBusinessLogic:
    """Business logic for real-time building management"""
    
    def __init__(self):
        self.thresholds = ThresholdConfig()
        self.alert_history: Dict[str, List[RealTimeAlert]] = {}
        self.system_status: Dict[str, Dict[str, Any]] = {}
        self.last_sensor_data: Dict[str, RealTimeSensorData] = {}
    
    async def process_sensor_data(self, sensor_data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Process incoming sensor data and generate alerts if needed"""
        alerts = []
        
        # Store latest data
        key = f"{sensor_data.building_id}_{sensor_data.sensor_id}"
        self.last_sensor_data[key] = sensor_data
        
        # Check temperature anomalies
        temp_alerts = self._check_temperature_anomalies(sensor_data)
        alerts.extend(temp_alerts)
        
        # Check energy consumption
        energy_alerts = self._check_energy_anomalies(sensor_data)
        alerts.extend(energy_alerts)
        
        # Check occupancy anomalies
        occupancy_alerts = self._check_occupancy_anomalies(sensor_data)
        alerts.extend(occupancy_alerts)
        
        # Check system efficiency
        efficiency_alerts = self._check_system_efficiency(sensor_data)
        alerts.extend(efficiency_alerts)
        
        # Check air quality
        air_quality_alerts = self._check_air_quality(sensor_data)
        alerts.extend(air_quality_alerts)
        
        # Update system status
        self._update_system_status(sensor_data)
        
        return alerts
    
    def _check_temperature_anomalies(self, data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Check for temperature-related anomalies"""
        alerts = []
        
        if data.temperature < self.thresholds.temperature_min:
            alerts.append(RealTimeAlert(
                alert_id=f"temp_low_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.TEMPERATURE_ANOMALY,
                severity=AnomalySeverity.MEDIUM if data.temperature < 15 else AnomalySeverity.HIGH,
                message=f"Temperature too low: {data.temperature}°C (min: {self.thresholds.temperature_min}°C)",
                data={"current_temp": data.temperature, "threshold": self.thresholds.temperature_min}
            ))
        
        elif data.temperature > self.thresholds.temperature_max:
            alerts.append(RealTimeAlert(
                alert_id=f"temp_high_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.TEMPERATURE_ANOMALY,
                severity=AnomalySeverity.MEDIUM if data.temperature < 30 else AnomalySeverity.HIGH,
                message=f"Temperature too high: {data.temperature}°C (max: {self.thresholds.temperature_max}°C)",
                data={"current_temp": data.temperature, "threshold": self.thresholds.temperature_max}
            ))
        
        return alerts
    
    def _check_energy_anomalies(self, data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Check for energy consumption anomalies"""
        alerts = []
        
        if data.energy_consumption > self.thresholds.energy_threshold:
            alerts.append(RealTimeAlert(
                alert_id=f"energy_spike_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.ENERGY_SPIKE,
                severity=AnomalySeverity.HIGH if data.energy_consumption > 2000 else AnomalySeverity.MEDIUM,
                message=f"Energy consumption spike: {data.energy_consumption} kWh (threshold: {self.thresholds.energy_threshold} kWh)",
                data={"current_energy": data.energy_consumption, "threshold": self.thresholds.energy_threshold}
            ))
        
        return alerts
    
    def _check_occupancy_anomalies(self, data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Check for occupancy anomalies"""
        alerts = []
        
        if data.occupancy > self.thresholds.occupancy_max:
            alerts.append(RealTimeAlert(
                alert_id=f"occupancy_high_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.OCCUPANCY_ANOMALY,
                severity=AnomalySeverity.MEDIUM,
                message=f"High occupancy detected: {data.occupancy} people (max: {self.thresholds.occupancy_max})",
                data={"current_occupancy": data.occupancy, "threshold": self.thresholds.occupancy_max}
            ))
        
        return alerts
    
    def _check_system_efficiency(self, data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Check system efficiency"""
        alerts = []
        
        if data.hvac_efficiency and data.hvac_efficiency < self.thresholds.hvac_efficiency_min:
            alerts.append(RealTimeAlert(
                alert_id=f"hvac_efficiency_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.MAINTENANCE_REQUIRED,
                severity=AnomalySeverity.MEDIUM,
                message=f"HVAC efficiency low: {data.hvac_efficiency}% (min: {self.thresholds.hvac_efficiency_min}%)",
                data={"current_efficiency": data.hvac_efficiency, "threshold": self.thresholds.hvac_efficiency_min}
            ))
        
        if data.lighting_efficiency and data.lighting_efficiency < self.thresholds.lighting_efficiency_min:
            alerts.append(RealTimeAlert(
                alert_id=f"lighting_efficiency_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.MAINTENANCE_REQUIRED,
                severity=AnomalySeverity.LOW,
                message=f"Lighting efficiency low: {data.lighting_efficiency}% (min: {self.thresholds.lighting_efficiency_min}%)",
                data={"current_efficiency": data.lighting_efficiency, "threshold": self.thresholds.lighting_efficiency_min}
            ))
        
        return alerts
    
    def _check_air_quality(self, data: RealTimeSensorData) -> List[RealTimeAlert]:
        """Check air quality"""
        alerts = []
        
        if data.air_quality and data.air_quality < self.thresholds.air_quality_min:
            alerts.append(RealTimeAlert(
                alert_id=f"air_quality_{data.timestamp.timestamp()}",
                building_id=data.building_id,
                sensor_id=data.sensor_id,
                alert_type=AlertType.AIR_QUALITY_ISSUE,
                severity=AnomalySeverity.HIGH if data.air_quality < 30 else AnomalySeverity.MEDIUM,
                message=f"Poor air quality: {data.air_quality} (min: {self.thresholds.air_quality_min})",
                data={"current_air_quality": data.air_quality, "threshold": self.thresholds.air_quality_min}
            ))
        
        return alerts
    
    def _update_system_status(self, data: RealTimeSensorData):
        """Update system status based on sensor data"""
        building_key = data.building_id
        
        if building_key not in self.system_status:
            self.system_status[building_key] = {}
        
        self.system_status[building_key].update({
            "last_update": data.timestamp.isoformat(),
            "hvac_status": data.hvac_status,
            "lighting_status": data.lighting_status,
            "current_temperature": data.temperature,
            "current_humidity": data.humidity,
            "current_occupancy": data.occupancy,
            "current_energy_consumption": data.energy_consumption
        })
    
    async def process_command(self, command: RealTimeCommand) -> Dict[str, Any]:
        """Process real-time commands"""
        # Validate command
        if command.expires_at and datetime.now() > command.expires_at:
            return {"status": "error", "message": "Command has expired"}
        
        # Process based on target system
        if command.target_system == SystemType.HVAC:
            return await self._process_hvac_command(command)
        elif command.target_system == SystemType.LIGHTING:
            return await self._process_lighting_command(command)
        elif command.target_system == SystemType.SECURITY:
            return await self._process_security_command(command)
        else:
            return {"status": "error", "message": f"Unknown target system: {command.target_system}"}
    
    async def _process_hvac_command(self, command: RealTimeCommand) -> Dict[str, Any]:
        """Process HVAC commands"""
        command_type = command.command_type
        
        if command_type == "set_temperature":
            target_temp = command.parameters.get("temperature")
            if target_temp and 15 <= target_temp <= 30:
                return {
                    "status": "success",
                    "message": f"HVAC temperature set to {target_temp}°C",
                    "command_id": command.command_id
                }
            else:
                return {"status": "error", "message": "Invalid temperature value"}
        
        elif command_type == "set_mode":
            mode = command.parameters.get("mode")
            valid_modes = ["cool", "heat", "fan", "auto", "off"]
            if mode in valid_modes:
                return {
                    "status": "success",
                    "message": f"HVAC mode set to {mode}",
                    "command_id": command.command_id
                }
            else:
                return {"status": "error", "message": "Invalid HVAC mode"}
        
        return {"status": "error", "message": "Unknown HVAC command"}
    
    async def _process_lighting_command(self, command: RealTimeCommand) -> Dict[str, Any]:
        """Process lighting commands"""
        command_type = command.command_type
        
        if command_type == "set_brightness":
            brightness = command.parameters.get("brightness")
            if brightness and 0 <= brightness <= 100:
                return {
                    "status": "success",
                    "message": f"Lighting brightness set to {brightness}%",
                    "command_id": command.command_id
                }
            else:
                return {"status": "error", "message": "Invalid brightness value"}
        
        elif command_type == "set_mode":
            mode = command.parameters.get("mode")
            valid_modes = ["on", "off", "dimmed", "auto"]
            if mode in valid_modes:
                return {
                    "status": "success",
                    "message": f"Lighting mode set to {mode}",
                    "command_id": command.command_id
                }
            else:
                return {"status": "error", "message": "Invalid lighting mode"}
        
        return {"status": "error", "message": "Unknown lighting command"}
    
    async def _process_security_command(self, command: RealTimeCommand) -> Dict[str, Any]:
        """Process security commands"""
        command_type = command.command_type
        
        if command_type == "lockdown":
            return {
                "status": "success",
                "message": "Building lockdown initiated",
                "command_id": command.command_id
            }
        
        elif command_type == "unlock":
            return {
                "status": "success",
                "message": "Building unlocked",
                "command_id": command.command_id
            }
        
        return {"status": "error", "message": "Unknown security command"}
    
    def get_system_status(self, building_id: str) -> Optional[Dict[str, Any]]:
        """Get current system status for a building"""
        return self.system_status.get(building_id)
    
    def get_alert_history(self, building_id: str, limit: int = 50) -> List[RealTimeAlert]:
        """Get alert history for a building"""
        return self.alert_history.get(building_id, [])[-limit:]

# Global instance
business_logic = RealTimeBusinessLogic() 