const { body, param, query } = require('express-validator');

const employeeValidators = [
    ...['first_name', 'last_name', 'position', 'department'].map(
        (field) =>
            body(field)
                .isString()
                .withMessage(`${field} must be a string`)
                .bail()
                .trim()
                .isLength({ min: 1, max: 100 })
                .withMessage(`${field} must contain 1 to 100 characters`)
    ),

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

    body('salary')
        .custom((value) =>
            typeof value === 'number' &&
            Number.isFinite(value) &&
            value >= 0.01
        )
        .withMessage('Salary must be a number greater than or equal to 0.01'),

    body('date_of_joining')
        .isString()
        .withMessage('Date of joining must be a string')
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date of joining must use YYYY-MM-DD')
        .bail()
        .isISO8601({ strict: true })
        .withMessage('Date of joining must be a valid date'),

    body('user')
        .not()
        .exists()
        .withMessage('Employee ownership is assigned automatically'),

    body('_id')
        .not()
        .exists()
        .withMessage('Employee ID is generated automatically')
];

const employeeIdValidator = [
    param('eid')
        .isMongoId()
        .withMessage('Employee ID must be a valid MongoDB ObjectId')
];

const deleteEmployeeIdValidator = [
    query('eid')
        .isMongoId()
        .withMessage('Employee ID must be a valid MongoDB ObjectId')
];

module.exports = {
    employeeValidators,
    employeeIdValidator,
    deleteEmployeeIdValidator
};