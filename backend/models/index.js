const { sequelize } = require('../database/db');
const User = require('./User');
const Recipe = require('./Recipe');

// Define associations if needed in the future
// User.hasMany(Recipe);
// Recipe.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Recipe
};
