import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class BasePaginationQueryDto {
  @ApiProperty({
    required: false,
    example: 0,
    description: 'Количество записей, которое необходимо пропустить',
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Offset must be a non-negative integer' })
  offset?: number;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Количество записей для возврата',
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Limit must be a non-negative integer' })
  limit?: number;
}
