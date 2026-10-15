const express = require('express');
const { signup, login } = require('../controllers/userController');
const authLimiter = require('../middleware/rateLimiter');
const { 
    signupValidators,
    loginValidators
} = require('../validators/userValidators');

const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/signup', authLimiter, signupValidators, validateRequest, signup);
router.post('/login', authLimiter, loginValidators, validateRequest, login)

module.exports = router;