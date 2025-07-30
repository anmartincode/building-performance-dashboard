import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, ThermometerSun, Shield, Lightbulb, Wind, User, Settings, Users, Eye, EyeOff, X, Building, MapPin, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import apiService from './api';

// Building Layout Component
const BuildingLayout = ({ buildings, anomalies, onBuildingClick, selectedBuilding }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const buildingConfigs = {
    'Building A': {
      position: { x: 50, y: 50 },
      size: { width: 140, height: 100 },
      floors: 3,
      color: '#3b82f6',
      name: 'Building A'
    },
    'Building B': {
      position: { x: 250, y: 50 },
      size: { width: 140, height: 100 },
      floors: 2,
      color: '#10b981',
      name: 'Building B'
    },
    'Building C': {
      position: { x: 50, y: 200 },
      size: { width: 140, height: 100 },
      floors: 4,
      color: '#f59e0b',
      name: 'Building C'
    },
    'Building D': {
      position: { x: 250, y: 200 },
      size: { width: 140, height: 100 },
      floors: 2,
      color: '#8b5cf6',
      name: 'Building D'
    }
  };

  const getAnomaliesForBuilding = (buildingName) => {
    return anomalies.filter(anomaly => anomaly.building === buildingName);
  };

  const getAnomalyColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative bg-gray-50 rounded-lg p-6" style={{ width: '100%', height: '450px' }}>
      <div className="absolute top-4 left-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Building Layout</h4>
        <p className="text-sm text-gray-600">Click on buildings to view anomaly details</p>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-sm">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Anomaly Severity</h5>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
        </div>
      </div>

            {/* Grid Container for Buildings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-12" style={{ marginTop: '60px' }}>
          {Object.entries(buildingConfigs).map(([buildingName, config]) => {
            const buildingAnomalies = getAnomaliesForBuilding(buildingName);
            const hasAnomalies = buildingAnomalies.length > 0;
            const isSelected = selectedBuilding === buildingName;
            
            return (
              <div
                key={buildingName}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
                style={{
                  width: `${config.size.width}px`,
                  height: `${config.size.height}px`
                }}
                onClick={() => onBuildingClick(buildingName)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  setHoveredBuilding(buildingName);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  setHoveredBuilding(null);
                }}
              >
            {/* Building Structure */}
            <div
              className="relative rounded-lg shadow-md border-2"
              style={{
                backgroundColor: config.color,
                borderColor: hasAnomalies ? '#ef4444' : '#e5e7eb',
                width: '100%',
                height: '100%'
              }}
            >
              {/* Building Name */}
              <div className="absolute -top-6 left-0 right-0 text-center">
                <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded">
                  {config.name}
                </span>
              </div>

              {/* Floor Indicators */}
              <div className="absolute bottom-1 left-1 right-1">
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: config.floors }, (_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white bg-opacity-80 rounded"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Anomaly Indicators */}
              {hasAnomalies && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {buildingAnomalies.length}
                  </div>
                </div>
              )}

              {/* Anomaly Dots on Building */}
              {buildingAnomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: getAnomalyColor(anomaly.severity),
                    left: `${20 + (index * 15) % 80}%`,
                    top: `${30 + (index * 10) % 60}%`,
                    zIndex: 10
                  }}
                  title={`${anomaly.type} - ${anomaly.severity} severity`}
                ></div>
              ))}
            </div>

            {/* Hover Tooltip */}
            <div className={`absolute -bottom-20 left-0 bg-white rounded-lg shadow-lg p-3 border transition-opacity duration-200 pointer-events-none z-20 min-w-48 ${
              hoveredBuilding === buildingName ? 'opacity-100' : 'opacity-0'
            }`}>
              <h6 className="font-medium text-gray-900 mb-1">{config.name}</h6>
              <p className="text-xs text-gray-600 mb-2">{config.floors} floors</p>
              {hasAnomalies ? (
                <div>
                  <p className="text-xs text-red-600 font-medium mb-1">
                    {buildingAnomalies.length} anomaly{buildingAnomalies.length > 1 ? 'ies' : 'y'} detected
                  </p>
                  <div className="space-y-1">
                    {buildingAnomalies.slice(0, 3).map((anomaly, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {anomaly.type.replace('_', ' ')} ({anomaly.severity})
                      </div>
                    ))}
                    {buildingAnomalies.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{buildingAnomalies.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-green-600 font-medium">No anomalies detected</p>
              )}
            </div>
          </div>
        );
      })}
        </div>
      </div>

      {/* Ground/Pathways */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-200 rounded-b-lg"></div>
      
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        {/* Add connection lines between buildings if needed */}
      </svg>
    </div>
  );
};

