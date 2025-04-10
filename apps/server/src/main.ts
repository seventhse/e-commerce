import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'node:fs/promises';

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

  logger.debug(
    `Current app env is: ${JSON.stringify(process.env.NODE_ENV, null, 2)}`,
    'Bootstrap',
  );

  if (process.env.NODE_ENV === 'development') {
    // Setup Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription('API documentation for the e-commerce management system')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    await writeFile('./swagger.json', JSON.stringify(document, null, 2));
    SwaggerModule.setup('/api/docs', app, document);
  }

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
