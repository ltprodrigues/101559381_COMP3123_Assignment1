const express = require('express');
const { signup, login } = require('../controllers/userController');
const { 
    signupValidators,
    loginValidators
} = require('../validators/userValidators');

const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/signup', signupValidators, validateRequest, signup);
router.post('/login', loginValidators, validateRequest, login)

module.exports = router;