import api from './api';

/**
 * Recipe Service
 * Handles all recipe-related API calls
 */
const recipeService = {
    /**
     * Get all recipes
     * @returns {Promise} API response
     */
    getAllRecipes: async (query = '') => {
        const response = await api.get(`/recipes${query ? `?q=${query}` : ''}`);
        return response.data;
    },

    /**
     * Get recipe by ID
     * @param {string} id - Recipe ID
     * @returns {Promise} API response
     */
    getRecipeById: async (id) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    /**
     * Get recipes created by current user
     * @returns {Promise} API response
     */
    getMyRecipes: async () => {
        const response = await api.get('/recipes/my/all');
        return response.data;
    },

    /**
     * Create a new recipe
     * @param {FormData} formData - Recipe data including image
     * @returns {Promise} API response
     */
    createRecipe: async (formData) => {
        const response = await api.post('/recipes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default recipeService;
