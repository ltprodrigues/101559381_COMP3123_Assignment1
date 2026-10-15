const express = require('express');
const { signup } = require('../controllers/userController');
const { signupValidators } = require('../validators/userValidators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/signup', signupValidators, validateRequest, signup);

module.exports = router;