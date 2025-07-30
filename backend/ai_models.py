"""
AI/ML Models for Building Performance Dashboard
This module contains the machine learning models for predictions and anomaly detection.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime, timedelta
import joblib
import os
from typing import List, Dict, Any, Tuple

class BuildingAIModels:
    """AI models for building performance analysis"""
    
    def __init__(self):
        self.lstm_model = None
        self.anomaly_detector = None
        self.clustering_model = None
        self.scaler = StandardScaler()
        self.models_dir = "models"
        
        # Create models directory if it doesn't exist
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)
    
    def train_lstm_model(self, historical_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Train LSTM model for time series prediction
        In a real implementation, this would use TensorFlow/Keras
        """
        # Mock LSTM training
        features = ['temperature', 'humidity', 'energy_consumption', 'occupancy']
        
        # Prepare data
        X = historical_data[features].values
        y = historical_data['energy_consumption'].values
        
        # Simple mock training
        model_info = {
            "model_type": "LSTM",
            "features": features,
            "training_samples": len(historical_data),
            "accuracy": np.random.uniform(0.85, 0.95),
            "training_date": datetime.now().isoformat()
        }
        
        # Save model info
        joblib.dump(model_info, f"{self.models_dir}/lstm_model_info.pkl")
        
        return model_info
    
    def predict_energy_consumption(self, building_id: str, hours_ahead: int = 24) -> List[Dict[str, Any]]:
        """
        Predict energy consumption for the next N hours
        """
        predictions = []
        base_consumption = np.random.uniform(200, 400)
        
        for i in range(hours_ahead):
            # Simulate LSTM prediction with realistic patterns
            hour_of_day = (datetime.now() + timedelta(hours=i)).hour
            
            # Business hours pattern (higher consumption during work hours)
            if 8 <= hour_of_day <= 18:
                business_factor = 1.5
            else:
                business_factor = 0.7
            
            # Weekly pattern (lower on weekends)
            day_of_week = (datetime.now() + timedelta(hours=i)).weekday()
            if day_of_week >= 5:  # Weekend
                weekly_factor = 0.6
            else:
                weekly_factor = 1.0
            
            # Seasonal trend
            month = (datetime.now() + timedelta(hours=i)).month
            if month in [12, 1, 2]:  # Winter
                seasonal_factor = 1.3
            elif month in [6, 7, 8]:  # Summer
                seasonal_factor = 1.2
            else:
                seasonal_factor = 1.0
            
            # Add some noise
            noise = np.random.normal(0, 20)
            
            predicted_consumption = base_consumption * business_factor * weekly_factor * seasonal_factor + noise
            
            predictions.append({
                "timestamp": (datetime.now() + timedelta(hours=i)).isoformat(),
                "predicted_value": round(max(0, predicted_consumption), 2),
                "confidence": round(np.random.uniform(0.75, 0.95), 3),
                "factors": {
                    "business_hours": business_factor,
                    "weekly_pattern": weekly_factor,
                    "seasonal": seasonal_factor
                }
            })
        
        return predictions
    
    def detect_anomalies(self, building_data: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Detect anomalies in building data using Isolation Forest
        """
        if len(building_data) < 10:
            return []
        
        # Prepare features for anomaly detection
        features = ['temperature', 'humidity', 'energy_consumption', 'occupancy']
        X = building_data[features].values
        
        # Train isolation forest
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        iso_forest.fit(X)
        
        # Predict anomalies
        anomaly_scores = iso_forest.decision_function(X)
        anomaly_predictions = iso_forest.predict(X)
        
        anomalies = []
        for i, (score, prediction) in enumerate(zip(anomaly_scores, anomaly_predictions)):
            if prediction == -1:  # Anomaly detected
                timestamp = building_data.iloc[i]['timestamp']
                
                # Determine anomaly type based on feature values
                feature_values = building_data.iloc[i][features]
                anomaly_type = self._classify_anomaly_type(feature_values)
                
                # Calculate severity based on score
                severity = self._calculate_severity(score)
                
                anomalies.append({
                    "timestamp": timestamp.isoformat() if hasattr(timestamp, 'isoformat') else str(timestamp),
                    "type": anomaly_type,
                    "severity": severity,
                    "confidence": round(abs(score), 3),
                    "feature_values": feature_values.to_dict(),
                    "description": f"Anomaly detected in {anomaly_type}"
                })
        
        return anomalies
    
    def cluster_usage_patterns(self, building_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Cluster building usage patterns using K-means
        """
        if len(building_data) < 10:
            return {"clusters": [], "patterns": []}
        
        # Prepare features for clustering
        features = ['temperature', 'humidity', 'energy_consumption', 'occupancy']
        X = building_data[features].values
        
        # Normalize data
        X_scaled = self.scaler.fit_transform(X)
        
        # Perform clustering
        n_clusters = min(3, len(building_data) // 3)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(X_scaled)
        
        # Analyze clusters
        building_data['cluster'] = cluster_labels
        cluster_analysis = []
        
        for cluster_id in range(n_clusters):
            cluster_data = building_data[building_data['cluster'] == cluster_id]
            
            cluster_info = {
                "cluster_id": cluster_id,
                "size": len(cluster_data),
                "percentage": round(len(cluster_data) / len(building_data) * 100, 1),
                "centroid": {
                    "temperature": round(cluster_data['temperature'].mean(), 1),
                    "humidity": round(cluster_data['humidity'].mean(), 1),
                    "energy_consumption": round(cluster_data['energy_consumption'].mean(), 2),
                    "occupancy": round(cluster_data['occupancy'].mean(), 1)
                },
                "pattern_type": self._classify_pattern_type(cluster_data)
            }
            cluster_analysis.append(cluster_info)
        
        return {
            "clusters": cluster_analysis,
            "total_patterns": len(building_data),
            "analysis_date": datetime.now().isoformat()
        }
    
    def _classify_anomaly_type(self, feature_values: pd.Series) -> str:
        """Classify the type of anomaly based on feature values"""
        temp = feature_values['temperature']
        energy = feature_values['energy_consumption']
        occupancy = feature_values['occupancy']
        
        if temp > 25 or temp < 15:
            return "temperature_anomaly"
        elif energy > 500:
            return "energy_consumption_anomaly"
        elif occupancy > 80:
            return "occupancy_anomaly"
        else:
            return "general_anomaly"
    
    def _calculate_severity(self, score: float) -> str:
        """Calculate anomaly severity based on isolation forest score"""
        abs_score = abs(score)
        if abs_score > 0.5:
            return "high"
        elif abs_score > 0.3:
            return "medium"
        else:
            return "low"
    
    def _classify_pattern_type(self, cluster_data: pd.DataFrame) -> str:
        """Classify the type of usage pattern"""
        avg_energy = cluster_data['energy_consumption'].mean()
        avg_occupancy = cluster_data['occupancy'].mean()
        
        if avg_energy > 400 and avg_occupancy > 60:
            return "high_activity"
        elif avg_energy < 200 and avg_occupancy < 20:
            return "low_activity"
        else:
            return "normal_activity"

# Global instance
ai_models = BuildingAIModels() 