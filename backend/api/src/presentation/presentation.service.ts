// presentation.service.ts
import { Injectable } from '@nestjs/common';
import { PythonMicroserviceService } from '../python-microservice/python-microservice.service';
import { DatatabaseQueryService } from 'src/database-queries/database-query.service';
import { GenerateDto } from './dto/generate-dto';

@Injectable()
export class PresentationService {
  constructor(
    private readonly databaseQueryService: DatatabaseQueryService,
    private readonly pythonMicroserviceService: PythonMicroserviceService,
  ) {}

  async generatePptx(
    file: Express.Multer.File,
    { extent, projectAreaIsochrone, polyclinicsIsochrone }: GenerateDto,
  ) {
    const polyclinics =
      await this.databaseQueryService.findPolyclinicsByPolyIntersection(
        extent,
        projectAreaIsochrone,
      );

    const populationData =
      await this.databaseQueryService.findPopulationSumByPoliesIntersections(
        projectAreaIsochrone,
        polyclinicsIsochrone,
      );

    const pptx = await this.pythonMicroserviceService.generatePptx(
      file,
      polyclinics,
      populationData,
    );
    return pptx;
  }
}
