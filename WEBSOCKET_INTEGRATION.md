# WebSocket Integration Guide

This document explains how to use the real-time WebSocket features in the Building Performance Dashboard.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
python3 start_server.py
```

The server will start on `http://localhost:8000` with WebSocket endpoints available at `ws://localhost:8000/api/v2/ws/{building_id}`.

### 2. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 3. Test the Integration

Visit `http://localhost:3000/test` to test the WebSocket connection and real-time features.

## 📁 File Structure

```
src/
├── utils/
│   ├── websocket.js          # WebSocket service
│   ├── useRealTimeData.js    # React hooks for real-time data
│   └── api.js               # Updated API service with real-time endpoints
├── components/
│   ├── RealTimeDashboard.js  # Real-time dashboard component
│   ├── WebSocketTest.js      # Test component
│   └── BuildingDashboard.js  # Original dashboard
└── app/
    ├── page.js              # Main page with tabs
    └── test/
        └── page.js          # Test page
```

## 🔌 WebSocket Service

The `websocket.js` service provides:

- **Connection Management**: Automatic connection, reconnection, and error handling
- **Message Handling**: Send and receive real-time messages
- **Event Callbacks**: Handle connection events and message types
- **Heartbeat**: Keep connections alive with periodic heartbeats

### Basic Usage

```javascript
import webSocketService from '../utils/websocket';

// Connect to a building
webSocketService.connect('building_a', {
  onConnect: (buildingId) => {
    console.log(`Connected to ${buildingId}`);
  },
  onMessage: (buildingId, message) => {
    console.log(`Message from ${buildingId}:`, message);
  }
});

// Send a command
webSocketService.sendCommand('building_a', {
  command_id: 'cmd_123',
  target_system: 'hvac',
  command_type: 'set_temperature',
  parameters: { temperature: 24.0 }
});

// Send sensor data
webSocketService.sendSensorData('building_a', {
  temperature: 22.5,
  humidity: 45.0,
  energy_consumption: 250.0,
  occupancy: 30
});
```

## 🎣 React Hooks

### useRealTimeData

Hook for managing real-time data for a single building:

```javascript
import { useRealTimeData } from '../utils/useRealTimeData';

const MyComponent = () => {
  const {
    isConnected,
    connectionError,
    alerts,
    systemStatus,
    sendCommand,
    requestStatus,
    clearAlerts,
    acknowledgeAlert
  } = useRealTimeData('building_a');

  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Alerts: {alerts.length}</p>
      <button onClick={() => requestStatus()}>
        Refresh Status
      </button>
    </div>
  );
};
```

### useMultiBuildingRealTimeData

Hook for managing multiple building connections:

```javascript
import { useMultiBuildingRealTimeData } from '../utils/useRealTimeData';

const MyComponent = () => {
  const {
    connections,
    allAlerts,
    sendCommandToBuildings,
    isAnyConnected,
    totalConnected
  } = useMultiBuildingRealTimeData(['building_a', 'building_b', 'building_c']);

  return (
    <div>
      <p>Connected buildings: {totalConnected}</p>
      <p>Total alerts: {allAlerts.length}</p>
    </div>
  );
};
```

## 📊 Real-time Dashboard

The `RealTimeDashboard` component provides:

- **Connection Status**: Visual indicator of WebSocket connection
- **System Status**: Real-time display of building metrics
- **Alerts**: Real-time alert management
- **Command Control**: Send commands to building systems

### Usage

```javascript
import RealTimeDashboard from '../components/RealTimeDashboard';

// In your component
<RealTimeDashboard buildingId="building_a" />
```

## 🔄 Message Types

### Incoming Messages

- `sensor_data_confirmed`: Confirmation of sensor data transmission
- `alert`: Real-time alerts from the system
- `command_response`: Response to sent commands
- `status_update`: System status updates
- `heartbeat_response`: Response to heartbeat messages
- `connection_established`: Confirmation of connection
- `error`: Error messages

### Outgoing Messages

- `sensor_data`: Send sensor data
- `command`: Send system commands
- `heartbeat`: Keep connection alive
- `status_request`: Request system status

## 🎮 Command Types

### HVAC Commands

```javascript
// Set temperature
{
  target_system: 'hvac',
  command_type: 'set_temperature',
  parameters: { temperature: 24.0 }
}

// Set mode
{
  target_system: 'hvac',
  command_type: 'set_mode',
  parameters: { mode: 'cool' }
}
```

### Lighting Commands

```javascript
// Set brightness
{
  target_system: 'lighting',
  command_type: 'set_brightness',
  parameters: { brightness: 75 }
}

// Set mode
{
  target_system: 'lighting',
  command_type: 'set_mode',
  parameters: { mode: 'auto' }
}
```

### Security Commands

```javascript
// Lockdown
{
  target_system: 'security',
  command_type: 'lockdown'
}

// Unlock
{
  target_system: 'security',
  command_type: 'unlock'
}
```

## 🧪 Testing

### 1. Test Page

Visit `http://localhost:3000/test` to test:

- WebSocket connection
- Real-time status updates
- Command sending
- Alert handling

### 2. Manual Testing

```bash
# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==" \
  http://localhost:8000/api/v2/ws/building_a
```

### 3. Send Test Data

```bash
# Send sensor data via REST API
curl -X POST http://localhost:8000/api/v2/realtime/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "building_a",
    "temperature": 22.5,
    "humidity": 45.0,
    "energy_consumption": 250.0,
    "occupancy": 30,
    "hvac_status": "active",
    "lighting_status": "on"
  }'
```

## 🔧 Configuration

### WebSocket URL

Update the WebSocket URL in `src/utils/websocket.js`:

```javascript
const WS_BASE_URL = 'ws://localhost:8000/api/v2/ws';
```

### API Base URL

Update the API base URL in `src/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Reconnection Settings

Configure reconnection behavior in `src/utils/websocket.js`:

```javascript
this.maxReconnectAttempts = 5;
this.reconnectDelay = 1000; // Start with 1 second
```

## 🚨 Troubleshooting

### Connection Issues

1. **Check server status**: Ensure the backend server is running
2. **Check WebSocket endpoint**: Verify the WebSocket URL is correct
3. **Check CORS**: Ensure CORS is properly configured on the backend
4. **Check network**: Verify network connectivity

### Message Issues

1. **Check message format**: Ensure messages follow the expected format
2. **Check building ID**: Verify the building ID exists
3. **Check authentication**: Ensure proper authentication if required

### Performance Issues

1. **Limit connections**: Don't create too many simultaneous connections
2. **Handle disconnections**: Implement proper reconnection logic
3. **Clean up resources**: Disconnect when components unmount

## 📈 Next Steps

1. **Authentication**: Add authentication to WebSocket connections
2. **Error Handling**: Implement more robust error handling
3. **Performance**: Optimize for high-frequency data
4. **Scalability**: Support for multiple buildings and users
5. **Monitoring**: Add connection monitoring and metrics

## 🤝 Contributing

When adding new features:

1. Update the WebSocket service for new message types
2. Add corresponding React hooks if needed
3. Update the dashboard components
4. Add tests for new functionality
5. Update this documentation

## 📚 Additional Resources

- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [FastAPI WebSocket Documentation](https://fastapi.tiangolo.com/advanced/websockets/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html) 