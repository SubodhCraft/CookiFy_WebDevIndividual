const { Recipe, User, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getRecipes = async (req, res) => {
    try {
        const { q } = req.query;
        console.log(`[getRecipes] Fetching recipes. Search query: ${q || 'none'}`);

        let where = {};

        if (q) {
            const searchKeyword = `%${q.toLowerCase()}%`;
            where = {
                [Op.or]: [
                    { title: { [Op.iLike]: searchKeyword } },
                    { description: { [Op.iLike]: searchKeyword } },
                    { category: { [Op.iLike]: searchKeyword } },
                    sequelize.where(
                        sequelize.fn('array_to_string', sequelize.col('tags'), ','),
                        { [Op.iLike]: searchKeyword }
                    ),
                    sequelize.where(
                        sequelize.fn('array_to_string', sequelize.col('ingredients'), ','),
                        { [Op.iLike]: searchKeyword }
                    )
                ]
            };
        }

        const recipes = await Recipe.findAll({
            where,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['fullName', 'username']
            }]
        });

        res.json({
            success: true,
            count: recipes.length,
            data: recipes
        });
    } catch (error) {
        console.error('❌ Error fetching recipes:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['fullName', 'username']
            }]
        });
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

const getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: recipes
        });
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const createRecipe = async (req, res) => {
    try {
        const { title, description, prepTime, calories, difficulty, category, tags, ingredients, instructions } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image for your recipe'
            });
        }

        const imagePath = `/uploads/recipes/${req.file.filename}`;

        const recipe = await Recipe.create({
            title,
            description,
            prepTime,
            calories: parseInt(calories),
            difficulty,
            category,
            tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags,
            ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(ing => ing.trim()) : ingredients,
            instructions,
            image: imagePath,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

const updateRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Make sure user is recipe owner
        if (recipe.userId !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authorized to update this recipe'
            });
        }

        const { title, description, prepTime, calories, difficulty, category, tags, ingredients, instructions } = req.body;

        const updateData = {
            title,
            description,
            prepTime,
            calories: calories ? parseInt(calories) : recipe.calories,
            difficulty,
            category,
            tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags,
            ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(ing => ing.trim()) : ingredients,
            instructions
        };

        if (req.file) {
            updateData.image = `/uploads/recipes/${req.file.filename}`;
        }

        recipe = await recipe.update(updateData);

        res.json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

module.exports = {
    getRecipes,
    getRecipeById,
    getUserRecipes,
    createRecipe,
    updateRecipe
};
