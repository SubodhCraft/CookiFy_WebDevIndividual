const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 30],
                msg: 'Username must be between 3 and 30 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email address'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'full_name'
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
        field: 'profile_picture'
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'chef'),
        defaultValue: 'user'
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'password_reset_token'
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'password_reset_expires'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                console.log(`[User Hook] Hashing password for new user: ${user.email}`);
                const salt = await bcrypt.genSalt(12);
                user.password = await bcrypt.hash(user.password, salt);
                console.log(`[User Hook] Password hashed for new user: ${user.email}`);
            }
        },
        beforeUpdate: async (user) => {
            console.log(`[User Hook] beforeUpdate for user: ${user.email}. Password changed? ${user.changed('password')}`);
            if (user.changed('password')) {
                console.log(`[User Hook] Hashing new password for existing user: ${user.email}`);
                const salt = await bcrypt.genSalt(12);
                user.password = await bcrypt.hash(user.password, salt);
                console.log(`[User Hook] New password hashed for user: ${user.email}`);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    console.log(`[User Model] Comparing password for: ${this.email}`);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`[User Model] Comparison result for ${this.email}: ${isMatch}`);
    return isMatch;
};

User.prototype.getPublicProfile = function () {
    const userObject = this.toJSON();
    delete userObject.password;
    return userObject;
};

module.exports = User;
