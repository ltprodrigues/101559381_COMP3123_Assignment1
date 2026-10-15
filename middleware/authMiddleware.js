const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const authenticate = async (request, response, next) => {
    const authorization = request.get('Authorization');
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return response.status(401).json({
            status: 'error',
            message: 'A Bearer token is required'
        });
    }

    let payload;

    try {
        payload = jwt.verify(
            match[1],
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );
    } catch (error) {
        if (
            error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError' ||
            error.name === 'NotBeforeError'
        ) {
            return response.status(401).json({
                status: 'error',
                message: error.name === 'TokenExpiredError'
                    ? 'Token has expired'
                    : 'Invalid token'
            });
        }

        return next(error);
    }

    if (
        typeof payload !== 'object' ||
        payload === null ||
        !mongoose.isObjectIdOrHexString(payload.sub)
    ) {
        return response.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }

    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return response.status(401).json({
                status: 'error',
                message: 'Invalid authentication'
            });
        }

        request.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;