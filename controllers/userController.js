const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const signup = async (request, response, next) => {
    try{
        const {username, email, password} = request.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return response.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });

    } catch (error){
        next(error);
    }
};
const login = async (request, response, next) => {
    try {
        const { username, email, password } = request.body;

        const filter = username ? { username } : { email };

        const user = await User.findOne(filter).select('+password');

        if (!user) {
            return response.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return response.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {},
            process.env.JWT_SECRET,
            {
                subject: user._id.toString(),
                algorithm: 'HS256',
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        return response.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };