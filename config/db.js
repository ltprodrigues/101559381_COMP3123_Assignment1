const mongoose = require('mongoose');

let connectionPromise;

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(
            process.env.MONGODB_URI,
            { serverSelectionTimeoutMS: 10000 }
        ).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    await connectionPromise;
    return mongoose;
};


module.exports = connectDB;