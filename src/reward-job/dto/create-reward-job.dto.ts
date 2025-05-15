import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RewardJobStatus } from '../../utils/types/reward-job.type';
import { CheckpointDto } from '../../checkpoints/dto/checkpoint.dto';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
export class CreateRewardJobDto {
  @ApiProperty()
  @Type(() => CheckpointDto)
  checkpoint: CheckpointDto;

  @ApiProperty()
  @IsString()
  recipientAddress: string;

  @ApiProperty()
  @Type(() => UserDto)
  @IsOptional()
  updatedBy?: UserDto | null;

  @ApiProperty()
  @IsNumber()
  stakeIndex: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNumber()
  rewardPercentage: number;

  @ApiProperty()
  @IsNumber()
  rewardAmount: number;

  @ApiProperty()
  @IsString()
  status: RewardJobStatus;
}
