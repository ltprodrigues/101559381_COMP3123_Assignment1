const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
    employeeValidators,
    employeeIdValidator,
    deleteEmployeeIdValidator
} = require('../validators/employeeValidators');
const {
    createEmployee,
    getEmployees, 
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authenticate);

router.get('/employees', getEmployees);

router.post(
    '/employees',
    employeeValidators,
    validateRequest,
    createEmployee
);

router.get(
    '/employees/:eid',
    employeeIdValidator,
    validateRequest,
    getEmployeeById
);

router.put(
    '/employees/:eid',
    employeeIdValidator,
    employeeValidators,
    validateRequest,
    updateEmployee
);
router.delete(
    '/employees',
    deleteEmployeeIdValidator,
    validateRequest,
    deleteEmployee
);

module.exports = router;