// presentation.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PresentationService } from './presentation.service';
import { Response } from 'express';
import { GenerateDto } from './dto/generate-dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Генерация PPTX')
@Controller('presentation')
export class PresentationController {
  private readonly logger = new Logger(PresentationController.name);

  constructor(private readonly presentationService: PresentationService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('image'))
  async generatePptx(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: GenerateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pptxStream = await this.presentationService.generatePptx(image, dto);

    this.logger.log(
      `PPTX file successfully generated at ${new Date().toISOString()}`,
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="result.pptx"`,
    });

    return new StreamableFile(pptxStream);
  }
}
