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
    getAllRecipes: async () => {
        const response = await api.get('/recipes');
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
    }
};

export default recipeService;
