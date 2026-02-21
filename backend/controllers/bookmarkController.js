const { Bookmark, Recipe, User } = require('../models');

/**
 * Toggle bookmark for a recipe
 * @route POST /api/bookmarks/toggle/:recipeId
 */
const toggleBookmark = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        console.log(`[BookmarkCtrl] Toggle request: user=${userId}, recipe=${recipeId}`);

        // Check if recipe exists
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            console.log(`[BookmarkCtrl] Recipe not found: ${recipeId}`);
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({
            where: { userId, recipeId }
        });

        if (existingBookmark) {
            // Remove bookmark
            console.log(`[BookmarkCtrl] Removing bookmark for user=${userId}, recipe=${recipeId}`);
            await existingBookmark.destroy();
            return res.json({
                success: true,
                isBookmarked: false,
                message: 'Bookmark removed'
            });
        } else {
            // Add bookmark
            console.log(`[BookmarkCtrl] Adding bookmark for user=${userId}, recipe=${recipeId}`);
            await Bookmark.create({ userId, recipeId });
            return res.json({
                success: true,
                isBookmarked: true,
                message: 'Recipe bookmarked'
            });
        }
    } catch (error) {
        console.error('❌ Error toggling bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get all bookmarked recipes for the current user
 * @route GET /api/bookmarks
 */
const getMyBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[BookmarkCtrl] Fetching bookmarks for user=${userId}`);

        const bookmarks = await Bookmark.findAll({
            where: { userId },
            include: [{
                model: Recipe,
                include: [{
                    model: User,
                    attributes: ['fullName', 'username', 'profilePicture']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log(`[BookmarkCtrl] Found ${bookmarks.length} bookmarks`);

        // Filter out any bookmarks where the recipe might have been deleted but bookmark remained
        const bookmarkedRecipes = bookmarks
            .filter(b => b.Recipe)
            .map(b => b.Recipe);

        res.json({
            success: true,
            count: bookmarkedRecipes.length,
            data: bookmarkedRecipes
        });
    } catch (error) {
        console.error('❌ Error fetching bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Check if a specific recipe is bookmarked by the user
 * @route GET /api/bookmarks/check/:recipeId
 */
const checkBookmark = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const bookmark = await Bookmark.findOne({
            where: { userId, recipeId }
        });

        res.json({
            success: true,
            isBookmarked: !!bookmark
        });
    } catch (error) {
        console.error('Error checking bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    toggleBookmark,
    getMyBookmarks,
    checkBookmark
};
