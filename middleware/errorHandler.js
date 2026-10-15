const errorHandler = (error, request, response, next) => {
    if (response.headersSent) {
        return next(error);
    }

    //MongoDB duplicate unique id
    if (error.code === 11000) {
        return response.status(409).json({
            status: 'error',
            message: 'Username or email already exists'

        });
    }

    //Mongoose schema validation

    if(error.name === 'ValidationErros'){
        return response.status(400).json({
            status: 'error',
            message: 'Invalid data'
        });
    }

    //Invalid MongoDB ID
    if (error.name === 'CastError'){
        return response.status(400).json({
            status: 'error',
            message: 'Invalid fiel value or ID'
        })
    }

    //Malformed JSON request body
    if (error.name === 'entity.parse.failed'){
        return response.status(400).json({
            return: 'error',
            message: 'Invalid JSON request body'
        })
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

module.exports = errorHandler;