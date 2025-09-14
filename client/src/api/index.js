import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token; // ✅ matches backend middleware
  }
  return config;
});

export default API;
