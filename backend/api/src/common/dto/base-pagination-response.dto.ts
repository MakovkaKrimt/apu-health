import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationResponseDto<T> {
  @ApiProperty({
    example: 12,
    description: 'Общее количество записей',
  })
  total: number;

  data: T[];
}
