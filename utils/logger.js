const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logsDirectory = path.join(__dirname, '..', 'logs');

fs.mkdirSync(logsDirectory, { recursive: true });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDirectory, 'app.log')
        })
    ]
});

module.exports = logger;