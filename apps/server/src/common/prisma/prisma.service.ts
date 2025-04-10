import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    super();
    this.logger = logger;
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    await this.$connect();
    this.setupMiddleware();
  }

  /**
   * 设置 Prisma 中间件，用于记录数据库操作日志
   */
  private setupMiddleware() {
    this.$use(async (params, next) => {
      const startTime = Date.now();
      const { model, action } = params;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const args = params.args;

      // 记录数据库操作开始
      this.logger.debug(`数据库操作开始: ${model}.${action}`, {
        model,
        action,
        args:
          process.env.NODE_ENV !== 'production'
            ? JSON.stringify(args)
            : '[REDACTED]',
      });

      try {
        // 执行数据库操作
        const result = (await next(params)) as unknown;

        // 计算持续时间
        const duration = Date.now() - startTime;

        // 获取操作的ID（如果有）
        let id: string | undefined;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (args?.where?.id) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          id = args.where.id as string;
        }
        // 记录数据库操作完成
        this.logger.logDatabase(action, model!, id, duration, {
          resultCount: Array.isArray(result) ? result.length : result ? 1 : 0,
        });

        return result;
      } catch (error) {
        // 计算持续时间
        const duration = Date.now() - startTime;

        // 记录数据库操作错误
        this.logger.error(
          `数据库操作失败: ${model}.${action}`,
          error instanceof Error ? error.stack : undefined,
          {
            model,
            action,
            duration,
            errorMessage:
              error instanceof Error ? error.message : String(error),
          },
        );

        throw error;
      }
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
