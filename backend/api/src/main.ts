import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server starts on port ${process.env.PORT}`);
}
bootstrap();
