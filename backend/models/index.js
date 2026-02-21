const { sequelize } = require('../database/db');
const User = require('./User');
const Recipe = require('./Recipe');
const Bookmark = require('./Bookmark');

// User <-> Recipe (Creation)
User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

// User <-> Recipe (Bookmarking - Many-to-Many)
User.belongsToMany(Recipe, { through: Bookmark, as: 'bookmarkedRecipes', foreignKey: 'userId' });
Recipe.belongsToMany(User, { through: Bookmark, as: 'bookmarkedBy', foreignKey: 'recipeId' });

// direct associations for Bookmark model
Bookmark.belongsTo(User, { foreignKey: 'userId' });
Bookmark.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = {
    sequelize,
    User,
    Recipe,
    Bookmark
};
