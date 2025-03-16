// src/python-microservice/python-microservice.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PythonMicroserviceService } from './python-microservice.service';

@Module({
  imports: [HttpModule],
  providers: [PythonMicroserviceService],
  exports: [PythonMicroserviceService],
})
export class PythonMicroserviceModule {}
