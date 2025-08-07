// WebSocket service for real-time communication with Python FastAPI backend
const WS_BASE_URL = 'ws://localhost:8000/api/v2/ws';

class WebSocketService {
  constructor() {
    this.connections = new Map();
    this.messageHandlers = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  // Connect to WebSocket for a specific building
  connect(buildingId, options = {}) {
    const connectionId = `building_${buildingId}`;
    
    // If already connected, return existing connection
    if (this.connections.has(connectionId)) {
      const existingWs = this.connections.get(connectionId);
      if (existingWs.readyState === WebSocket.OPEN) {
        console.log(`🔌 Already connected to building ${buildingId}`);
        return existingWs;
      } else {
        // Clean up stale connection
        this.disconnect(buildingId);
      }
    }

    const url = `${WS_BASE_URL}/${buildingId}`;
    console.log(`🔌 Attempting to connect to: ${url}`);
    
    try {
      const ws = new WebSocket(url);

      // Set up connection event handlers
      ws.onopen = () => {
        console.log(`🔌 WebSocket connected to building ${buildingId}`);
        this.reconnectAttempts.set(connectionId, 0);
        
        // Send connection established message after a short delay
        setTimeout(() => {
          this.sendMessage(buildingId, {
            message_type: 'connection_established',
            data: {
              building_id: buildingId,
              timestamp: new Date().toISOString(),
              client_type: 'frontend'
            }
          });
        }, 100);

        // Call onConnect callback if provided
        if (options.onConnect) {
          options.onConnect(buildingId);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log(`📥 Received message from building ${buildingId}:`, message);
          
          // Handle different message types
          this.handleMessage(buildingId, message);
          
          // Call onMessage callback if provided
          if (options.onMessage) {
            options.onMessage(buildingId, message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          console.error('Raw message data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket disconnected from building ${buildingId}:`, event.code, event.reason);
        
        // Call onDisconnect callback if provided
        if (options.onDisconnect) {
          options.onDisconnect(buildingId, event);
        }

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000) {
          this.attemptReconnect(buildingId, options);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WebSocket error for building ${buildingId}:`, error);
        console.error('Error details:', {
          error: error,
          readyState: ws.readyState,
          url: url,
          buildingId: buildingId
        });
        
        // Call onError callback if provided
        if (options.onError) {
          options.onError(buildingId, error);
        }
      };

      // Store connection
      this.connections.set(connectionId, ws);
      return ws;
    } catch (error) {
      console.error(`❌ Failed to create WebSocket connection for building ${buildingId}:`, error);
      throw error;
    }
  }

  // Attempt to reconnect to WebSocket
  attemptReconnect(buildingId, options) {
    const connectionId = `building_${buildingId}`;
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      console.log(`🔄 Attempting to reconnect to building ${buildingId} (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
      
      this.reconnectAttempts.set(connectionId, attempts + 1);
      
      setTimeout(() => {
        this.disconnect(buildingId);
        this.connect(buildingId, options);
      }, this.reconnectDelay * Math.pow(2, attempts)); // Exponential backoff
    } else {
      console.error(`❌ Max reconnection attempts reached for building ${buildingId}`);
    }
  }

  // Disconnect from WebSocket
  disconnect(buildingId) {
    const connectionId = `building_${buildingId}`;
    const ws = this.connections.get(connectionId);
    
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Client disconnecting');
      }
      this.connections.delete(connectionId);
      this.reconnectAttempts.delete(connectionId);
      console.log(`🔌 Disconnected from building ${buildingId}`);
    }
  }

  // Send message to WebSocket
  sendMessage(buildingId, message) {
    const connectionId = `building_${buildingId}`;
    const ws = this.connections.get(connectionId);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageWithId = {
        ...message,
        message_id: `frontend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      
      try {
        ws.send(JSON.stringify(messageWithId));
        console.log(`📤 Sent message to building ${buildingId}:`, messageWithId);
      } catch (error) {
        console.error(`❌ Error sending message to building ${buildingId}:`, error);
      }
    } else {
      console.error(`❌ Cannot send message to building ${buildingId}: WebSocket not connected (readyState: ${ws ? ws.readyState : 'null'})`);
    }
  }

  // Send sensor data
  sendSensorData(buildingId, sensorData) {
    this.sendMessage(buildingId, {
      message_type: 'sensor_data',
      data: sensorData
    });
  }

  // Send command
  sendCommand(buildingId, command) {
    this.sendMessage(buildingId, {
      message_type: 'command',
      data: command
    });
  }

  // Send heartbeat
  sendHeartbeat(buildingId) {
    this.sendMessage(buildingId, {
      message_type: 'heartbeat',
      data: {
        timestamp: new Date().toISOString(),
        client_type: 'frontend'
      }
    });
  }

  // Request status update
  requestStatus(buildingId) {
    this.sendMessage(buildingId, {
      message_type: 'status_request',
      data: {
        building_id: buildingId,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle incoming messages
  handleMessage(buildingId, message) {
    const messageType = message.message_type;
    
    switch (messageType) {
      case 'sensor_data_confirmed':
        console.log(`✅ Sensor data confirmed for building ${buildingId}`);
        break;
        
      case 'alert':
        console.log(`🚨 Alert received for building ${buildingId}:`, message.data);
        this.notifyAlertHandlers(buildingId, message.data);
        break;
        
      case 'command_response':
        console.log(`✅ Command response for building ${buildingId}:`, message.data);
        this.notifyCommandHandlers(buildingId, message.data);
        break;
        
      case 'status_update':
        console.log(`📊 Status update for building ${buildingId}:`, message.data);
        this.notifyStatusHandlers(buildingId, message.data);
        break;
        
      case 'heartbeat_response':
        console.log(`💓 Heartbeat response from building ${buildingId}`);
        break;
        
      case 'connection_established':
        console.log(`✅ Connection established with building ${buildingId}`);
        break;
        
      case 'error':
        console.error(`❌ Error from building ${buildingId}:`, message.data);
        break;
        
      default:
        console.log(`📥 Unknown message type from building ${buildingId}:`, messageType);
    }
  }

  // Register message handlers
  onAlert(buildingId, handler) {
    const key = `alert_${buildingId}`;
    this.messageHandlers.set(key, handler);
  }

  onCommandResponse(buildingId, handler) {
    const key = `command_${buildingId}`;
    this.messageHandlers.set(key, handler);
  }

  onStatusUpdate(buildingId, handler) {
    const key = `status_${buildingId}`;
    this.messageHandlers.set(key, handler);
  }

  // Notify handlers
  notifyAlertHandlers(buildingId, alertData) {
    const key = `alert_${buildingId}`;
    const handler = this.messageHandlers.get(key);
    if (handler) {
      handler(alertData);
    }
  }

  notifyCommandHandlers(buildingId, commandData) {
    const key = `command_${buildingId}`;
    const handler = this.messageHandlers.get(key);
    if (handler) {
      handler(commandData);
    }
  }

  notifyStatusHandlers(buildingId, statusData) {
    const key = `status_${buildingId}`;
    const handler = this.messageHandlers.get(key);
    if (handler) {
      handler(statusData);
    }
  }

  // Get connection status
  isConnected(buildingId) {
    const connectionId = `building_${buildingId}`;
    const ws = this.connections.get(connectionId);
    return ws && ws.readyState === WebSocket.OPEN;
  }

  // Get all connected buildings
  getConnectedBuildings() {
    const connected = [];
    for (const [connectionId, ws] of this.connections) {
      if (ws.readyState === WebSocket.OPEN) {
        const buildingId = connectionId.replace('building_', '');
        connected.push(buildingId);
      }
    }
    return connected;
  }

  // Disconnect all connections
  disconnectAll() {
    for (const [connectionId, ws] of this.connections) {
      const buildingId = connectionId.replace('building_', '');
      this.disconnect(buildingId);
    }
  }

  // Start heartbeat for a building
  startHeartbeat(buildingId, interval = 30000) { // 30 seconds default
    const heartbeatId = setInterval(() => {
      if (this.isConnected(buildingId)) {
        this.sendHeartbeat(buildingId);
      }
    }, interval);
    
    return heartbeatId;
  }

  // Stop heartbeat
  stopHeartbeat(heartbeatId) {
    if (heartbeatId) {
      clearInterval(heartbeatId);
    }
  }
}

// Global WebSocket service instance
const webSocketService = new WebSocketService();

export default webSocketService; 