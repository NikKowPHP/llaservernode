const winston = require('winston');

const customFormatter = winston.format.printf((info) => {
    const { timestamp, level, message } = info;
    return `${timestamp} - ${level.toUpperCase()}: ${message}`;
  });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    // customFormatter
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports as needed (e.g., file transport)
  ],
});

module.exports = logger; 