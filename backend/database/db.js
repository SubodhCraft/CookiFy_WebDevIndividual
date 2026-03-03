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

        const isTest = process.env.NODE_ENV === 'test';
        const isUsingTestDB = sequelize.getDatabaseName() === process.env.TEST_DB_NAME;

        if (isTest && isUsingTestDB) {
            // ONLY use force:true if we are sure we are on the test database
            await sequelize.sync({ force: true });
            console.log('Database Synchronized (TEST MODE - DATA RESET)');
        } else {
            // Preservation mode for development/production
            await sequelize.sync({ alter: true });
            console.log('Database Synchronized (Preservation Mode)');
        }

        return sequelize;
    } catch (error) {
        console.error('PostgreSQL Connection Error:', error.message);
        throw error;
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
