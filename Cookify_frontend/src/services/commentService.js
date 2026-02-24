import api from './api';

const commentService = {
    /**
     * Add a comment to a recipe
     * @param {string} recipeId 
     * @param {string} content 
     */
    addComment: async (recipeId, content) => {
        const response = await api.post(`/comments/recipe/${recipeId}`, { content });
        return response.data;
    },

    /**
     * Get all comments for a recipe
     * @param {string} recipeId 
     */
    getRecipeComments: async (recipeId) => {
        const response = await api.get(`/comments/recipe/${recipeId}`);
        return response.data;
    },

    /**
     * Delete a comment
     * @param {string} commentId 
     */
    deleteComment: async (commentId) => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    }
};

export default commentService;
