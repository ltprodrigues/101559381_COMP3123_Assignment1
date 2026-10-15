const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API is running',
        database: mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected'
    });
});

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/emp', employeeRoutes);

app.use((request, response) =>{
    response.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

app.use(errorHandler);

module.exports = app;