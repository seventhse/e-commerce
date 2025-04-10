import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { type IResponse } from '@e-commerce/shared';
import type { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('ResponseInterceptor');
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, body } = request;

    // 获取请求信息
    const ip = request.ip || request.connection.remoteAddress;
    const user = request['user']; // 从请求中获取用户信息（如果有）
    const userId = user?.sub;
    const requestId = request.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // 设置请求上下文信息
    this.logger.setRequestContext({
      requestId: requestId as string,
      userId,
      ip,
      path: url,
      method,
    });

    // 记录请求信息
    this.logger.log(`请求开始: ${method} ${url}`, {
      params: request.params ? JSON.stringify(request.params) : undefined,
      query: request.query ? JSON.stringify(request.query) : undefined,
      body: method !== 'GET' && body ? JSON.stringify(body, null, 2) : undefined,
    });
    context.switchToHttp().getResponse<Response>().status(HttpStatus.OK);

    const now = Date.now();

    return next.handle().pipe(
      // Handle successful responses
      map((data: T) => {
        const response = {
          code: 200, // 0 means success
          data: data,
          message: 'Success',
          timestamp: new Date().toISOString(),
        };

        // 记录响应时间和信息
        const duration = Date.now() - now;
        this.logger.log(`请求完成: ${method} ${url} - ${duration}ms`, {
          duration,
          statusCode: 200,
          dataType: data ? typeof data : 'null',
        });

        // 清除请求上下文
        this.logger.clearRequestContext();
        return response;
      }),
      // Handle exceptions
      catchError((error) => {
        const status: HttpStatus =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const response =
          error instanceof HttpException
            ? error.getResponse()
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              { message: error.message || 'Internal server error' };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const message =
          typeof response === 'object' && 'message' in response
            ? response['message']
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              error.message || '';

        const code =
          typeof response === 'object' && 'code' in response
            ? response['code']
            : status;

        // 记录错误信息
        const duration = Date.now() - now;
        this.logger.error(
          `请求失败: ${method} ${url} - ${status} - ${
            Array.isArray(message) ? message.join(', ') : message
          }`,
          error instanceof Error ? error.stack : undefined,
          {
            duration,
            errorName: error.name || 'UnknownError',
            errorCode: status,
            errorType: error.constructor.name,
          }
        );

        // 清除请求上下文
        this.logger.clearRequestContext();

        // Set HTTP status to 200 but include error code in response
        context.switchToHttp().getResponse<Response>().status(HttpStatus.OK);

        return throwError(() => ({
          code,
          data: null,
          message: Array.isArray(message)
            ? message.join(', ')
            : (message as string),
          timestamp: new Date().toISOString(),
        }));
      }),
    );
  }
}
