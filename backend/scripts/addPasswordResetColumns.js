/**
 * Migration: Add password reset columns to users table
 * Run once: node backend/scripts/addPasswordResetColumns.js
 */
const { sequelize } = require('../database/db');

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        const queryInterface = sequelize.getQueryInterface();
        const tableDesc = await queryInterface.describeTable('users');

        if (!tableDesc.password_reset_token) {
            await queryInterface.addColumn('users', 'password_reset_token', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true
            });
            console.log('✅ Added column: password_reset_token');
        } else {
            console.log('ℹ️  Column password_reset_token already exists, skipping.');
        }

        if (!tableDesc.password_reset_expires) {
            await queryInterface.addColumn('users', 'password_reset_expires', {
                type: require('sequelize').DataTypes.DATE,
                allowNull: true
            });
            console.log('✅ Added column: password_reset_expires');
        } else {
            console.log('ℹ️  Column password_reset_expires already exists, skipping.');
        }

        console.log('\n🎉 Migration complete! Password reset columns are ready.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
