import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class StatusDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  id: number | string;
}
