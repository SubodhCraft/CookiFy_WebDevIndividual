const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'cookify_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
        console.log('PostgreSQL Connected Successfully');
        console.log(`Database: ${process.env.DB_NAME || 'cookify_db'}`);

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synced (alter mode)');
        } else {
            await sequelize.sync();
            console.log('Database synced');
        }

        return sequelize;
    } catch (error) {
        console.error('PostgreSQL Connection Error:', error.message);
        process.exit(1);
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
