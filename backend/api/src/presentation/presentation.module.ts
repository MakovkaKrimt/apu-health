import { Module, ValidationPipe } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { DatabaseQueryModule } from 'src/database-queries/database-query.module';
import { PythonMicroserviceModule } from 'src/python-microservice/python-microservice.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [DatabaseQueryModule, PythonMicroserviceModule],
  controllers: [PresentationController],
  providers: [
    PresentationService,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    //     transform: true,
    //     transformOptions: {
    //       enableImplicitConversion: true,
    //     },
    //   }),
    // },
  ],
})
export class PresentationModule {}
