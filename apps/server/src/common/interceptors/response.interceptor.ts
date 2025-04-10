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

    // Log the request
    this.logger.log(`Request: ${method} ${url}`);
    if (method !== 'GET' && body) {
      this.logger.debug(`Request Body: \n ${JSON.stringify(body, null, 2)}`);
    }
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

        // Log the response time
        this.logger.log(`Response: ${method} ${url} - ${Date.now() - now}ms`);
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

        // Log the error
        this.logger.error(
          `Error: ${method} ${url} - ${status} - ${
            Array.isArray(message) ? message.join(', ') : message
          }`,
          error instanceof Error ? error.stack : undefined,
        );

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
