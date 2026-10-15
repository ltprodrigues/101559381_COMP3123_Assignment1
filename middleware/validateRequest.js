const { validationResult } = require('express-validator')
const logger = require('../utils/logger');

const validadeRequest = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        logger.warn('Request validation failed', {
            method: request.method,
            path: request.path,
            fields: errors.array().map((error) => error.path)
        });


        return response.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};

module.exports = validadeRequest;