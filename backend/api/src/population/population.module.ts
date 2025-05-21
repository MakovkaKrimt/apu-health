import { Module } from '@nestjs/common';
import { PopulationService } from './population.service';
import { PopulationController } from './population.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Population } from './enities/population.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Population])],
  controllers: [PopulationController],
  providers: [PopulationService],
  exports: [PopulationService],
})
export class PopulationModule {}
