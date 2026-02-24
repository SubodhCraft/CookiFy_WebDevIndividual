const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const { connectDB } = require('./database/db');
require('./models');
const routes = require('./routes');

const seedRecipes = require('./seedData');

const app = express();

// EARLY LOGGER
app.use((req, res, next) => {
    console.log(`[EARLY LOG] ${req.method} ${req.url}`);
    next();
});

const startServer = async () => {
    await connectDB();
    await seedRecipes();
};

startServer();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins in development or if origin is null (e.g. server-to-server)
        if (!origin || process.env.NODE_ENV === 'development' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Cookify API',
        version: '1.0.0'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Debug test route
app.get('/test-direct', (req, res) => res.json({ message: 'Backend is direct-reachable' }));

// API Routes
app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://127.0.0.1:${PORT}/api`);
});

module.exports = app;
