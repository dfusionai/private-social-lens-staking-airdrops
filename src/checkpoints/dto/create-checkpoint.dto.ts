import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateCheckpointDto {
  @ApiProperty({
    type: Number,
    example: 12345,
    description: 'The block number',
  })
  @IsNumber()
  blockNumber: number;

  @ApiProperty({
    type: Number,
    example: 1678901234,
    description: 'Unix timestamp of the block',
  })
  @IsNumber()
  timestamp: number;

  @ApiProperty({
    type: Date,
    example: '2024-03-15T10:30:00Z',
    description: 'When the checkpoint was processed',
    required: false,
  })
  @IsDate()
  @IsOptional()
  processedAt?: Date;
}
