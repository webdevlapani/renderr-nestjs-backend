import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('Renderr API ')
    .setDescription('Renderr API description')
    .setVersion('1.0')
    .addServer('http://localhost:8080/apiV1/', 'Local environment')
    .addServer(
      'https://9ada-2405-201-2009-cb4e-4dbc-7c0f-3430-eb3a.ngrok-free.app/apiV1/',
      'Staging',
    )
    .addServer('https://production.api.com/', 'Production')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.setGlobalPrefix('apiV1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 8080);
  console.log(`Backend Start On : http://localhost:${process.env.PORT || 8080}/api-docs`);
}
bootstrap();
