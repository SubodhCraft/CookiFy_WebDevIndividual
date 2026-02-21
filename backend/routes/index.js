const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Main Router] ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./authRoutes');
const landingRoutes = require('./landingRoutes');
const recipeRoutes = require('./recipeRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');

router.use('/auth', authRoutes);
router.use('/landing', landingRoutes);
router.use('/recipes', recipeRoutes);
router.use('/bookmarks', bookmarkRoutes);

module.exports = router;
