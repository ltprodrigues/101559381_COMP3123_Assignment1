const mongoose = require('mongoose');

const connectDB = async() => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connectec successfully');
};

module.exports = connectDB;