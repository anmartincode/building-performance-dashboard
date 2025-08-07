'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Button,
  IconButton,
  Badge,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Notifications,
  Thermostat,
  Bolt,
  Air,
  Lightbulb,
  Security,
  TrendingUp,
  TrendingDown,
  Close
} from '@mui/icons-material';
import { useRealTimeData } from '../utils/useRealTimeData';

// Connection Status Component
const ConnectionStatus = ({ isConnected, error, onReconnect }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {isConnected ? (
              <Wifi color="success" />
            ) : (
              <WifiOff color="error" />
            )}
            <Typography variant="h6">
              Real-time Connection
            </Typography>
            <Chip
              label={isConnected ? "Connected" : "Disconnected"}
              color={isConnected ? "success" : "error"}
              size="small"
            />
          </Box>
          {!isConnected && (
            <Button
              variant="outlined"
              size="small"
              onClick={onReconnect}
              startIcon={<Refresh />}
            >
              Reconnect
            </Button>
          )}
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// Real-time Alerts Component
const RealTimeAlerts = ({ alerts, onAcknowledge, onClearAll }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Warning />;
      case 'low': return <CheckCircle />;
      default: return <Warning />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={alerts.length} color="error">
              <Notifications />
            </Badge>
            <Typography variant="h6">Real-time Alerts</Typography>
          </Box>
          <Box>
            {alerts.length > 5 && (
              <Button
                size="small"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `Show All (${alerts.length})`}
              </Button>
            )}
            {alerts.length > 0 && (
              <Button
                size="small"
                color="secondary"
                onClick={onClearAll}
                sx={{ ml: 1 }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {alerts.length === 0 ? (
          <Alert severity="info">
            No active alerts
          </Alert>
        ) : (
          <Stack spacing={1}>
            {displayedAlerts.map((alert, index) => (
              <Alert
                key={alert.alert_id || index}
                severity={getSeverityColor(alert.severity)}
                icon={getSeverityIcon(alert.severity)}
                action={
                  <IconButton
                    size="small"
                    onClick={() => onAcknowledge(alert.alert_id)}
                  >
                    <Close />
                  </IconButton>
                }
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {alert.alert_type?.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Alert>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

// System Status Component
const SystemStatus = ({ systemStatus, onRefresh }) => {
  if (!systemStatus) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={100}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'idle': return 'warning';
      case 'maintenance': return 'info';
      case 'error': return 'error';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">System Status</Typography>
          <IconButton onClick={onRefresh} size="small">
            <Refresh />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Thermostat color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="primary">
                {systemStatus.current_temperature?.toFixed(1)}°C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temperature
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Air color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="primary">
                {systemStatus.current_humidity?.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Humidity
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Bolt color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="primary">
                {systemStatus.current_energy_consumption?.toFixed(0)} kWh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Energy
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Lightbulb color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="primary">
                {systemStatus.current_occupancy || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupancy
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Thermostat />
              <Typography variant="body2">HVAC:</Typography>
              <Chip
                label={systemStatus.hvac_status || 'Unknown'}
                color={getStatusColor(systemStatus.hvac_status)}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Lightbulb />
              <Typography variant="body2">Lighting:</Typography>
              <Chip
                label={systemStatus.lighting_status || 'Unknown'}
                color={getStatusColor(systemStatus.lighting_status)}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>

        {systemStatus.last_update && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Last updated: {new Date(systemStatus.last_update).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Command Control Component
const CommandControl = ({ onSendCommand, isConnected }) => {
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState({
    target_system: 'hvac',
    command_type: 'set_temperature',
    parameters: {},
    priority: 5
  });

  const handleSendCommand = () => {
    onSendCommand({
      command_id: `cmd_${Date.now()}`,
      building_id: 'building_a', // This should be passed as prop
      ...command,
      timestamp: new Date().toISOString()
    });
    setOpen(false);
    setCommand({
      target_system: 'hvac',
      command_type: 'set_temperature',
      parameters: {},
      priority: 5
    });
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Settings />}
        onClick={() => setOpen(true)}
        disabled={!isConnected}
        fullWidth
      >
        Send Command
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send System Command</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Target System</InputLabel>
              <Select
                value={command.target_system}
                onChange={(e) => setCommand(prev => ({ ...prev, target_system: e.target.value }))}
                label="Target System"
              >
                <MenuItem value="hvac">HVAC</MenuItem>
                <MenuItem value="lighting">Lighting</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="ventilation">Ventilation</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Command Type</InputLabel>
              <Select
                value={command.command_type}
                onChange={(e) => setCommand(prev => ({ ...prev, command_type: e.target.value }))}
                label="Command Type"
              >
                {command.target_system === 'hvac' && (
                  <>
                    <MenuItem value="set_temperature">Set Temperature</MenuItem>
                    <MenuItem value="set_mode">Set Mode</MenuItem>
                  </>
                )}
                {command.target_system === 'lighting' && (
                  <>
                    <MenuItem value="set_brightness">Set Brightness</MenuItem>
                    <MenuItem value="set_mode">Set Mode</MenuItem>
                  </>
                )}
                {command.target_system === 'security' && (
                  <>
                    <MenuItem value="lockdown">Lockdown</MenuItem>
                    <MenuItem value="unlock">Unlock</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>

            {command.command_type === 'set_temperature' && (
              <TextField
                label="Temperature (°C)"
                type="number"
                value={command.parameters.temperature || ''}
                onChange={(e) => setCommand(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, temperature: parseFloat(e.target.value) }
                }))}
                inputProps={{ min: 15, max: 30, step: 0.5 }}
                fullWidth
              />
            )}

            {command.command_type === 'set_brightness' && (
              <TextField
                label="Brightness (%)"
                type="number"
                value={command.parameters.brightness || ''}
                onChange={(e) => setCommand(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, brightness: parseInt(e.target.value) }
                }))}
                inputProps={{ min: 0, max: 100, step: 1 }}
                fullWidth
              />
            )}

            <Box>
              <Typography gutterBottom>Priority (1-10)</Typography>
              <Slider
                value={command.priority}
                onChange={(e, value) => setCommand(prev => ({ ...prev, priority: value }))}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSendCommand} variant="contained">
            Send Command
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Main Real-time Dashboard Component
const RealTimeDashboard = ({ buildingId = 'building_a' }) => {
  const {
    isConnected,
    connectionError,
    alerts,
    systemStatus,
    sendCommand,
    requestStatus,
    clearAlerts,
    acknowledgeAlert,
    reconnect
  } = useRealTimeData(buildingId);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Real-time Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Building: {buildingId}
      </Typography>

      <Grid container spacing={3}>
        {/* Connection Status */}
        <Grid item xs={12}>
          <ConnectionStatus
            isConnected={isConnected}
            error={connectionError}
            onReconnect={reconnect}
          />
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={8}>
          <SystemStatus
            systemStatus={systemStatus}
            onRefresh={requestStatus}
          />
        </Grid>

        {/* Command Control */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Control
              </Typography>
              <CommandControl
                onSendCommand={sendCommand}
                isConnected={isConnected}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Alerts */}
        <Grid item xs={12}>
          <RealTimeAlerts
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
            onClearAll={clearAlerts}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeDashboard; 