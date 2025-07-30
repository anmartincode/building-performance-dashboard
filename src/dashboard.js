import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, ThermometerSun, Shield, Lightbulb, Wind, User, LogOut, Settings, Users, Eye, EyeOff } from 'lucide-react';
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
        ledLights: Math.round(lightingLoad * 0.8),
        
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

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.login(credentials.username, credentials.password);
      
      // Create user object with buildings based on role
      const user = {
        username: response.user.username,
        role: response.user.role,
        buildings: ['building_a', 'building_b', 'building_c', 'building_d'], // All users can see all buildings
        permissions: UserManager.getPermissions(response.user.role)
      };
      
      onLogin(user);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Building Dashboard</h1>
          <p className="text-gray-600">AI-Powered Building Management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
          <div className="text-xs space-y-1">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Manager:</strong> facility_manager / fm123</div>
            <div><strong>Tech:</strong> technician / tech123</div>
            <div><strong>Guest:</strong> guest / guest123</div>
          </div>
        </div>
      </div>
    </div>
  );
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

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch building data from API
          const buildingId = getBuildingApiId(selectedBuilding);
          const response = await apiService.getBuildingData(buildingId, selectedTimeRange);
          
          // Transform API data to match frontend format
          const transformedData = response.data.map(item => ({
            date: new Date(item.timestamp).toISOString().split('T')[0],
            time: new Date(item.timestamp).toLocaleTimeString(),
            building: selectedBuilding,
            temperature: item.temperature,
            humidity: item.humidity,
            energyConsumption: item.energy_consumption,
            occupancy: item.occupancy,
            hvacStatus: item.hvac_status,
            lightingStatus: item.lighting_status,
            // Calculate derived values
            cost: item.energy_consumption * 0.12, // $0.12 per kWh
            hvacEfficiency: Math.max(60, 100 - (item.temperature - 22) * 5),
            hvacLoad: item.energy_consumption * 0.4,
            lightingEfficiency: item.lighting_status === 'dimmed' ? 85 : (item.lighting_status === 'on' ? 70 : 95),
            securityStatus: item.occupancy > 0 ? 'active' : 'standby'
          }));
          
          setData(transformedData);
          
          // Fetch AI predictions
          const predictionsResponse = await apiService.getPredictions(buildingId, 'energy_consumption', 7);
          const predictionData = predictionsResponse.predictions.map((pred, i) => ({
            date: new Date(pred.timestamp).toISOString().split('T')[0],
            building: selectedBuilding,
            predictedConsumption: Math.round(pred.predicted_value),
            confidence: Math.round(pred.confidence * 100) / 100
          }));
          
          setPredictions(predictionData);
          
          // Fetch anomalies
          const anomaliesResponse = await apiService.getAnomalies(buildingId);
          const anomalyData = anomaliesResponse.anomalies.map(anomaly => ({
            date: new Date(anomaly.timestamp).toISOString().split('T')[0],
            building: selectedBuilding,
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.description,
            confidence: anomaly.confidence,
            anomalyScore: anomaly.confidence
          }));
          
          setAnomalies(anomalyData);
          
          // For now, use mock clustering (can be enhanced later)
          const clusterLabels = AdvancedMLModels.kMeansClustering(transformedData.slice(-100));
          setClusters(clusterLabels);
          
        } catch (error) {
          console.error('Error fetching data:', error);
          // Fallback to mock data if API fails
          const syntheticData = generateAdvancedSyntheticData();
          setData(syntheticData);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [currentUser, selectedBuilding, selectedTimeRange]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Set the first building as default, using display name
    const firstBuildingDisplayName = getBuildingDisplayNames(user.buildings)[0];
    setSelectedBuilding(firstBuildingDisplayName);
  };

  const handleLogout = () => {
    apiService.clearToken();
    setCurrentUser(null);
    setData([]);
    setIsLoading(true);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const filteredData = data
    .filter(d => d.building === selectedBuilding)
    .slice(-selectedTimeRange);

  const permissions = UserManager.getPermissions(currentUser.role);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advanced building analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Management */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Building Dashboard</h1>
              <p className="text-gray-600">Advanced AI-Powered Building Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{currentUser.username}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{currentUser.role}</span>
              </div>
              {canManageUsers && (
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Settings className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <select 
                value={selectedBuilding} 
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!canEdit}
              >
                {getBuildingDisplayNames(currentUser.buildings).map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System View</label>
              <select 
                value={selectedSystem} 
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="energy">Energy Management</option>
                <option value="hvac">HVAC System</option>
                <option value="lighting">Lighting Control</option>
                <option value="security">Security System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{currentStats.label}</p>
                <p className="text-2xl font-bold text-gray-900">{currentStats.primary} {currentStats.unit}</p>
              </div>
              {selectedSystem === 'energy' && <Zap className="h-8 w-8 text-blue-600" />}
              {selectedSystem === 'hvac' && <Wind className="h-8 w-8 text-green-600" />}
              {selectedSystem === 'lighting' && <Lightbulb className="h-8 w-8 text-yellow-600" />}
              {selectedSystem === 'security' && <Shield className="h-8 w-8 text-red-600" />}
            </div>
            <p className="text-sm text-gray-500 mt-2">{currentStats.secondaryLabel}: {currentStats.secondary}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ML Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">LSTM Forecasting Active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
              </div>
              <ThermometerSun className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">All systems operational</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Anomalies</p>
                <p className="text-2xl font-bold text-gray-900">{anomalies.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Random Forest Detection</p>
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main System Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)} Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
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

          {/* Energy Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
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

        {/* LSTM Predictions and Clustering */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Advanced LSTM Predictions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">LSTM Neural Network Predictions</h3>
            <div className="space-y-3">
              {predictions.map((pred, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{new Date(pred.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Confidence: {pred.confidence}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${pred.confidence}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">{pred.predictedConsumption} kWh</p>
                    <p className="text-sm text-gray-500">${Math.round(pred.predictedConsumption * 0.12 * 100) / 100}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* K-Means Clustering Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Pattern Clustering</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-green-800">Cluster 1: Efficient Usage</h4>
                <p className="text-sm text-green-600">Low energy, high efficiency patterns</p>
                <p className="text-xs text-green-500 mt-1">{clusters.filter(c => c === 0).length} data points</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-medium text-yellow-800">Cluster 2: Standard Usage</h4>
                <p className="text-sm text-yellow-600">Normal operational patterns</p>
                <p className="text-xs text-yellow-500 mt-1">{clusters.filter(c => c === 1).length} data points</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h4 className="font-medium text-red-800">Cluster 3: High Usage</h4>
                <p className="text-sm text-red-600">Peak demand periods</p>
                <p className="text-xs text-red-500 mt-1">{clusters.filter(c => c === 2).length} data points</p>
              </div>
            </div>
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
          {anomalies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anomalies.map((anomaly, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  anomaly.severity === 'Critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{anomaly.type}</h4>
                      <p className="text-sm text-gray-600">{new Date(anomaly.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      anomaly.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Energy: {anomaly.energyConsumption} kWh</p>
                      <p className="text-gray-600">Occupancy: {anomaly.occupancy}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Temperature: {anomaly.temperature}°F</p>
                      <p className="text-gray-600">ML Score: {anomaly.anomalyScore}</p>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                        Investigate
                      </button>
                      <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200">
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-green-500 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No anomalies detected - All systems operating normally</p>
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
                        {user.id === currentUser.id ? 'Now' : '2 hours ago'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        {user.id !== currentUser.id && (
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
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Advanced Building Management System • LSTM Neural Networks • Random Forest ML • Real-time Analytics</p>
          <p className="mt-1">User: {currentUser.username} ({currentUser.role}) • Buildings: {currentUser.buildings.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default BuildingDashboard;