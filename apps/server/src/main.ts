import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new LoggerService('NestApplication');
  app.useLogger(logger);

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.enableCors();

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);

  try {
    const appUrl = await app.getUrl();
    logger.log(`Application listen port is: ${port}`);
    logger.log(`Application server address: ${appUrl}`);
  } catch (error) {
    logger.error('Failed to get application URL:', JSON.stringify(error));
  }
}

void bootstrap();
