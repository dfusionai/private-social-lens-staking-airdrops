import { ApiProperty } from '@nestjs/swagger';

export class RewardJob {
  @ApiProperty({
    type: String,
    example: '1',
  })
  id: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  checkpointId: number;

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
  startTime: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  duration: number;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  hasWithdrawn: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  withdrawalTime: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
