const { Recipe } = require('../models');

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: recipes
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }
        res.json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    getRecipes,
    getRecipeById
};
