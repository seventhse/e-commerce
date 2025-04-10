import { format, transports, createLogger } from 'winston';
import 'winston-daily-rotate-file';

// Configure Winston
const { combine, timestamp, printf, align } = format;

// Define log format
const logFormat = printf((info) => {
  const { timestamp, level, message, context, requestId, userId, ip, path, method, operation, duration, ...rest } = info;

  // 构建上下文信息
  let contextInfo = '';
  if (context) contextInfo += `[${context as string}] `;
  if (requestId) contextInfo += `[ReqID:${requestId as string}] `;
  if (userId) contextInfo += `[UserID:${userId as string}] `;

  // 构建请求信息
  let requestInfo = '';
  if (method && path) requestInfo = ` [${method as string} ${path as string}]`;
  if (ip) requestInfo += ` [IP:${ip as string}]`;
  if (operation) requestInfo += ` [Op:${operation as string}]`;
  if (duration) requestInfo += ` [${duration as number}ms]`;

  // 构建额外信息
  const restString = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';

  return `${timestamp as string} ${level}: ${contextInfo}${message as string}${requestInfo}${restString}`;
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

/**
 * 日志上下文接口
 */
export interface LogContext {
  context?: string;      // 模块或类名称
  requestId?: string;    // 请求ID
  userId?: string;       // 用户ID
  ip?: string;           // IP地址
  path?: string;         // 请求路径
  method?: string;       // 请求方法
  operation?: string;    // 操作类型
  target?: string;       // 操作目标
  result?: string;       // 操作结果
  trace?: string;        // 错误堆栈
  duration?: number;     // 操作持续时间（毫秒）
  [key: string]: any;    // 其他自定义字段
}

/**
 * 使用Winston记录日志
 * @param level 日志级别
 * @param message 日志消息
 * @param contextOrStr 上下文对象或字符串
 * @param trace 错误堆栈（当contextOrStr为字符串时使用）
 */
export const logWithWinston = (
  level: string,
  message: string,
  contextOrStr?: LogContext | string,
  trace?: string,
) => {
  let meta: Record<string, any> = {};

  // 处理上下文参数
  if (typeof contextOrStr === 'string') {
    meta.context = contextOrStr;
    if (trace) {
      meta.trace = trace;
    }
  } else if (contextOrStr) {
    meta = { ...contextOrStr };
  }

  // 添加进程信息
  meta.pid = process.pid;
  meta.env = process.env.NODE_ENV || 'development';
  meta.timestamp = new Date().toISOString();

  winstonLogger.log(level, message, meta);
};
