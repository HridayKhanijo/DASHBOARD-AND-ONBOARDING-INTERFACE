import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom format for console logging
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const logMessage = stack || message;
  return `${timestamp} ${level}: ${logMessage}`;
});

// Custom format for file logging
const fileFormat = printf(({ level, message, timestamp, stack }) => {
  const logMessage = stack || message;
  return `${timestamp} [${level.toUpperCase()}]: ${logMessage}`;
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Configure transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      align(),
      consoleFormat
    ),
  }),
  // Daily rotate file transport for all logs
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(timestamp(), fileFormat),
  }),
  // Error file transport
  new winston.transports.File({
    level: 'error',
    filename: path.join(logsDir, 'error.log'),
    format: combine(timestamp(), fileFormat),
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'onboarding-app' },
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    logger.info(message.trim());
  },
};

export default logger;