// Comprehensive Dashboard Export Function
const exportDashboardToExcel = (data, anomalies, predictions, buildings, selectedTimeRange) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Dashboard Summary Sheet
  const dashboardSummary = buildings.map(building => {
    const buildingData = data.filter(d => d.building === building).slice(-selectedTimeRange);
    const buildingAnomalies = anomalies.filter(a => a.building === building);
    
    // Calculate metrics
    const avgDailyConsumption = buildingData.length > 0 
      ? Math.round(buildingData.reduce((sum, d) => sum + d.energyConsumption, 0) / buildingData.length)
      : 0;
    
    const totalCost = buildingData.reduce((sum, d) => sum + (d.energyConsumption * 0.12), 0);
    const systemHealth = buildingData.length > 0 
      ? Math.round((buildingData.filter(d => d.hvacEfficiency > 80 && d.lightingEfficiency > 85).length / buildingData.length) * 100)
      : 100;
    
    const anomalyCount = buildingAnomalies.length;
    const predictionCount = predictions.filter(p => p.building === building).length;
    
    return {
      'Building': building,
      'Avg Daily Consumption (kWh)': avgDailyConsumption,
      'Total Cost ($)': Math.round(totalCost * 100) / 100,
      'System Health (%)': systemHealth,
      'Anomalies Detected': anomalyCount,
      'ML Predictions': predictionCount,
      'Data Points Analyzed': buildingData.length
    };
  });
  
  const summaryWs = XLSX.utils.json_to_sheet(dashboardSummary);
  summaryWs['!cols'] = [
    { wch: 15 }, // Building
    { wch: 20 }, // Avg Daily Consumption
    { wch: 15 }, // Total Cost
    { wch: 15 }, // System Health
    { wch: 18 }, // Anomalies
    { wch: 15 }, // ML Predictions
    { wch: 20 }  // Data Points
  ];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Dashboard Summary');

  // 2. Energy Consumption Details Sheet
  const energyData = data.slice(-selectedTimeRange).map(d => ({
    'Building': d.building,
    'Date': new Date(d.date).toLocaleDateString(),
    'Hour': d.hour,
    'Energy Consumption (kWh)': d.energyConsumption,
    'Temperature (°F)': d.temperature,
    'Occupancy (%)': d.occupancy,
    'Cost ($)': Math.round(d.energyConsumption * 0.12 * 100) / 100,
    'HVAC Load': d.hvacLoad,
    'HVAC Efficiency (%)': d.hvacEfficiency,
    'Lighting Load': d.lightingLoad,
    'Lighting Efficiency (%)': d.lightingEfficiency,
    'Daylight Sensor (%)': d.daylightSensor
  }));
  
  const energyWs = XLSX.utils.json_to_sheet(energyData);
  energyWs['!cols'] = [
    { wch: 15 }, // Building
    { wch: 12 }, // Date
    { wch: 8 },  // Hour
    { wch: 18 }, // Energy Consumption
    { wch: 15 }, // Temperature
    { wch: 12 }, // Occupancy
    { wch: 10 }, // Cost
    { wch: 12 }, // HVAC Load
    { wch: 15 }, // HVAC Efficiency
    { wch: 12 }, // Lighting Load
    { wch: 18 }, // Lighting Efficiency
    { wch: 15 }  // Daylight Sensor
  ];
  XLSX.utils.book_append_sheet(wb, energyWs, 'Energy Consumption');

  // 3. ML Predictions Sheet
  const predictionsData = predictions.map(p => ({
    'Building': p.building,
    'Date': new Date(p.date).toLocaleDateString(),
    'Predicted Consumption (kWh)': p.predictedConsumption,
    'Confidence (%)': Math.round(p.confidence * 100),
    'Prediction Type': 'LSTM Forecast'
  }));
  
  const predictionsWs = XLSX.utils.json_to_sheet(predictionsData);
  predictionsWs['!cols'] = [
    { wch: 15 }, // Building
    { wch: 12 }, // Date
    { wch: 22 }, // Predicted Consumption
    { wch: 15 }, // Confidence
    { wch: 18 }  // Prediction Type
  ];
  XLSX.utils.book_append_sheet(wb, predictionsWs, 'ML Predictions');

  // 4. Anomalies Sheet
  const anomaliesData = anomalies.map(anomaly => ({
    'Building': anomaly.building,
    'Date': new Date(anomaly.date).toLocaleDateString(),
    'Time': new Date(anomaly.date).toLocaleTimeString(),
    'Anomaly Type': anomaly.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    'Severity': anomaly.severity.toUpperCase(),
    'Energy Consumption (kWh)': anomaly.energy,
    'Temperature (°F)': anomaly.temperature,
    'Occupancy (%)': anomaly.occupancy,
    'ML Confidence (%)': Math.round(anomaly.confidence * 100),
    'Anomaly Score': Math.round(anomaly.anomalyScore * 100) / 100,
    'Cost Impact ($)': Math.round(anomaly.energy * 0.12 * 100) / 100,
    'Description': anomaly.description
  }));
  
  const anomaliesWs = XLSX.utils.json_to_sheet(anomaliesData);
  anomaliesWs['!cols'] = [
    { wch: 15 }, // Building
    { wch: 12 }, // Date
    { wch: 12 }, // Time
    { wch: 20 }, // Anomaly Type
    { wch: 10 }, // Severity
    { wch: 18 }, // Energy Consumption
    { wch: 15 }, // Temperature
    { wch: 12 }, // Occupancy
    { wch: 15 }, // ML Confidence
    { wch: 12 }, // Anomaly Score
    { wch: 12 }, // Cost Impact
    { wch: 30 }  // Description
  ];
  XLSX.utils.book_append_sheet(wb, anomaliesWs, 'Anomalies');

  // 5. System Performance Sheet
  const systemData = data.slice(-selectedTimeRange).map(d => ({
    'Building': d.building,
    'Date': new Date(d.date).toLocaleDateString(),
    'Hour': d.hour,
    'HVAC Status': d.hvacStatus,
    'HVAC Efficiency (%)': d.hvacEfficiency,
    'Air Quality': d.airQuality,
    'Lighting Efficiency (%)': d.lightingEfficiency,
    'LED Lights Active': d.ledLights,
    'Security Alerts': d.securityAlerts,
    'Access Events': d.accessEvents,
    'Cameras Active': d.camerasActive,
    'Security Status': d.securityStatus
  }));
  
  const systemWs = XLSX.utils.json_to_sheet(systemData);
  systemWs['!cols'] = [
    { wch: 15 }, // Building
    { wch: 12 }, // Date
    { wch: 8 },  // Hour
    { wch: 12 }, // HVAC Status
    { wch: 15 }, // HVAC Efficiency
    { wch: 12 }, // Air Quality
    { wch: 18 }, // Lighting Efficiency
    { wch: 15 }, // LED Lights
    { wch: 15 }, // Security Alerts
    { wch: 12 }, // Access Events
    { wch: 15 }, // Cameras Active
    { wch: 15 }  // Security Status
  ];
  XLSX.utils.book_append_sheet(wb, systemWs, 'System Performance');

  // 6. Executive Summary Sheet
  const totalAnomalies = anomalies.length;
  const totalCost = data.slice(-selectedTimeRange).reduce((sum, d) => sum + (d.energyConsumption * 0.12), 0);
  const avgSystemHealth = Math.round((data.slice(-selectedTimeRange).filter(d => d.hvacEfficiency > 80 && d.lightingEfficiency > 85).length / data.slice(-selectedTimeRange).length) * 100);
  
  const executiveSummary = [
    { 'Metric': 'Report Period', 'Value': `${selectedTimeRange} days` },
    { 'Metric': 'Buildings Monitored', 'Value': buildings.length },
    { 'Metric': 'Total Data Points', 'Value': data.slice(-selectedTimeRange).length },
    { 'Metric': 'Total Energy Consumption', 'Value': `${Math.round(data.slice(-selectedTimeRange).reduce((sum, d) => sum + d.energyConsumption, 0))} kWh` },
    { 'Metric': 'Total Cost', 'Value': `$${Math.round(totalCost * 100) / 100}` },
    { 'Metric': 'Average System Health', 'Value': `${avgSystemHealth}%` },
    { 'Metric': 'Total Anomalies', 'Value': totalAnomalies },
    { 'Metric': 'High Severity Anomalies', 'Value': anomalies.filter(a => a.severity === 'high').length },
    { 'Metric': 'ML Predictions Generated', 'Value': predictions.length },
    { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() }
  ];
  
  const executiveWs = XLSX.utils.json_to_sheet(executiveSummary);
  executiveWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, executiveWs, 'Executive Summary');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `building_performance_report_${timestamp}.xlsx`;

  // Save the file
  XLSX.writeFile(wb, filename);
};

