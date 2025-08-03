import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Test endpoints
  async testConnection() {
    const response = await api.get('/api/public/test');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/api/public/stats');
    return response.data;
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Auth endpoints
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Properties endpoints
  async getProperties(params = {}) {
    const response = await api.get('/api/properties', { params });
    return response.data;
  },

  async getProperty(id) {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  },
};

export default api;