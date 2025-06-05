import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

//create approve reward response dto
export class ApproveRewardResDto {
  @ApiProperty()
  @IsNumber()
  vanaFee: number;

  @ApiProperty()
  @IsNumber()
  rewardSent: number;

  @ApiProperty()
  @IsString()
  txHash: string;

  @ApiProperty()
  @IsString()
  recipientAddress: string;
}
