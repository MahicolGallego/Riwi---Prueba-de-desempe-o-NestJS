import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/library/api/v1/docs', app, document);
}
bootstrap();
