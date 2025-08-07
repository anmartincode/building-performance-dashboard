'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useRealTimeData } from '../utils/useRealTimeData';

const WebSocketTest = () => {
  const [buildingId, setBuildingId] = useState('building_a');
  const [testMessage, setTestMessage] = useState('');
  
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

  const handleSendTestCommand = () => {
    const command = {
      command_id: `test_${Date.now()}`,
      building_id: buildingId,
      target_system: 'hvac',
      command_type: 'set_temperature',
      parameters: { temperature: 24.0 },
      timestamp: new Date().toISOString(),
      priority: 5
    };

    sendCommand(command);
    setTestMessage('Command sent successfully!');
    setTimeout(() => setTestMessage(''), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Connection Test
      </Typography>

      {/* Connection Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Connection Status
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Chip
              label={isConnected ? "Connected" : "Disconnected"}
              color={isConnected ? "success" : "error"}
            />
            <Typography variant="body2">
              Building: {buildingId}
            </Typography>
          </Stack>
          
          {connectionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {connectionError}
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={reconnect}
              disabled={isConnected}
            >
              Connect
            </Button>
            <Button
              variant="outlined"
              onClick={requestStatus}
              disabled={!isConnected}
            >
              Request Status
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* System Status */}
      {systemStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Temperature: {systemStatus.current_temperature?.toFixed(1)}°C
              </Typography>
              <Typography variant="body2">
                Humidity: {systemStatus.current_humidity?.toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                Energy: {systemStatus.current_energy_consumption?.toFixed(0)} kWh
              </Typography>
              <Typography variant="body2">
                Occupancy: {systemStatus.current_occupancy || 0}
              </Typography>
              <Typography variant="body2">
                HVAC Status: {systemStatus.hvac_status}
              </Typography>
              <Typography variant="body2">
                Lighting Status: {systemStatus.lighting_status}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Test Commands */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Commands
          </Typography>
          
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Building ID</InputLabel>
              <Select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                label="Building ID"
              >
                <MenuItem value="building_a">Building A</MenuItem>
                <MenuItem value="building_b">Building B</MenuItem>
                <MenuItem value="building_c">Building C</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSendTestCommand}
              disabled={!isConnected}
              fullWidth
            >
              Send Test HVAC Command
            </Button>

            {testMessage && (
              <Alert severity="success">
                {testMessage}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Real-time Alerts ({alerts.length})
          </Typography>
          
          {alerts.length === 0 ? (
            <Alert severity="info">
              No alerts received
            </Alert>
          ) : (
            <Stack spacing={1}>
              {alerts.slice(0, 5).map((alert, index) => (
                <Alert
                  key={alert.alert_id || index}
                  severity={alert.severity === 'critical' ? 'error' : 'warning'}
                  action={
                    <Button
                      size="small"
                      onClick={() => acknowledgeAlert(alert.alert_id)}
                    >
                      Dismiss
                    </Button>
                  }
                >
                  <Typography variant="subtitle2">
                    {alert.alert_type?.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                </Alert>
              ))}
              
              {alerts.length > 5 && (
                <Typography variant="body2" color="text.secondary">
                  ... and {alerts.length - 5} more alerts
                </Typography>
              )}
            </Stack>
          )}
          
          {alerts.length > 0 && (
            <Button
              variant="outlined"
              onClick={clearAlerts}
              sx={{ mt: 2 }}
            >
              Clear All Alerts
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WebSocketTest; 