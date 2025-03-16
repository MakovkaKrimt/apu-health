import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { DatabaseQueryModule } from 'src/database-queries/database-query.module';
import { PythonMicroserviceModule } from 'src/python-microservice/python-microservice.module';

@Module({
  imports: [DatabaseQueryModule, PythonMicroserviceModule],
  controllers: [PresentationController],
  providers: [PresentationService],
})
export class PresentationModule {}
