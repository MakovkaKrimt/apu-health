import { ApiProperty } from '@nestjs/swagger';

export class ShortResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор',
  })
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
