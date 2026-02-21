const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prepTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
        defaultValue: 'Medium'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: []
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true // Set to true for now to allow existing recipes without user
    }
}, {
    timestamps: true
});

module.exports = Recipe;
