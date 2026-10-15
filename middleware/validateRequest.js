const { validationResult } = require('express-validator')

const validadeRequest = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
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