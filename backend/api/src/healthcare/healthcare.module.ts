import { Module } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';
import { Policlinic } from './entities/policlinic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiTags } from '@nestjs/swagger';
import { PopulationModule } from 'src/population/population.module';

@Module({
  imports: [TypeOrmModule.forFeature([Policlinic]), PopulationModule],
  controllers: [HealthcareController],
  providers: [HealthcareService],
  exports: [HealthcareService],
})
export class HealthcareModule {}
