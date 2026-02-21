const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, getUserRecipes, createRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.use((req, res, next) => {
    console.log(`[Recipe Router] ${req.method} ${req.url}`);
    next();
});

// Public debug route
router.get('/public-debug', (req, res) => res.json({ status: 'Recipe Router Is Reachable Publicly' }));

// Protected routes for specific users
router.get('/my/all', protect, getUserRecipes);
router.post('/', protect, upload.single('image'), createRecipe);

// Public routes
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

module.exports = router;