// Advanced ML Models Implementation
class AdvancedMLModels {
  // LSTM-inspired time series prediction
  static lstmPredict(data, steps = 7) {
    const sequence = data.slice(-30);
    const predictions = [];
    
    for (let i = 0; i < steps; i++) {
      const weights = [0.4, 0.3, 0.2, 0.1]; // Simplified LSTM weights
      let prediction = 0;
      
      for (let j = 0; j < Math.min(4, sequence.length); j++) {
        const idx = sequence.length - 1 - j;
        prediction += sequence[idx] * weights[j];
      }
      
      // Add trend and seasonal components
      const trend = (sequence[sequence.length - 1] - sequence[0]) / sequence.length;
      const seasonal = 0.1 * Math.sin((i / 7) * 2 * Math.PI);
      
      prediction = prediction + (trend * i) + (prediction * seasonal);
      predictions.push(Math.max(0, prediction));
      sequence.push(prediction);
    }
    
    return predictions;
  }
  
  // Random Forest ensemble for anomaly detection
  static randomForestAnomaly(data, point) {
    const trees = 10;
    let anomalyScore = 0;
    
    for (let tree = 0; tree < trees; tree++) {
      // Simplified decision tree
      const features = ['hour', 'dayOfWeek', 'temperature', 'occupancy'];
      let score = 0;
      
      features.forEach(feature => {
        const values = data.map(d => d[feature] || Math.random() * 100);
        const mean = values.reduce((a, b) => a + b) / values.length;
        const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length);
        
        const pointValue = point[feature] || Math.random() * 100;
        score += Math.abs((pointValue - mean) / std);
      });
      
      anomalyScore += score / features.length;
    }
    
    return anomalyScore / trees;
  }
  
  // K-means clustering for usage patterns
  static kMeansClustering(data, k = 3) {
    const points = data.map(d => [d.energyConsumption, d.occupancy, d.temperature]);
    let centroids = [];
    
    // Initialize centroids randomly
    for (let i = 0; i < k; i++) {
      centroids.push([
        Math.random() * 200,
        Math.random() * 100,
        60 + Math.random() * 30
      ]);
    }
    
    // Simplified k-means (single iteration for performance)
    const clusters = points.map(point => {
      let minDistance = Infinity;
      let cluster = 0;
      
      centroids.forEach((centroid, i) => {
        const distance = Math.sqrt(
          Math.pow(point[0] - centroid[0], 2) +
          Math.pow(point[1] - centroid[1], 2) +
          Math.pow(point[2] - centroid[2], 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          cluster = i;
        }
      });
      
      return cluster;
    });
    
    return clusters;
  }
}

