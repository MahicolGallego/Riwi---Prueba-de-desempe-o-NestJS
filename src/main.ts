import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // use pipe for data validation of request and data transform
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //enable serializacion to active class-transformer funtionality(data control for response)
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  //enable cors to resolve conflicts with Cross-Origin
  app.enableCors();

  //Swagger for documentation of API
  const config = new DocumentBuilder()
    .setTitle('eSports Arena')
    .setDescription('')
    .setVersion('1.0')
    // add API key as authentication method
    .addApiKey({
      name: 'x-api-key',
      type: 'apiKey',
      in: 'header',
    })
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/library/api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
