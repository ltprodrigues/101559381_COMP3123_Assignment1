require('dotenv').config();
const logger = require('./utils/logger');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

            logger.info('Server started', {
                port: Number(PORT),
                database: 'connected'
            });
        });
    } catch (error) {
        console.error(
            'Startup failed. Check your environment variables and Atlas connection settings.'
        );
        process.exit(1);
    }
};

startServer();