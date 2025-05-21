import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from '@common/utils/swagger.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
  });

  setupSwagger(app, {
    title: 'APU API',
    description: 'API сервисов',
    version: '1.0',
    path: 'docs',
  });
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server starts on port ${process.env.PORT}`);
}
bootstrap();
