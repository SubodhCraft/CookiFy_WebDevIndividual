const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const landingRoutes = require('./landingRoutes');
const recipeRoutes = require('./recipeRoutes');

router.use('/auth', authRoutes);
router.use('/landing', landingRoutes);
router.use('/recipes', recipeRoutes);

module.exports = router;
