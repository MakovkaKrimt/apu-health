// presentation.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  StreamableFile,
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
  constructor(private readonly presentationService: PresentationService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('image'))
  async generatePptx(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: GenerateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pptxStream = await this.presentationService.generatePptx(image, dto);

    return pptxStream;

    // res.set({
    //   'Content-Type':
    //     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    //   'Content-Disposition': `attachment; filename="result.pptx"`,
    // });

    // return new StreamableFile(pptxStream);
  }
}
