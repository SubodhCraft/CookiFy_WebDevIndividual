const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Get all comments for a recipe (public)
router.get('/recipe/:recipeId', commentController.getRecipeComments);

// Add a comment (protected)
router.post('/recipe/:recipeId', protect, commentController.addComment);

// Delete a comment (protected)
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router;
