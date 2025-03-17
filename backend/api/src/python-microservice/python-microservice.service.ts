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
    polyclinics: any[],
    populationData: any[],
    projectArea?: string,
  ) {
    const formData = new FormData();
    formData.append('image', new Blob([file.buffer]), file.originalname);
    formData.append('polyclinics', JSON.stringify(polyclinics));
    formData.append('populationData', JSON.stringify(populationData));
    if (projectArea) {
      formData.append('projectArea', JSON.stringify(projectArea));
    }

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
