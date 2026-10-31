import axios from 'axios';
import { logout } from './redux/slices/authSlice';
import { store } from './redux/store';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor logic 
API.interceptors.request.use(
  (config) => {
    // Check Redux store token or sessionStorage/localStorage token
    let token = store.getState().auth.token;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor logic 
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
