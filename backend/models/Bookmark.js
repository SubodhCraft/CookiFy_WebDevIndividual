const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Bookmark = sequelize.define('Bookmark', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    recipeId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'bookmarks',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'recipe_id']
        }
    ]
});

module.exports = Bookmark;
