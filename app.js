const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

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

module.exports = app;