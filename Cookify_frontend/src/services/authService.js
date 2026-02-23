import api from './api';

/**
 * Authentication Service
 * Handles all client-side authentication operations and API calls
 */
const authService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} API response
     */
    signup: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Login user
     * @param {Object} credentials - User login credentials
     * @returns {Promise} API response
     */
    signin: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Get current user profile
     * @returns {Promise} API response
     */
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Logout user
     * @returns {Promise} API response
     */
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('cookify_token');
        localStorage.removeItem('cookify_user');
        return response.data;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('cookify_token');
    },

    /**
     * Get stored user data
     * @returns {Object|null}
     */
    getUser: () => {
        const userStr = localStorage.getItem('cookify_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get stored token
     * @returns {string|null}
     */
    getToken: () => {
        return localStorage.getItem('cookify_token');
    },

    /**
     * Store authentication data
     * @param {string} token - JWT token
     * @param {Object} user - User data
     */
    setAuthData: (token, user) => {
        localStorage.setItem('cookify_token', token);
        localStorage.setItem('cookify_user', JSON.stringify(user));
    },

    /**
     * Clear all authentication data
     */
    clearAuthData: () => {
        localStorage.removeItem('cookify_token');
        localStorage.removeItem('cookify_user');
    },

    /**
     * Update user profile picture
     * @param {File} file - Profile image file
     * @returns {Promise} API response
     */
    updateProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('profilePicture', file);
        const response = await api.post('/auth/update-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Update local user data if successful
        if (response.data.success) {
            localStorage.setItem('cookify_user', JSON.stringify(response.data.data));
        }

        return response.data;
    },

    /**
     * Send a password reset email
     * @param {string} email
     */
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Reset the user's password using the token from the email link
     * @param {string} token  - raw token from URL param
     * @param {string} password - new password
     */
    resetPassword: async (token, password) => {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    }
};

export default authService;
