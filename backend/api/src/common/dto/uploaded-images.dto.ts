import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UploadedImagesDto {
  @ApiProperty({
    required: true,
    example: ['/path/to/file.png'],
    description: 'Путь до тиульной фотографии',
  })
  @IsArray()
  @IsString({ each: true })
  titleImage?: string[];

  @ApiProperty({
    required: true,
    example: ['/path/to/file.png'],
    description: 'Пути до остальных фотографий',
  })
  @IsArray()
  @IsString({ each: true })
  additionalImages?: string[];
}
