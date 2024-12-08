import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({});

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('WhatsApp Status Blog API')
    .setDescription('The WhatsApp Status Blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('posts', 'Posts management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: '',
    customJsStr: '',
    customfavIcon:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/favicon-32x32.png',
    customSiteTitle: 'WhatsApp Status Blog API',
    swaggerUrl: '/api-json',
    customCssUrl: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css',
    ],
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-init.js',
    ],
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${process.env.BACKEND_URL}`);
}
bootstrap();
