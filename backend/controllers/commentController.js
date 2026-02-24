const { Comment, User } = require('../models');

/**
 * Add a comment to a recipe
 */
exports.addComment = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const comment = await Comment.create({
            content,
            userId,
            recipeId
        });

        // Fetch the comment again with User info for the frontend
        const fullComment = await Comment.findByPk(comment.id, {
            include: [{
                model: User,
                attributes: ['fullName', 'profilePicture', 'username']
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: fullComment
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
};

/**
 * Get all comments for a recipe
 */
exports.getRecipeComments = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const comments = await Comment.findAll({
            where: { recipeId },
            include: [{
                model: User,
                attributes: ['fullName', 'profilePicture', 'username']
            }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message
        });
    }
};

/**
 * Delete a comment
 */
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if the user is the owner of the comment
        if (comment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment'
            });
        }

        await comment.destroy();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete comment',
            error: error.message
        });
    }
};
