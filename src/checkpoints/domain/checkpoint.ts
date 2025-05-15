import { ApiProperty } from '@nestjs/swagger';

export class Checkpoint {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Number,
    example: 12345,
    description: 'The block number',
  })
  blockNumber: number;

  @ApiProperty({
    type: Number,
    example: 1678901234,
    description: 'Unix timestamp of the block',
  })
  blockTimestamp: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
