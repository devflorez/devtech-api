import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://develop.d3vjxvzp7bzyml.amplifyapp.com',
      'devtech-front-two.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const config = new DocumentBuilder()
    .setTitle('DevTech API')
    .setDescription('API para la tienda de tecnología DevTech')
    .setVersion('1.0')
    .addTag('products', 'Operaciones relacionadas con productos')
    .addTag('transactions', 'Operaciones relacionadas con transacciones')
    .addTag('payments', 'Operaciones relacionadas con pagos')
    .addTag('webhooks', 'Operaciones relacionadas con webhooks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
