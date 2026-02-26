const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';
console.log(`Running in ${isTestEnvironment ? 'TEST' : 'DEVELOPMENT'} mode.`);

const dbName = process.env.NODE_ENV === 'test' && process.env.TEST_DB_NAME
    ? process.env.TEST_DB_NAME
    : (process.env.DB_NAME || 'cookify_db');

const sequelize = new Sequelize(
    dbName,
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected');

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database Synchronized');
        } else {
            await sequelize.sync();
        }

        return sequelize;
    } catch (error) {
        console.error('PostgreSQL Connection Error:', error.message);
        throw error; // Let the caller handle it instead of exiting
    }
};

const disconnectDB = async () => {
    try {
        await sequelize.close();
        console.log('PostgreSQL Disconnected');
    } catch (error) {
        console.error('Error disconnecting from PostgreSQL:', error.message);
    }
};

process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

module.exports = { sequelize, connectDB, disconnectDB };
