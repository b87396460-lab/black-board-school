const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dev logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
app.use(helmet());

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true
};
app.use(cors(corsOptions));

// Root route for health check
app.get('/', (req, res) => {
    res.json({
        message: 'Backend is running!',
        status: 'success',
        mongodb: 'Connected',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/admissions', require('./routes/admissions'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
