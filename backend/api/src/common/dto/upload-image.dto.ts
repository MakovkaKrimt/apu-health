import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    description: 'Титульное фото',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  titleImage: Express.Multer.File[];
}

export class UploadImagesDto extends UploadImageDto {
  @ApiProperty({
    description: 'Остальные фото',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsNotEmpty()
  additionalImages: Express.Multer.File[];
}
