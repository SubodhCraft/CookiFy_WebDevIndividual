const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Get all recipes (Public or Protected, depending on preference. Let's make it protected for the dashboard)
router.get('/', protect, getRecipes);
router.get('/:id', protect, getRecipeById);

module.exports = router;
