import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('AllException');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let code = status;

    const isHttpException = exception instanceof HttpException;

    if (isHttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if ('message' in exceptionResponse) {
          message = exceptionResponse['message'] as string;
        }

        if ('code' in exceptionResponse) {
          code = exceptionResponse['code'] as number;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    message = Array.isArray(message) ? message.join(', ') : message;

    let errorResponse: Record<string, unknown> = {
      code,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: isHttpException ? message : 'Internal server error',
    };

    // TIP: 临时处理方案，后续重写`validatorPipe`
    if (typeof exception === 'object' && exception && 'code' in exception) {
      errorResponse = {
        ...errorResponse,
        ...exception,
      };
    }

    // 获取请求信息
    const ip = request.ip || request.connection.remoteAddress;
    const user = request['user'] as AuthPayload; // 从请求中获取用户信息（如果有）
    const userId = user?.sub;
    const requestId =
      request.headers['x-request-id'] ||
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // 记录错误信息
    this.logger.error(
      `异常: ${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      {
        context: 'ExceptionsFilter',
        requestId: requestId as string,
        userId: userId,
        ip,
        path: request.url,
        method: request.method,
        errorName: exception instanceof Error ? exception.name : 'UnknownError',
        errorCode: status,
        errorType: exception?.constructor?.name,
        query: request.query ? JSON.stringify(request.query) : undefined,
        params: request.params ? JSON.stringify(request.params) : undefined,
        body: request.body ? JSON.stringify(request.body) : undefined,
      },
    );

    // Always return HTTP status 200, but include error code in response body
    response.status(HttpStatus.OK).json(errorResponse);
  }
}
