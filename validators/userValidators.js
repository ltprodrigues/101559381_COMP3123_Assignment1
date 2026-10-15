const { body } = require('express-validator');

const signupValidators = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .bail()
        .trim()
        .isLength({ min:3, max:50 })
        .withMessage('Username must contain between 3 and 50 characters'),
    
    body('email')
        .isString()
        .withMessage('Email must be a string')
        .bail()
        .trim()
        .isLength({ max: 254 })
        .withMessage('Email must not exceed 254 characters')
        .isEmail()
        .withMessage('A valid email is required')
        .toLowerCase(),

    body('password')
        .isString()
        .withMessage('Password must be a string')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Password must contain at least 8 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain a number')
        .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
        .withMessage('Password must not exceed 72 bytes')
        
];

module.exports = { signupValidators };