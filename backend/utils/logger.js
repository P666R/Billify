import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, prettyPrint } = format;

// Configure daily rotating file transport for combined logs
const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

// Create a Winston logger with specified formats and transports
export const systemLogs = createLogger({
  level: 'http',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    new transports.File({ level: 'error', filename: './logs/error.log' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: './logs/exception.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: './logs/rejections.log' }),
  ],
});

// Add Console transport only in development
if (process.env.NODE_ENV === 'development') {
  systemLogs.add(
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        format.prettyPrint()
      ),
    })
  );
}

// Define Morgan middleware for logging HTTP requests
export const morganMiddleware = morgan(
  (tokens, req, res) => {
    const logData = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
    };
    return JSON.stringify(logData);
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        systemLogs.http(`incoming-request`, data);
      },
    },
  }
);
