// React hook for managing real-time data from WebSocket connections
import { useState, useEffect, useCallback, useRef } from 'react';
import webSocketService from './websocket';

export const useRealTimeData = (buildingId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const heartbeatRef = useRef(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!buildingId) return;

    // Add a small delay to ensure server is ready
    setTimeout(() => {
      webSocketService.connect(buildingId, {
        onConnect: (buildingId) => {
          console.log(`✅ Connected to building ${buildingId}`);
          setIsConnected(true);
          setConnectionError(null);
          
          // Start heartbeat
          heartbeatRef.current = webSocketService.startHeartbeat(buildingId);
          
          // Request initial status
          webSocketService.requestStatus(buildingId);
        },
        
        onDisconnect: (buildingId, event) => {
          console.log(`❌ Disconnected from building ${buildingId}`);
          setIsConnected(false);
          setConnectionError(`Disconnected: ${event.reason || 'Unknown reason'}`);
          
          // Stop heartbeat
          if (heartbeatRef.current) {
            webSocketService.stopHeartbeat(heartbeatRef.current);
            heartbeatRef.current = null;
          }
        },
        
        onError: (buildingId, error) => {
          console.error(`❌ WebSocket error for building ${buildingId}:`, error);
          setConnectionError(`Connection error: ${error.message || 'Unknown error'}`);
        },
        
        onMessage: (buildingId, message) => {
          // Handle different message types
          switch (message.message_type) {
            case 'status_update':
              setSystemStatus(message.data);
              break;
              
            case 'alert':
              setAlerts(prev => [message.data, ...prev.slice(0, 49)]); // Keep last 50 alerts
              break;
              
            case 'sensor_data_confirmed':
              // Update real-time data if sensor data was sent
              break;
          }
        }
      });

      // Register message handlers
      webSocketService.onStatusUpdate(buildingId, (statusData) => {
        setSystemStatus(statusData);
      });

      webSocketService.onAlert(buildingId, (alertData) => {
        setAlerts(prev => [alertData, ...prev.slice(0, 49)]); // Keep last 50 alerts
      });
    }, 1000); // 1 second delay

  }, [buildingId]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (!buildingId) return;

    // Stop heartbeat
    if (heartbeatRef.current) {
      webSocketService.stopHeartbeat(heartbeatRef.current);
      heartbeatRef.current = null;
    }

    webSocketService.disconnect(buildingId);
    setIsConnected(false);
    setConnectionError(null);
  }, [buildingId]);

  // Send sensor data
  const sendSensorData = useCallback((sensorData) => {
    if (!buildingId || !isConnected) {
      console.error('Cannot send sensor data: not connected');
      return false;
    }

    webSocketService.sendSensorData(buildingId, sensorData);
    return true;
  }, [buildingId, isConnected]);

  // Send command
  const sendCommand = useCallback((command) => {
    if (!buildingId || !isConnected) {
      console.error('Cannot send command: not connected');
      return false;
    }

    webSocketService.sendCommand(buildingId, command);
    return true;
  }, [buildingId, isConnected]);

  // Request status update
  const requestStatus = useCallback(() => {
    if (!buildingId || !isConnected) {
      console.error('Cannot request status: not connected');
      return false;
    }

    webSocketService.requestStatus(buildingId);
    return true;
  }, [buildingId, isConnected]);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.alert_id !== alertId));
  }, []);

  // Connect on mount and disconnect on unmount
  useEffect(() => {
    if (buildingId) {
      connect();
    }

    return () => {
      if (buildingId) {
        disconnect();
      }
    };
  }, [buildingId, connect, disconnect]);

  return {
    // Connection state
    isConnected,
    connectionError,
    
    // Data
    realTimeData,
    alerts,
    systemStatus,
    
    // Actions
    connect,
    disconnect,
    sendSensorData,
    sendCommand,
    requestStatus,
    clearAlerts,
    acknowledgeAlert,
    
    // Utility
    reconnect: connect
  };
};

// Hook for managing multiple building connections
export const useMultiBuildingRealTimeData = (buildingIds) => {
  const [connections, setConnections] = useState(new Map());
  const [allAlerts, setAllAlerts] = useState([]);
  const [connectionErrors, setConnectionErrors] = useState(new Map());

  // Connect to multiple buildings
  const connectToBuildings = useCallback(() => {
    buildingIds.forEach(buildingId => {
      if (!connections.has(buildingId)) {
        webSocketService.connect(buildingId, {
          onConnect: (buildingId) => {
            setConnections(prev => new Map(prev.set(buildingId, true)));
            setConnectionErrors(prev => {
              const newErrors = new Map(prev);
              newErrors.delete(buildingId);
              return newErrors;
            });
          },
          
          onDisconnect: (buildingId, event) => {
            setConnections(prev => new Map(prev.set(buildingId, false)));
            setConnectionErrors(prev => new Map(prev.set(buildingId, `Disconnected: ${event.reason || 'Unknown reason'}`)));
          },
          
          onError: (buildingId, error) => {
            setConnectionErrors(prev => new Map(prev.set(buildingId, `Connection error: ${error.message || 'Unknown error'}`)));
          },
          
          onMessage: (buildingId, message) => {
            if (message.message_type === 'alert') {
              setAllAlerts(prev => [message.data, ...prev.slice(0, 99)]); // Keep last 100 alerts
            }
          }
        });

        // Register alert handler
        webSocketService.onAlert(buildingId, (alertData) => {
          setAllAlerts(prev => [alertData, ...prev.slice(0, 99)]); // Keep last 100 alerts
        });
      }
    });
  }, [buildingIds, connections]);

  // Disconnect from all buildings
  const disconnectFromAll = useCallback(() => {
    buildingIds.forEach(buildingId => {
      webSocketService.disconnect(buildingId);
    });
    setConnections(new Map());
    setConnectionErrors(new Map());
  }, [buildingIds]);

  // Send command to multiple buildings
  const sendCommandToBuildings = useCallback((command, targetBuildings = buildingIds) => {
    targetBuildings.forEach(buildingId => {
      if (connections.get(buildingId)) {
        webSocketService.sendCommand(buildingId, command);
      }
    });
  }, [buildingIds, connections]);

  // Get connection status for all buildings
  const getConnectionStatus = useCallback(() => {
    const status = {};
    buildingIds.forEach(buildingId => {
      status[buildingId] = {
        isConnected: connections.get(buildingId) || false,
        error: connectionErrors.get(buildingId) || null
      };
    });
    return status;
  }, [buildingIds, connections, connectionErrors]);

  // Connect on mount and disconnect on unmount
  useEffect(() => {
    if (buildingIds.length > 0) {
      connectToBuildings();
    }

    return () => {
      disconnectFromAll();
    };
  }, [buildingIds, connectToBuildings, disconnectFromAll]);

  return {
    // Connection state
    connections: getConnectionStatus(),
    allAlerts,
    
    // Actions
    connectToBuildings,
    disconnectFromAll,
    sendCommandToBuildings,
    
    // Utility
    isAnyConnected: Array.from(connections.values()).some(Boolean),
    totalConnected: Array.from(connections.values()).filter(Boolean).length
  };
}; 