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
  timestamp: number;

  @ApiProperty({
    type: Date,
    example: '2024-03-15T10:30:00Z',
    description: 'When the checkpoint was processed',
  })
  processedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
