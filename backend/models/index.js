const { sequelize } = require('../database/db');
const User = require('./User');

module.exports = {
    sequelize,
    User
};
