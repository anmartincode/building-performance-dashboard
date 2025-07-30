// API service for communicating with Python FastAPI backend
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  // Building Management
  async getBuildings() {
    return await this.request('/buildings');
  }

  async getBuildingData(buildingId, hours = 24) {
    return await this.request(`/buildings/${buildingId}/data?hours=${hours}`);
  }

  // AI/ML Features
  async getPredictions(buildingId, feature, hoursAhead = 24) {
    return await this.request('/predictions', {
      method: 'POST',
      body: JSON.stringify({
        building_id: buildingId,
        feature: feature,
        hours_ahead: hoursAhead,
      }),
    });
  }

  async getAnomalies(buildingId) {
    return await this.request(`/anomalies/${buildingId}`);
  }

  // System Health
  async getHealth() {
    return await this.request('/health');
  }
}

// Global API service instance
const apiService = new ApiService();

export default apiService; 