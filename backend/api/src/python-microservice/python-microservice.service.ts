// src/python-microservice/python-microservice.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const pythonServiceHost =
  process.env.NODE_ENV === 'production' ? process.env.PY_SERVICE : 'localhost';

@Injectable()
export class PythonMicroserviceService {
  constructor(private readonly httpService: HttpService) {}

  async generatePptx(
    file: Express.Multer.File,
    projectSiteData: any,
    policlinicPoints: any,
    analysisData: any,
  ) {
    const formData = new FormData();
    formData.append('image', new Blob([file.buffer]), file.originalname);
    formData.append('projectSite', JSON.stringify(projectSiteData));
    formData.append('policlinics', JSON.stringify(policlinicPoints));
    formData.append('analysisData', analysisData);

    const response = await firstValueFrom(
      this.httpService.post(
        `http://${pythonServiceHost}:8000/generate-pptx`,
        formData,
        {
          responseType: 'stream',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ),
    );

    return response.data;
  }
}