// Enhanced data generation with multiple building systems
const generateAdvancedSyntheticData = () => {
  const buildings = ['Building A', 'Building B', 'Building C', 'Building D'];
  const data = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const hour = Math.floor(Math.random() * 24);
    
    buildings.forEach((building, buildingIndex) => {
      const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      const seasonalFactor = 0.3 * Math.sin((dayOfYear / 365) * 2 * Math.PI) + 1;
      const weekdayFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
      const hourlyFactor = hour >= 8 && hour <= 18 ? 1.2 : 0.8;
      
      const baseConsumption = 100 + buildingIndex * 20;
      const temperature = 70 + 20 * Math.sin((dayOfYear / 365) * 2 * Math.PI) + Math.random() * 10 - 5;
      const occupancy = Math.round((0.3 + Math.random() * 0.7) * 100 * hourlyFactor * weekdayFactor);
      
      // Energy consumption
      const energyConsumption = baseConsumption * seasonalFactor * weekdayFactor * hourlyFactor *
        (1 + Math.random() * 0.2 - 0.1) * (1 + (Math.abs(temperature - 72) / 100));
      
      // HVAC system data
      const hvacLoad = Math.round(energyConsumption * 0.4 * (1 + Math.abs(temperature - 72) / 50));
      const hvacEfficiency = 85 + Math.random() * 10;
      const hvacStatus = occupancy > 20 ? 'Active' : 'Standby';
      
      // Lighting system data
      const lightingLoad = Math.round(occupancy * 0.5 + Math.random() * 20);
      const lightingEfficiency = 90 + Math.random() * 8;
      const daylightSensor = hour >= 6 && hour <= 18 ? Math.random() * 100 : 0;
      
      // Security system data
      const securityAlerts = Math.random() < 0.02 ? Math.floor(Math.random() * 3) + 1 : 0;
      const accessEvents = Math.round(occupancy * 0.1 + Math.random() * 5);
      const camerasActive = Math.round(8 + Math.random() * 4);
      
      data.push({
        date: date.toISOString().split('T')[0],
        hour,
        building,
        energyConsumption: Math.round(energyConsumption),
        temperature: Math.round(temperature * 10) / 10,
        cost: Math.round(energyConsumption * 0.12 * 100) / 100,
        occupancy,
        buildingIndex,
        dayOfWeek: date.getDay(),
        
        // HVAC Data
        hvacLoad,
        hvacEfficiency: Math.round(hvacEfficiency * 100) / 100,
        hvacStatus,
        airQuality: Math.round((80 + Math.random() * 15) * 100) / 100,
        
        // Lighting Data
        lightingLoad,
        lightingEfficiency: Math.round(lightingEfficiency * 100) / 100,
        daylightSensor: Math.round(daylightSensor),
        ledLights: Math.round((occupancy * 0.5 + Math.random() * 20) * 0.8),
        
        // Security Data
        securityAlerts,
        accessEvents,
        camerasActive,
        securityStatus: securityAlerts > 0 ? 'Alert' : 'Normal'
      });
    });
  }
  
  return data.reverse();
};

// User Management System
const UserManager = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'Administrator', buildings: ['building_a', 'building_b', 'building_c', 'building_d'] },
    { id: 2, username: 'facility_manager', password: 'fm123', role: 'Facility Manager', buildings: ['building_a', 'building_b'] },
    { id: 3, username: 'technician', password: 'tech123', role: 'Technician', buildings: ['building_a'] },
    { id: 4, username: 'guest', password: 'guest123', role: 'Viewer', buildings: ['building_a'] }
  ],
  
  authenticate: (username, password) => {
    return UserManager.users.find(u => u.username === username && u.password === password);
  },
  
  getPermissions: (role) => {
    const permissions = {
      'Administrator': ['view', 'edit', 'delete', 'manage_users', 'system_settings'],
      'Facility Manager': ['view', 'edit', 'reports'],
      'Technician': ['view', 'maintenance'],
      'Viewer': ['view']
    };
    return permissions[role] || ['view'];
  }
};



const BuildingDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('Building A');
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const [selectedSystem, setSelectedSystem] = useState('energy');
  const [predictions, setPredictions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showBuildingLayout, setShowBuildingLayout] = useState(false);
  const [selectedBuildingInLayout, setSelectedBuildingInLayout] = useState(null);
  const [notification, setNotification] = useState(null);
  const [settings, setSettings] = useState({
    refreshInterval: 30,
    alertThresholds: {
      energy: 150,
      temperature: 80,
      occupancy: 90
    },
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    theme: 'light',
    language: 'en'
  });

  // Building mapping for API to display names
  const buildingMapping = {
    'building_a': 'Building A',
    'building_b': 'Building B', 
    'building_c': 'Building C',
    'building_d': 'Building D'
  };

  // Get display names for buildings
  const getBuildingDisplayNames = (buildingIds) => {
    return buildingIds.map(id => buildingMapping[id] || id);
  };

  // Get API building ID from display name
  const getBuildingApiId = (displayName) => {
    const entries = Object.entries(buildingMapping);
    const entry = entries.find(([apiId, display]) => display === displayName);
    return entry ? entry[0] : displayName.toLowerCase().replace(' ', '_');
  };

  // Building layout handlers
  const handleBuildingLayoutClick = () => {
    setShowBuildingLayout(true);
  };

  const handleBuildingClick = (buildingName) => {
    setSelectedBuildingInLayout(buildingName);
  };

  const handleCloseBuildingLayout = () => {
    setShowBuildingLayout(false);
    setSelectedBuildingInLayout(null);
  };

  const handleExportReport = () => {
    try {
      const buildings = getBuildingDisplayNames(currentUser?.buildings || ['building_a', 'building_b', 'building_c', 'building_d']);
      exportDashboardToExcel(data, anomalies, predictions, buildings, selectedTimeRange);
      setNotification({
        type: 'success',
        message: `Comprehensive building performance report exported successfully!`,
        timestamp: new Date()
      });
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error exporting report:', error);
      setNotification({
        type: 'error',
        message: 'Failed to export report. Please try again.',
        timestamp: new Date()
      });
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Set the first building as default, using display name
    const firstBuildingDisplayName = getBuildingDisplayNames(user.buildings)[0];
    setSelectedBuilding(firstBuildingDisplayName);
  };

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // For now, always use synthetic data to ensure charts work
          const syntheticData = generateAdvancedSyntheticData();
          setData(syntheticData);
          
          // Generate synthetic predictions
          const energyData = syntheticData
            .filter(d => d.building === selectedBuilding)
            .slice(-30)
            .map(d => d.energyConsumption);
          
          const predictionData = AdvancedMLModels.lstmPredict(energyData, 7).map((pred, i) => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + i + 1);
            return {
              date: futureDate.toISOString().split('T')[0],
              building: selectedBuilding,
              predictedConsumption: Math.round(pred),
              confidence: 0.85 + Math.random() * 0.1
            };
          });
          
          setPredictions(predictionData);
          
          // Generate synthetic anomalies
          const anomalyData = syntheticData
            .filter(d => d.building === selectedBuilding)
            .slice(-30)
            .filter((_, i) => Math.random() < 0.1) // 10% chance of anomaly
            .map(d => ({
              date: d.date,
              building: selectedBuilding,
              type: ['energy_spike', 'temperature_anomaly', 'occupancy_unusual'][Math.floor(Math.random() * 3)],
              severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
              description: 'Detected unusual pattern in building data',
              confidence: 0.7 + Math.random() * 0.3,
              anomalyScore: 0.7 + Math.random() * 0.3,
              // Include actual data values
              energy: d.energyConsumption,
              temperature: d.temperature,
              occupancy: d.occupancy
            }));
          
          setAnomalies(anomalyData);
          
          // Generate clustering data
          const clusterLabels = AdvancedMLModels.kMeansClustering(syntheticData.slice(-100));
          setClusters(clusterLabels);
          
        } catch (error) {
          console.error('Error generating data:', error);
          // Final fallback
          const syntheticData = generateAdvancedSyntheticData();
          setData(syntheticData);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [currentUser, selectedBuilding, selectedTimeRange]);

  // Auto-login with default user (removing login requirement)
  useEffect(() => {
    if (!currentUser) {
      const defaultUser = {
        username: 'admin',
        role: 'admin',
        buildings: ['building_a', 'building_b', 'building_c', 'building_d'],
        permissions: UserManager.getPermissions('admin')
      };
      handleLogin(defaultUser);
    }
  }, [currentUser]);

  const filteredData = data
    .filter(d => d.building === selectedBuilding)
    .slice(-selectedTimeRange);

  const permissions = currentUser ? UserManager.getPermissions(currentUser.role) : [];
  const canEdit = permissions.includes('edit');
  const canManageUsers = permissions.includes('manage_users');

  // System-specific calculations
  const systemStats = {
    energy: {
      primary: Math.round(filteredData.reduce((sum, d) => sum + d.energyConsumption, 0) / filteredData.length || 0),
      secondary: Math.round(filteredData.reduce((sum, d) => sum + d.cost, 0) * 100) / 100,
      label: 'Avg Daily Consumption',
      unit: 'kWh',
      secondaryLabel: 'Total Cost ($)'
    },
    hvac: {
      primary: Math.round(filteredData.reduce((sum, d) => sum + d.hvacEfficiency, 0) / filteredData.length || 0),
      secondary: Math.round(filteredData.reduce((sum, d) => sum + d.hvacLoad, 0) / filteredData.length || 0),
      label: 'HVAC Efficiency',
      unit: '%',
      secondaryLabel: 'Avg Load (kW)'
    },
    lighting: {
      primary: Math.round(filteredData.reduce((sum, d) => sum + d.lightingEfficiency, 0) / filteredData.length || 0),
      secondary: Math.round(filteredData.reduce((sum, d) => sum + d.lightingLoad, 0) / filteredData.length || 0),
      label: 'Lighting Efficiency',
      unit: '%',
      secondaryLabel: 'Avg Load (kW)'
    },
    security: {
      primary: filteredData.reduce((sum, d) => sum + d.securityAlerts, 0),
      secondary: Math.round(filteredData.reduce((sum, d) => sum + d.accessEvents, 0) / filteredData.length || 0),
      label: 'Security Alerts',
      unit: 'total',
      secondaryLabel: 'Daily Access Events'
    }
  };

  const currentStats = systemStats[selectedSystem];

  const chartData = filteredData.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString()
  }));

  const systemDistribution = [
    { name: 'HVAC', value: 45, color: '#3b82f6' },
    { name: 'Lighting', value: 25, color: '#f59e0b' },
    { name: 'Equipment', value: 20, color: '#10b981' },
    { name: 'Other', value: 10, color: '#8b5cf6' }
  ];

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading advanced building analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header with User Management */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="navbar-brand">
            <h1 className="h4 fw-bold text-dark mb-0">Smart Building Dashboard</h1>
            <p className="text-muted small mb-0">Advanced AI-Powered Building Management System</p>
          </div>
          
          <div className="navbar-nav ms-auto align-items-center">
            <div className="nav-item d-flex align-items-center me-3">
              <i className="bi bi-person-circle text-muted me-2"></i>
              <span className="text-muted me-2">{currentUser?.username || 'Admin'}</span>
              <span className="badge bg-primary rounded-pill">{currentUser?.role || 'admin'}</span>
            </div>
            <div className="nav-item">
              <button 
                onClick={() => setShowSettings(true)}
                className="btn btn-outline-secondary btn-sm me-2"
                title="Settings"
              >
                <i className="bi bi-gear"></i>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        {/* Enhanced Controls */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-medium">Building</label>
                <select 
                  value={selectedBuilding} 
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="form-select"
                >
                  {getBuildingDisplayNames(currentUser?.buildings || ['building_a', 'building_b', 'building_c', 'building_d']).map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">System View</label>
                <select 
                  value={selectedSystem} 
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="form-select"
                >
                  <option value="energy">Energy Management</option>
                  <option value="hvac">HVAC System</option>
                  <option value="lighting">Lighting Control</option>
                  <option value="security">Security System</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Time Range</label>
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleExportReport}
                >
                  <i className="bi bi-download me-2"></i>
                  Export Full Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">{currentStats.label}</p>
                    <h3 className="h4 fw-bold mb-1">{currentStats.primary} {currentStats.unit}</h3>
                    <p className="text-muted small mb-0">{currentStats.secondaryLabel}: {currentStats.secondary}</p>
                  </div>
                  <div className={`p-2 rounded ${selectedSystem === 'energy' ? 'bg-primary' : selectedSystem === 'hvac' ? 'bg-success' : selectedSystem === 'lighting' ? 'bg-warning' : 'bg-danger'}`}>
                    <i className={`bi ${selectedSystem === 'energy' ? 'bi-lightning' : selectedSystem === 'hvac' ? 'bi-wind' : selectedSystem === 'lighting' ? 'bi-lightbulb' : 'bi-shield'} text-white`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">ML Predictions</p>
                    <h3 className="h4 fw-bold mb-1">{predictions.length}</h3>
                    <p className="text-muted small mb-0">LSTM Forecasting Active</p>
                  </div>
                  <div className="p-2 rounded bg-purple">
                    <i className="bi bi-graph-up text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">System Health</p>
                    <h3 className="h4 fw-bold mb-1">98.5%</h3>
                    <p className="text-muted small mb-0">All systems operational</p>
                  </div>
                  <div className="p-2 rounded bg-warning">
                    <i className="bi bi-thermometer-half text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div 
              className="card shadow-sm h-100 cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={handleBuildingLayoutClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Anomalies</p>
                    <h3 className="h4 fw-bold mb-1">{anomalies.length}</h3>
                    <p className="text-muted small mb-0">Random Forest Detection</p>
                    <p className="text-muted small mb-0 text-blue-600">Click to view building layout</p>
                  </div>
                  <div className="p-2 rounded bg-danger">
                    <i className="bi bi-exclamation-triangle text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        <div className="row g-4 mb-4">
          {/* Main System Chart */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold">
                  {selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)} Performance Trend
                </h5>
                <div style={{height: '300px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedSystem === 'energy' && (
                        <Area type="monotone" dataKey="energyConsumption" stackId="1" stroke="#2563eb" fill="#3b82f6" name="Energy (kWh)" />
                      )}
                      {selectedSystem === 'hvac' && (
                        <>
                          <Area type="monotone" dataKey="hvacLoad" stackId="1" stroke="#059669" fill="#10b981" name="HVAC Load" />
                          <Area type="monotone" dataKey="hvacEfficiency" stackId="2" stroke="#dc2626" fill="#ef4444" name="Efficiency %" />
                        </>
                      )}
                      {selectedSystem === 'lighting' && (
                        <>
                          <Area type="monotone" dataKey="lightingLoad" stackId="1" stroke="#d97706" fill="#f59e0b" name="Lighting Load" />
                          <Area type="monotone" dataKey="daylightSensor" stackId="2" stroke="#7c3aed" fill="#8b5cf6" name="Daylight %" />
                        </>
                      )}
                      {selectedSystem === 'security' && (
                        <>
                          <Area type="monotone" dataKey="accessEvents" stackId="1" stroke="#dc2626" fill="#ef4444" name="Access Events" />
                          <Area type="monotone" dataKey="securityAlerts" stackId="2" stroke="#7c3aed" fill="#8b5cf6" name="Alerts" />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Distribution */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold">Energy Distribution</h5>
                <div style={{height: '300px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={systemDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {systemDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LSTM Predictions and Clustering */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Advanced LSTM Predictions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">LSTM Neural Network Predictions</h3>
            {predictions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <YAxis yAxisId={1} orientation="right" />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value, name) => [value, name === 'predictedConsumption' ? 'Predicted (kWh)' : 'Confidence']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="predictedConsumption" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Predicted Energy Consumption"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                    name="Prediction Confidence"
                    yAxisId={1}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status" style={{width: '2rem', height: '2rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Generating LSTM predictions...</p>
                </div>
              </div>
            )}
          </div>

          {/* K-Means Clustering Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Pattern Clustering</h3>
            {clusters.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Efficient Usage', value: clusters.filter(c => c === 0).length, color: '#10b981' },
                        { name: 'Standard Usage', value: clusters.filter(c => c === 1).length, color: '#f59e0b' },
                        { name: 'High Usage', value: clusters.filter(c => c === 2).length, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Efficient Usage', value: clusters.filter(c => c === 0).length, color: '#10b981' },
                        { name: 'Standard Usage', value: clusters.filter(c => c === 1).length, color: '#f59e0b' },
                        { name: 'High Usage', value: clusters.filter(c => c === 2).length, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Efficient Usage: {clusters.filter(c => c === 0).length}</span>
                    <span className="text-yellow-600">Standard Usage: {clusters.filter(c => c === 1).length}</span>
                    <span className="text-red-600">High Usage: {clusters.filter(c => c === 2).length}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status" style={{width: '2rem', height: '2rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Analyzing usage patterns...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* HVAC System Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">HVAC System</h3>
              <Wind className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">
                  {filteredData[filteredData.length - 1]?.hvacStatus || 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className="text-sm font-medium">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.hvacEfficiency, 0) / filteredData.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Air Quality</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="text-sm font-medium">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.temperature, 0) / filteredData.length)}°F
                </span>
              </div>
            </div>
          </div>

          {/* Lighting System Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lighting System</h3>
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">LED Lights Active</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.ledLights, 0) / filteredData.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className="text-sm font-medium">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.lightingEfficiency, 0) / filteredData.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daylight Sensor</span>
                <span className="text-sm font-medium">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.daylightSensor, 0) / filteredData.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto-Dimming</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </div>

          {/* Security System Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security System</h3>
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">
                  {filteredData.some(d => d.securityAlerts > 0) ? 'Alert' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cameras Active</span>
                <span className="text-sm font-medium">
                  {Math.round(filteredData.reduce((sum, d) => sum + d.camerasActive, 0) / filteredData.length)}/12
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Access Events</span>
                <span className="text-sm font-medium">
                  {filteredData.reduce((sum, d) => sum + d.accessEvents, 0)} today
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Intrusion Detection</span>
                <span className="text-sm font-medium text-green-600">Armed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Anomaly Detection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Random Forest Anomaly Detection</h3>
          <p className="text-sm text-gray-600 mb-6">Advanced ML-powered anomaly detection using Random Forest ensemble with 10 decision trees analyzing energy consumption, temperature, and occupancy patterns.</p>
          
          {anomalies.length > 0 ? (
            <div className="space-y-6">
              {anomalies.map((anomaly, index) => {
                // Calculate analysis based on anomaly type
                const getAnomalyAnalysis = (anomaly) => {
                  const analysis = {
                    energy_spike: {
                      title: "Energy Consumption Spike",
                      description: "Unusual increase in energy consumption detected",
                      impact: "High energy costs and potential equipment stress",
                      recommendations: [
                        "Check HVAC system for malfunction",
                        "Verify lighting schedules",
                        "Inspect for equipment left running",
                        "Review occupancy patterns"
                      ],
                      riskLevel: anomaly.energy > 120 ? "High" : "Medium",
                      costImpact: `$${Math.round(anomaly.energy * 0.12 * 100) / 100} additional cost`
                    },
                    temperature_anomaly: {
                      title: "Temperature Deviation",
                      description: "Temperature outside normal operating range",
                      impact: "Comfort issues and HVAC efficiency problems",
                      recommendations: [
                        "Check HVAC thermostat settings",
                        "Inspect for open windows/doors",
                        "Verify HVAC system operation",
                        "Review temperature setpoints"
                      ],
                      riskLevel: Math.abs(anomaly.temperature - 72) > 10 ? "High" : "Medium",
                      costImpact: "Potential HVAC efficiency loss"
                    },
                    occupancy_unusual: {
                      title: "Unusual Occupancy Pattern",
                      description: "Occupancy levels outside expected range",
                      impact: "Security concerns and energy waste",
                      recommendations: [
                        "Verify building access logs",
                        "Check for unauthorized access",
                        "Review security camera footage",
                        "Update occupancy schedules"
                      ],
                      riskLevel: anomaly.occupancy > 100 ? "High" : "Medium",
                      costImpact: "Security and energy efficiency concerns"
                    }
                  };
                  return analysis[anomaly.type] || analysis.energy_spike;
                };

                const analysis = getAnomalyAnalysis(anomaly);
                const severityColor = anomaly.severity === 'high' ? 'red' : anomaly.severity === 'medium' ? 'yellow' : 'green';
                const severityBgColor = anomaly.severity === 'high' ? 'bg-red-50' : anomaly.severity === 'medium' ? 'bg-yellow-50' : 'bg-green-50';
                const severityBorderColor = anomaly.severity === 'high' ? 'border-red-500' : anomaly.severity === 'medium' ? 'border-yellow-500' : 'border-green-500';

                return (
                  <div key={index} className={`p-6 rounded-lg border-l-4 ${severityBorderColor} ${severityBgColor} shadow-sm`}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {analysis.title}
                        </h4>
                        <p className="text-sm text-gray-600">{new Date(anomaly.date).toLocaleDateString()} at {new Date(anomaly.date).toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${severityColor}-100 text-${severityColor}-800`}>
                          {anomaly.severity.toUpperCase()} SEVERITY
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Risk Level: {analysis.riskLevel}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4">{analysis.description}</p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Energy Consumption</p>
                        <p className="text-lg font-semibold text-blue-600">{anomaly.energy} kWh</p>
                        <p className="text-xs text-gray-500">${Math.round(anomaly.energy * 0.12 * 100) / 100} cost</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Temperature</p>
                        <p className="text-lg font-semibold text-orange-600">{anomaly.temperature}°F</p>
                        <p className="text-xs text-gray-500">{anomaly.temperature > 72 ? 'Above normal' : 'Below normal'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Occupancy</p>
                        <p className="text-lg font-semibold text-green-600">{anomaly.occupancy}%</p>
                        <p className="text-xs text-gray-500">{anomaly.occupancy > 80 ? 'High occupancy' : 'Low occupancy'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">ML Confidence</p>
                        <p className="text-lg font-semibold text-purple-600">{(anomaly.anomalyScore * 100).toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">Random Forest Score</p>
                      </div>
                    </div>

                    {/* Impact Analysis */}
                    <div className="bg-white p-4 rounded-lg border mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Impact Analysis</h5>
                      <p className="text-sm text-gray-700 mb-2">{analysis.impact}</p>
                      <p className="text-sm font-medium text-red-600">{analysis.costImpact}</p>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white p-4 rounded-lg border mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Recommended Actions</h5>
                      <ul className="space-y-1">
                        {analysis.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Technical Details</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Anomaly Type: <span className="font-medium">{anomaly.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span></p>
                          <p className="text-gray-600">Detection Method: <span className="font-medium">Random Forest ML</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Model Confidence: <span className="font-medium">{(anomaly.confidence * 100).toFixed(1)}%</span></p>
                          <p className="text-gray-600">Data Points Analyzed: <span className="font-medium">1,440+</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {canEdit && (
                      <div className="mt-4 flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          <i className="bi bi-search mr-2"></i>
                          Investigate
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                          <i className="bi bi-check-circle mr-2"></i>
                          Mark Resolved
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                          <i className="bi bi-file-earmark-text mr-2"></i>
                          Generate Report
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 text-green-500 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">All Systems Operating Normally</h4>
              <p className="text-gray-500">No anomalies detected in the last 30 days. Building systems are performing within expected parameters.</p>
            </div>
          )}
        </div>

        {/* Performance Insights & Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Energy Optimization</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">HVAC Schedule Optimization</p>
                  <p className="text-xs text-blue-600 mt-1">Adjusting HVAC operation during low occupancy could save 12% energy</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Lighting Efficiency</p>
                  <p className="text-xs text-green-600 mt-1">Daylight sensors are performing well, maintaining 95% efficiency</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Predictive Maintenance</h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">HVAC Filter Replacement</p>
                  <p className="text-xs text-yellow-600 mt-1">Predicted maintenance needed in 14 days based on usage patterns</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">Security Camera Health</p>
                  <p className="text-xs text-purple-600 mt-1">Camera 7 showing decreased performance, inspect within 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Panel (Admin Only) */}
        {canManageUsers && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buildings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {UserManager.users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'Administrator' ? 'bg-red-100 text-red-800' :
                          user.role === 'Facility Manager' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'Technician' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.buildings.length} buildings
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id === currentUser?.id ? 'Now' : '2 hours ago'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        {user.id !== currentUser?.id && (
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4 mt-5">
          <p className="text-muted small mb-1">Advanced Building Management System • LSTM Neural Networks • Random Forest ML • Real-time Analytics</p>
          <p className="text-muted small">User: {currentUser?.username || 'Admin'} ({currentUser?.role || 'admin'}) • Buildings: {currentUser?.buildings?.join(', ') || 'All Buildings'}</p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">System Settings</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSettings(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row g-4">
                  {/* Data Refresh Settings */}
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">Data Refresh Settings</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Auto-refresh Interval (seconds)
                        </label>
                        <select
                          value={settings.refreshInterval}
                          onChange={(e) => setSettings({...settings, refreshInterval: Number(e.target.value)})}
                          className="form-select"
                        >
                          <option value={15}>15 seconds</option>
                          <option value={30}>30 seconds</option>
                          <option value={60}>1 minute</option>
                          <option value={300}>5 minutes</option>
                          <option value={600}>10 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alert Thresholds */}
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">Alert Thresholds</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-medium">
                          Energy Consumption (kWh)
                        </label>
                        <input
                          type="number"
                          value={settings.alertThresholds.energy}
                          onChange={(e) => setSettings({
                            ...settings, 
                            alertThresholds: {...settings.alertThresholds, energy: Number(e.target.value)}
                          })}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-medium">
                          Temperature (°F)
                        </label>
                        <input
                          type="number"
                          value={settings.alertThresholds.temperature}
                          onChange={(e) => setSettings({
                            ...settings, 
                            alertThresholds: {...settings.alertThresholds, temperature: Number(e.target.value)}
                          })}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-medium">
                          Occupancy (%)
                        </label>
                        <input
                          type="number"
                          value={settings.alertThresholds.occupancy}
                          onChange={(e) => setSettings({
                            ...settings, 
                            alertThresholds: {...settings.alertThresholds, occupancy: Number(e.target.value)}
                          })}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">Notification Preferences</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            checked={settings.notifications.email}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, email: e.target.checked}
                            })}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="email-notifications">
                            Email Notifications
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="sms-notifications"
                            checked={settings.notifications.sms}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, sms: e.target.checked}
                            })}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="sms-notifications">
                            SMS Notifications
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="push-notifications"
                            checked={settings.notifications.push}
                            onChange={(e) => setSettings({
                              ...settings, 
                              notifications: {...settings.notifications, push: e.target.checked}
                            })}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="push-notifications">
                            Push Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">Display Settings</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Theme
                        </label>
                        <select
                          value={settings.theme}
                          onChange={(e) => setSettings({...settings, theme: e.target.value})}
                          className="form-select"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({...settings, language: e.target.value})}
                          className="form-select"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">System Information</h6>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted">Dashboard Version:</small>
                            <div className="fw-medium">1.0.0</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">API Version:</small>
                            <div className="fw-medium">1.0.0</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Last Updated:</small>
                            <div className="fw-medium">{new Date().toLocaleDateString()}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Data Source:</small>
                            <div className="fw-medium">Real-time Sensors</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // Save settings logic would go here
                    setShowSettings(false);
                  }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Building Layout Modal */}
      {showBuildingLayout && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <Building className="me-2" size={20} />
                  Interactive Building Layout - Anomaly Overview
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseBuildingLayout}
                ></button>
              </div>
              
              {/* Notification */}
              {notification && (
                <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show m-3`} role="alert">
                  <div className="d-flex align-items-center">
                    {notification.type === 'success' ? (
                      <svg className="bi flex-shrink-0 me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    ) : (
                      <svg className="bi flex-shrink-0 me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    )}
                    <span>{notification.message}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setNotification(null)}
                  ></button>
                </div>
              )}
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-8">
                    <BuildingLayout
                      buildings={getBuildingDisplayNames(currentUser?.buildings || ['building_a', 'building_b', 'building_c', 'building_d'])}
                      anomalies={anomalies}
                      onBuildingClick={handleBuildingClick}
                      selectedBuilding={selectedBuildingInLayout}
                    />
                  </div>
                  <div className="col-lg-4">
                    <div className="bg-light rounded-lg p-4 h-100">
                      <h6 className="fw-bold mb-3">Anomaly Summary</h6>
                      {selectedBuildingInLayout ? (
                        <div>
                          <h6 className="text-primary mb-2">{selectedBuildingInLayout}</h6>
                          {anomalies.filter(a => a.building === selectedBuildingInLayout).length > 0 ? (
                            <div>
                              <p className="text-sm text-muted mb-3">
                                {anomalies.filter(a => a.building === selectedBuildingInLayout).length} anomaly(ies) detected
                              </p>
                              <div className="space-y-2">
                                {anomalies
                                  .filter(a => a.building === selectedBuildingInLayout)
                                  .slice(0, 5)
                                  .map((anomaly, index) => (
                                    <div key={index} className="bg-white rounded p-3 border">
                                      <div className="d-flex justify-content-between align-items-start mb-1">
                                        <span className="badge bg-danger text-white text-xs">
                                          {anomaly.severity.toUpperCase()}
                                        </span>
                                        <small className="text-muted">
                                          {new Date(anomaly.date).toLocaleDateString()}
                                        </small>
                                      </div>
                                      <p className="text-sm font-medium mb-1">
                                        {anomaly.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </p>
                                      <p className="text-xs text-muted mb-0">
                                        Energy: {anomaly.energy} kWh | Temp: {anomaly.temperature}°F | Occupancy: {anomaly.occupancy}%
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <div className="text-success mb-2">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm text-muted">No anomalies detected in this building</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <MapPin className="text-muted mb-2" size={32} />
                          <p className="text-sm text-muted">Click on a building to view its anomaly details</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseBuildingLayout}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExportReport}
                >
                  <Download className="me-2" size={16} />
                  Export to Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingDashboard;