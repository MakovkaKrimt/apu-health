import { Module } from '@nestjs/common';
import { VPoliclinic } from './entitties/v_polycinic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatatabaseQueryService } from './database-query.service';
import { Population } from './entitties/population.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VPoliclinic, Population])],
  providers: [DatatabaseQueryService],
  exports: [DatatabaseQueryService],
})
export class DatabaseQueryModule {}
