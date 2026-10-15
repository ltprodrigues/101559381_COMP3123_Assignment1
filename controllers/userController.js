const bcrypt = require('bcrypt');
const User = require('../models/User')

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

module.exports = { signup };