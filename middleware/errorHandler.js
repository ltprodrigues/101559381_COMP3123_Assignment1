const logger = require('../utils/logger');

const errorHandler = (error, request, response, next) => {
    if (response.headersSent) {
        return next(error);
    }

    logger.error('Request error', {
        method: request.method,
        path: request.path,
        errorName: error.name,
        errorCode: error.code
    });

    // MongoDB duplicate unique field
    if (error.code === 11000) {
        return response.status(409).json({
            status: 'error',
            message: 'Username or email already exists'
        });
    }

    // Mongoose schema validation
    if (error.name === 'ValidationError') {
        return response.status(400).json({
            status: 'error',
            message: 'Invalid data'
        });
    }

    // Invalid field value or MongoDB ID
    if (error.name === 'CastError') {
        return response.status(400).json({
            status: 'error',
            message: 'Invalid field value or ID'
        });
    }

    // Malformed JSON request body
    if (error.type === 'entity.parse.failed') {
        return response.status(400).json({
            status: 'error',
            message: 'Invalid JSON request body'
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

module.exports = errorHandler;