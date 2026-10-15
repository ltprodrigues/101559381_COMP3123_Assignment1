const fs = require('fs');
const path = require('path');
const winston = require('winston');

const transports = [];

if (process.env.VERCEL === '1') {
    transports.push(new winston.transports.Console());
} else {

const logsDirectory = path.join(__dirname, '..', 'logs');

fs.mkdirSync(logsDirectory, { recursive: true });


transports.push(
        new winston.transports.File({
            filename: path.join(logsDirectory, 'app.log')
        })
    );
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
        transports
});

module.exports = logger;