import axios from 'axios';

// API base URL - can be overridden by environment variable
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('cookify_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect to signin if we're not already trying to login
        const isLoginAttempt = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginAttempt) {
            // Token expired or invalid
            localStorage.removeItem('cookify_token');
            localStorage.removeItem('cookify_user');
            // Avoid redirecting if already on signin or signup
            if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
