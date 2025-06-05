import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

//create scan unstake dto
export class ScanUnstakeResDto {
  @ApiProperty()
  @IsNumber()
  newUnstakeCount: number;

  @ApiProperty()
  @IsNumber()
  newRewardJobCount: number;
}
