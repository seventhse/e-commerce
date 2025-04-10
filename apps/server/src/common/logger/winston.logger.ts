import { format, transports, createLogger } from 'winston';
import 'winston-daily-rotate-file';

// Configure Winston
const { combine, timestamp, printf, align } = format;

// Define log format
const logFormat = printf((info) => {
  const { timestamp, level, message, context, ...rest } = info;
  const contextMessage = context ? `[${context as string}] ` : '';
  const restString = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
  return `${timestamp as string} ${level}: ${contextMessage}${message as string}${restString}`;
});

// // Create transports
// const consoleTransport = new transports.Console({
//   format: combine(
//     colorize({ all: true }),
//     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     align(),
//     logFormat,
//   ),
// });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const fileInfoTransport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat,
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const fileErrorTransport = new transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat,
  ),
});

export const winstonLogger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [fileInfoTransport, fileErrorTransport],
});

// Create a function to log with Winston
export const logWithWinston = (
  level: string,
  message: string,
  context?: string,
  trace?: string,
) => {
  const meta: Record<string, any> = {};

  if (context) {
    meta.context = context;
  }

  if (trace) {
    meta.trace = trace;
  }

  winstonLogger.log(level, message, meta);
};
