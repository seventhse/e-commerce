import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { LogContext, logWithWinston } from './winston.logger';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  // 存储请求上下文信息
  private requestContext: Partial<LogContext> = {};

  constructor(props?: any) {
    super(props);
  }

  /**
   * 设置请求上下文信息
   */
  setRequestContext(context: Partial<LogContext>) {
    this.requestContext = { ...this.requestContext, ...context };
    return this;
  }

  /**
   * 清除请求上下文信息
   */
  clearRequestContext() {
    this.requestContext = {};
    return this;
  }

  /**
   * 获取完整的上下文信息
   */
  private getFullContext(context?: string | LogContext): LogContext {
    if (typeof context === 'string') {
      return {
        ...this.requestContext,
        context: context || this.context,
      };
    } else if (context) {
      return {
        ...this.requestContext,
        ...context,
        context: context.context || this.context,
      };
    }

    return {
      ...this.requestContext,
      context: this.context,
    };
  }

  /**
   * 记录信息日志
   */
  log(message: any, context?: string | LogContext) {
    // 使用NestJS内置日志输出到控制台
    if (typeof context === 'string' || !context) {
      super.log(message, (context as string) || '');
    } else {
      super.log(message, context.context || '');
    }

    // 同时记录到Winston存储
    logWithWinston('info', message, this.getFullContext(context));
  }

  /**
   * 记录错误日志
   */
  error(message: any, stack?: string, context?: string | LogContext) {
    // 使用NestJS内置日志输出到控制台
    if (typeof context === 'string' || !context) {
      super.error(message, stack, (context as string));
    } else {
      super.error(message, stack, context.context);
    }

    // 构建上下文
    const fullContext = this.getFullContext(context);
    if (stack) {
      fullContext.trace = stack;
    }

    // 同时记录到Winston存储
    logWithWinston('error', message, fullContext);
  }

  /**
   * 记录警告日志
   */
  warn(message: any, context?: string | LogContext) {
    // 使用NestJS内置日志输出到控制台
    if (typeof context === 'string' || !context) {
      super.warn(message, (context as string));
    } else {
      super.warn(message, context.context);
    }

    // 同时记录到Winston存储
    logWithWinston('warn', message, this.getFullContext(context));
  }

  /**
   * 记录调试日志
   */
  debug(message: any, context?: string | LogContext) {
    // 使用NestJS内置日志输出到控制台
    if (typeof context === 'string' || !context) {
      super.debug(message, (context as string));
    } else {
      super.debug(message, context.context);
    }

    // 同时记录到Winston存储
    logWithWinston('debug', message, this.getFullContext(context));
  }

  /**
   * 记录详细日志
   */
  verbose(message: any, context?: string | LogContext) {
    // 使用NestJS内置日志输出到控制台
    if (typeof context === 'string' || !context) {
      super.verbose(message, (context as string));
    } else {
      super.verbose(message, context.context);
    }

    // 同时记录到Winston存储
    logWithWinston('verbose', message, this.getFullContext(context));
  }

  /**
   * 记录业务操作日志，包含操作类型、目标对象和结果
   */
  logOperation(operation: string, target: string, result: string, context?: LogContext) {
    const message = `操作: ${operation}, 目标: ${target}, 结果: ${result}`;
    this.log(message, {
      ...context,
      operation,
      target,
      result,
    });
  }

  /**
   * 记录数据库操作日志
   */
  logDatabase(operation: string, entity: string, id?: string, duration?: number, context?: LogContext) {
    const targetId = id ? `, ID: ${id}` : '';
    const durationStr = duration ? `, 耗时: ${duration}ms` : '';
    const message = `数据库${operation}: ${entity}${targetId}${durationStr}`;

    this.log(message, {
      ...context,
      dbOperation: operation,
      entity,
      entityId: id,
      duration,
    });
  }
}
