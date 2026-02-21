import api from './api';

/**
 * Bookmark Service
 * Handles all bookmark-related API calls
 */
const bookmarkService = {
    /**
     * Get all bookmarked recipes for the current user
     * @returns {Promise} API response
     */
    getMyBookmarks: async () => {
        const response = await api.get('/bookmarks');
        return response.data;
    },

    /**
     * Toggle bookmark for a recipe
     * @param {string} recipeId - Recipe ID
     * @returns {Promise} API response
     */
    toggleBookmark: async (recipeId) => {
        const response = await api.post(`/bookmarks/toggle/${recipeId}`);
        return response.data;
    },

    /**
     * Check if a recipe is bookmarked
     * @param {string} recipeId - Recipe ID
     * @returns {Promise} API response
     */
    checkBookmark: async (recipeId) => {
        const response = await api.get(`/bookmarks/check/${recipeId}`);
        return response.data;
    }
};

export default bookmarkService;
