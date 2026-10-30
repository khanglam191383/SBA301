import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Single centralized Axios instance
 */
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('funews_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token & auth session on 401
      localStorage.removeItem('funews_token');
      localStorage.removeItem('funews_current_user');
      // Dispatch custom event so React can react without page refresh
      window.dispatchEvent(new CustomEvent('funews:unauthorized'));
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to extract meaningful error message from backend ErrorResponse
 */
export function getApiErrorMessage(error, defaultMsg = 'An unexpected error occurred') {
  if (!error) return defaultMsg;
  if (error.response?.data) {
    const data = error.response.data;
    if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
      return Object.entries(data.fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
    }
    if (data.message) {
      return data.message;
    }
    if (typeof data === 'string') {
      return data;
    }
  }
  return error.message || defaultMsg;
}

export default api;
