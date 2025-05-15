import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

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
  blockTimestamp: number;
}
