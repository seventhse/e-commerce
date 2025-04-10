import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { logWithWinston } from './winston.logger';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(props?: any) {
    super(props);
  }
  log(message: any, context?: string) {
    // Use NestJS built-in logger for console output
    super.log(message, context || '');

    // Also log to Winston for storage
    logWithWinston('info', message, context || this.context);
  }

  error(message: any, stack?: string, context?: string) {
    // Use NestJS built-in logger for console output
    super.error(message, stack, context);

    // Also log to Winston for storage
    logWithWinston('error', message, context || this.context, stack);
  }

  warn(message: any, context?: string) {
    // Use NestJS built-in logger for console output
    super.warn(message, context);

    // Also log to Winston for storage
    logWithWinston('warn', message, context || this.context);
  }

  debug(message: any, context?: string) {
    // Use NestJS built-in logger for console output
    super.debug(message, context);

    // Also log to Winston for storage
    logWithWinston('debug', message, context || this.context);
  }

  verbose(message: any, context?: string) {
    // Use NestJS built-in logger for console output
    super.verbose(message, context);

    // Also log to Winston for storage
    logWithWinston('verbose', message, context || this.context);
  }
}
