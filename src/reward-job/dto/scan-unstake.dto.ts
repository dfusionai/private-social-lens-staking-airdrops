import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ScanUnstakeDto {
  @ApiProperty()
  @IsNumber()
  startBlock: number;

  @ApiProperty()
  @IsNumber()
  endBlock: number;
}
