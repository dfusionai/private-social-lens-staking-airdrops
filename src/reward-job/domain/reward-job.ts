import { ApiProperty } from '@nestjs/swagger';
import { RewardJobStatus } from '../../utils/types/reward-job.type';
import { Checkpoint } from '../../checkpoints/domain/checkpoint';
import { User } from '../../users/domain/user';
export class RewardJob {
  @ApiProperty({
    type: String,
    example: '1',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '0x1234567890123456789012345678901234567890',
  })
  recipientAddress: string;

  @ApiProperty({
    type: () => User,
  })
  updatedBy: User | null;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  rewardPercentage: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  rewardAmount: number;

  @ApiProperty({
    type: String,
    example: RewardJobStatus.PENDING,
  })
  status: RewardJobStatus;

  @ApiProperty({
    type: () => Checkpoint,
  })
  checkpoint: Checkpoint;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  stakeIndex: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  amount: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  duration: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
