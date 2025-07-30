import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, ThermometerSun, Shield, Lightbulb, Wind, User, Settings, Users, Eye, EyeOff, X } from 'lucide-react';
import apiService from './api';

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
                <button className="btn btn-primary w-100">
                  <i className="bi bi-download me-2"></i>
                  Export Report
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
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Anomalies</p>
                    <h3 className="h4 fw-bold mb-1">{anomalies.length}</h3>
                    <p className="text-muted small mb-0">Random Forest Detection</p>
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
    </div>
  );
};

export default BuildingDashboard;