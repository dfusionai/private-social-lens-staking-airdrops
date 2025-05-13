import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateRewardJobDto {
  @ApiProperty()
  @IsNumber()
  checkpointId: number;

  @ApiProperty()
  @IsNumber()
  stakeIndex: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  startTime: number;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsBoolean()
  hasWithdrawn: boolean;

  @ApiProperty()
  @IsNumber()
  withdrawalTime: number;
}
