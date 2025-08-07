'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Stack,
  Avatar,
  Badge,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Bolt,
  Thermostat,
  Security,
  Lightbulb,
  Air,
  Person,
  Settings,
  Group,
  Visibility,
  VisibilityOff,
  Close,
  Business,
  LocationOn,
  Download,
  Notifications,
  Dashboard as DashboardIcon,
  Analytics,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import apiService from '../utils/api';

// Building Layout Component
const BuildingLayoutComponent = ({ buildings, anomalies, onBuildingClick, selectedBuilding }) => {
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
    <Paper elevation={2} sx={{ p: 3, height: 450, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Building Layout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on buildings to view anomaly details
        </Typography>
      </Box>
      
      {/* Legend */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Anomaly Severity
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
              <Typography variant="caption">High</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main', mr: 1 }} />
              <Typography variant="caption">Medium</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
              <Typography variant="caption">Low</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Grid Container for Buildings */}
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mt: 8
      }}>
        <Grid container spacing={6} sx={{ maxWidth: 600 }}>
          {Object.entries(buildingConfigs).map(([buildingName, config]) => {
            const buildingAnomalies = getAnomaliesForBuilding(buildingName);
            const hasAnomalies = buildingAnomalies.length > 0;
            const isSelected = selectedBuilding === buildingName;
            
            return (
              <Grid item xs={6} key={buildingName}>
                <Paper
                  elevation={isSelected ? 8 : 2}
                  sx={{
                    width: config.size.width,
                    height: config.size.height,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isSelected ? 3 : 0,
                    borderColor: 'primary.main',
                    position: 'relative',
                    bgcolor: config.color,
                    '&:hover': {
                      elevation: 4,
                      transform: 'scale(1.05)'
                    }
                  }}
                  onClick={() => onBuildingClick(buildingName)}
                  onMouseEnter={() => setHoveredBuilding(buildingName)}
                  onMouseLeave={() => setHoveredBuilding(null)}
                >
                  <Box sx={{ p: 2, color: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {buildingName}
                    </Typography>
                    <Typography variant="body2">
                      {config.floors} Floors
                    </Typography>
                    
                    {hasAnomalies && (
                      <Badge
                        badgeContent={buildingAnomalies.length}
                        color="error"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <Warning sx={{ color: 'white' }} />
                      </Badge>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

// Export function
const exportDashboardToExcel = (data, anomalies, predictions, buildings, selectedTimeRange) => {
  const workbook = XLSX.utils.book_new();
  
  // Main data sheet
  const mainData = data.slice(-selectedTimeRange).map(d => ({
    Date: d.date,
    Building: d.building,
    'Energy Consumption (kWh)': d.energyConsumption,
    'Temperature (°F)': d.temperature,
    'Occupancy (%)': d.occupancy,
    'HVAC Efficiency (%)': d.hvacEfficiency,
    'Lighting Efficiency (%)': d.lightingEfficiency,
    'Cost ($)': d.cost
  }));
  
  const mainSheet = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(workbook, mainSheet, 'Main Data');
  
  // Anomalies sheet
  if (anomalies.length > 0) {
    const anomaliesData = anomalies.map(a => ({
      Date: a.date,
      Building: a.building,
      Type: a.type,
      Severity: a.severity,
      Description: a.description,
      'Confidence Score': a.confidence,
      'Anomaly Score': a.anomalyScore
    }));
    
    const anomaliesSheet = XLSX.utils.json_to_sheet(anomaliesData);
    XLSX.utils.book_append_sheet(workbook, anomaliesSheet, 'Anomalies');
  }
  
  // Predictions sheet
  if (predictions.length > 0) {
    const predictionsData = predictions.map(p => ({
      Date: p.date,
      Building: p.building,
      'Predicted Consumption': p.predictedConsumption,
      'Confidence': p.confidence
    }));
    
    const predictionsSheet = XLSX.utils.json_to_sheet(predictionsData);
    XLSX.utils.book_append_sheet(workbook, predictionsSheet, 'Predictions');
  }
  
  // Summary sheet
  const summaryData = buildings.map(building => {
    const buildingData = data.filter(d => d.building === building).slice(-selectedTimeRange);
    const buildingAnomalies = anomalies.filter(a => a.building === building);
    
    return {
      Building: building,
      'Data Points': buildingData.length,
      'Avg Energy (kWh)': Math.round(buildingData.reduce((sum, d) => sum + d.energyConsumption, 0) / buildingData.length || 0),
      'Avg Temperature (°F)': Math.round(buildingData.reduce((sum, d) => sum + d.temperature, 0) / buildingData.length || 0),
      'Anomalies Detected': buildingAnomalies.length,
      'High Severity Anomalies': buildingAnomalies.filter(a => a.severity === 'high').length
    };
  });
  
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `building_performance_report_${timestamp}.xlsx`;
  
  // Save file
  XLSX.writeFile(workbook, filename);
};

// ML Models class
class AdvancedMLModels {
  static lstmPredict(data, steps = 7) {
    // Simplified LSTM-like prediction
    const lastValues = data.slice(-5);
    const trend = lastValues.reduce((sum, val, i) => sum + (val - (lastValues[i-1] || val)), 0) / (lastValues.length - 1);
    
    return Array.from({ length: steps }, (_, i) => {
      const baseValue = lastValues[lastValues.length - 1];
      const prediction = baseValue + (trend * (i + 1));
      return Math.max(0, prediction + (Math.random() - 0.5) * 10);
    });
  }

  static randomForestAnomaly(data, point) {
    // Simplified anomaly detection
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const std = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
    const zScore = Math.abs(point - mean) / std;
    return zScore > 2.5;
  }

  static kMeansClustering(data, k = 3) {
    // Simplified k-means clustering
    const features = data.map(d => [d.energyConsumption, d.temperature, d.occupancy]);
    const centroids = Array.from({ length: k }, () => [
      Math.random() * 200,
      Math.random() * 40 + 40,
      Math.random() * 100
    ]);
    
    return features.map(feature => {
      const distances = centroids.map(centroid => 
        Math.sqrt(feature.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0))
      );
      return distances.indexOf(Math.min(...distances));
    });
  }
}

// User Manager
class UserManager {
  static getPermissions(role) {
    const permissions = {
      admin: ['view', 'edit', 'manage_users', 'export', 'settings'],
      manager: ['view', 'edit', 'export'],
      user: ['view']
    };
    return permissions[role] || ['view'];
  }
}

// Generate synthetic data
const generateAdvancedSyntheticData = () => {
  const buildings = ['Building A', 'Building B', 'Building C', 'Building D'];
  const data = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90 days ago
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    buildings.forEach(building => {
      const baseEnergy = building === 'Building A' ? 120 : building === 'Building B' ? 90 : building === 'Building C' ? 150 : 80;
      const baseTemp = 70 + Math.sin(d.getTime() / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 15;
      const baseOccupancy = 60 + Math.sin(d.getTime() / (7 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 20;
      
      data.push({
        date: d.toISOString().split('T')[0],
        building,
        energyConsumption: Math.round(baseEnergy + Math.random() * 40 - 20),
        temperature: Math.round(baseTemp + Math.random() * 10 - 5),
        occupancy: Math.round(Math.max(0, Math.min(100, baseOccupancy + Math.random() * 20 - 10))),
        hvacEfficiency: Math.round(75 + Math.random() * 20),
        lightingEfficiency: Math.round(80 + Math.random() * 15),
        hvacLoad: Math.round(20 + Math.random() * 30),
        lightingLoad: Math.round(10 + Math.random() * 20),
        cost: Math.round((baseEnergy + Math.random() * 40 - 20) * 0.12 * 100) / 100
      });
    });
  }
  
  return data;
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
    occupancy: {
      primary: Math.round(filteredData.reduce((sum, d) => sum + d.occupancy, 0) / filteredData.length || 0),
      secondary: Math.round(filteredData.reduce((sum, d) => sum + d.temperature, 0) / filteredData.length || 0),
      label: 'Avg Occupancy',
      unit: '%',
      secondaryLabel: 'Avg Temperature (°F)'
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Building Performance Dashboard
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label={`${currentUser?.username || 'Admin'}`} 
              color="primary" 
              variant="outlined"
              avatar={<Avatar sx={{ width: 24, height: 24 }}>{currentUser?.username?.charAt(0) || 'A'}</Avatar>}
            />
            
            <IconButton onClick={() => setShowSettings(true)}>
              <Settings />
            </IconButton>
            
            <IconButton onClick={handleBuildingLayoutClick}>
              <Business />
            </IconButton>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportReport}
              sx={{ ml: 1 }}
            >
              Export Report
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Building Selection and Controls */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select
                  value={selectedBuilding}
                  label="Building"
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                >
                  {getBuildingDisplayNames(currentUser?.buildings || []).map(building => (
                    <MenuItem key={building} value={building}>{building}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={selectedTimeRange}
                  label="Time Range"
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  <MenuItem value={90}>Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>System</InputLabel>
                <Select
                  value={selectedSystem}
                  label="System"
                  onChange={(e) => setSelectedSystem(e.target.value)}
                >
                  <MenuItem value="energy">Energy</MenuItem>
                  <MenuItem value="hvac">HVAC</MenuItem>
                  <MenuItem value="lighting">Lighting</MenuItem>
                  <MenuItem value="occupancy">Occupancy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Analytics />}
                onClick={() => setShowBuildingLayout(true)}
              >
                View Layout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bolt sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Energy
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {systemStats.energy.primary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.energy.label} ({systemStats.energy.unit})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.energy.secondaryLabel}: ${systemStats.energy.secondary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Thermostat sx={{ color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6" component="div">
                    HVAC
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {systemStats.hvac.primary}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.hvac.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.hvac.secondaryLabel}: {systemStats.hvac.secondary}kW
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Lightbulb sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Lighting
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {systemStats.lighting.primary}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.lighting.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.lighting.secondaryLabel}: {systemStats.lighting.secondary}kW
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Occupancy
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {systemStats.occupancy.primary}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.occupancy.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {systemStats.occupancy.secondaryLabel}: {systemStats.occupancy.secondary}°F
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)} Performance Over Time
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={selectedSystem === 'energy' ? 'energyConsumption' : 
                                selectedSystem === 'hvac' ? 'hvacEfficiency' :
                                selectedSystem === 'lighting' ? 'lightingEfficiency' : 'occupancy'} 
                        stroke="#1976d2" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'HVAC', value: systemStats.hvac.secondary },
                          { name: 'Lighting', value: systemStats.lighting.secondary },
                          { name: 'Other', value: systemStats.energy.primary - systemStats.hvac.secondary - systemStats.lighting.secondary }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Anomalies Section */}
        {anomalies.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Anomalies
              </Typography>
              <Grid container spacing={2}>
                {anomalies.slice(0, 6).map((anomaly, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderLeft: 4, 
                        borderColor: anomaly.severity === 'high' ? 'error.main' : 
                                     anomaly.severity === 'medium' ? 'warning.main' : 'success.main'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Warning sx={{ 
                          color: anomaly.severity === 'high' ? 'error.main' : 
                                 anomaly.severity === 'medium' ? 'warning.main' : 'success.main',
                          mr: 1 
                        }} />
                        <Typography variant="subtitle2">
                          {anomaly.type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Chip 
                          label={anomaly.severity} 
                          size="small"
                          color={anomaly.severity === 'high' ? 'error' : 
                                 anomaly.severity === 'medium' ? 'warning' : 'success'}
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {anomaly.date}
                      </Typography>
                      <Typography variant="body2">
                        {anomaly.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Building Layout Dialog */}
      <Dialog
        open={showBuildingLayout}
        onClose={handleCloseBuildingLayout}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Building Layout
          <IconButton
            aria-label="close"
            onClick={handleCloseBuildingLayout}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BuildingLayoutComponent
            buildings={getBuildingDisplayNames(currentUser?.buildings || [])}
            anomalies={anomalies}
            onBuildingClick={handleBuildingClick}
            selectedBuilding={selectedBuildingInLayout}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Settings
          <IconButton
            aria-label="close"
            onClick={() => setShowSettings(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Alert Thresholds
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Energy Threshold (kWh)
                  </Typography>
                  <Slider
                    value={settings.alertThresholds.energy}
                    onChange={(e, value) => setSettings({
                      ...settings,
                      alertThresholds: { ...settings.alertThresholds, energy: value }
                    })}
                    min={50}
                    max={300}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Temperature Threshold (°F)
                  </Typography>
                  <Slider
                    value={settings.alertThresholds.temperature}
                    onChange={(e, value) => setSettings({
                      ...settings,
                      alertThresholds: { ...settings.alertThresholds, temperature: value }
                    })}
                    min={60}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, sms: e.target.checked }
                      })}
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: e.target.checked }
                      })}
                    />
                  }
                  label="Push Notifications"
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowSettings(false)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={notification?.type === 'success' ? 3000 : 5000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type || 'info'}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BuildingDashboard; 