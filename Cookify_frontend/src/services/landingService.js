import api from './api';

/**
 * Landing Page Service
 * Handles data fetching for the landing page
 */
const landingService = {
    /**
     * Get landing page data (stats, features, testimonials, etc.)
     * @returns {Promise} API response
     */
    getLandingData: async () => {
        const response = await api.get('/landing');
        return response.data;
    },

    /**
     * Subscribe to newsletter
     * @param {string} email
     * @returns {Promise} API response
     */
    subscribe: async (email) => {
        const response = await api.post('/landing/subscribe', { email });
        return response.data;
    },

    /**
     * Submit contact form
     * @param {Object} data - { name, email, subject, message }
     * @returns {Promise} API response
     */
    submitContact: async (data) => {
        const response = await api.post('/landing/contact', data);
        return response.data;
    }
};

export default landingService;
