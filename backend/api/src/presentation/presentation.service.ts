import { Injectable } from '@nestjs/common';
import { PythonMicroserviceService } from '../python-microservice/python-microservice.service';
import { DatatabaseQueryService } from 'src/database-queries/database-query.service';
import { GeneratePresentationDto } from './dto/generate.dto';

@Injectable()
export class PresentationService {
  constructor(
    private readonly databaseQueryService: DatatabaseQueryService,
    private readonly pythonMicroserviceService: PythonMicroserviceService,
  ) {}

  async generatePptx(
    file: Express.Multer.File,
    {
      extent,
      projectSite,
      projectSiteData,
      analysisData,
    }: GeneratePresentationDto,
  ) {
    const parsedProjectSiteData = JSON.parse(projectSiteData);

    const projectSitePoint =
      await this.databaseQueryService.transformProjectSiteToPPTXScale(
        extent,
        projectSite,
      );

    // console.log(projectSitePoint);

    const resultProjectSiteData = {
      ...parsedProjectSiteData,
      ...projectSitePoint[0],
    };

    const policlinicPoints =
      await this.databaseQueryService.findPoliclinicsByExtentIntersection(
        extent,
      );

    return await this.pythonMicroserviceService.generatePptx(
      file,
      resultProjectSiteData,
      policlinicPoints,
      analysisData,
    );
  }
}
