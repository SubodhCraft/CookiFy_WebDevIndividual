const { sequelize } = require('../database/db');
const User = require('./User');
const Recipe = require('./Recipe');

// Define associations
User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Recipe
};
