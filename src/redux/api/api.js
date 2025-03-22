// src/redux/api/api.js
import axios from 'axios';

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: 'https://treatline-vha-backend.vercel.app/api',  // Update with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the token in the axios headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Automatically set the token from localStorage (if present) on app start
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., token expiration)
      console.error('Unauthorized access - possibly due to token expiration.');
      localStorage.removeItem('token');
      setAuthToken(null);
      window.location.href = '/login'; // Redirect to login
    } else {
      console.error('API Error:', error.response ? error.response.data : error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
