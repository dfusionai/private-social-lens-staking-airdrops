import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CheckpointDto } from '../../checkpoints/dto/checkpoint.dto';
import { Type } from 'class-transformer';
import { TransactionLogAction } from '../../utils/types/transaction-log.type';

export class CreateTransactionLogDto {
  @ApiProperty({
    example: 'Transaction failed due to insufficient funds',
    description: 'Reason for rejection if the transaction was not successful',
    required: false,
  })
  @IsString()
  @IsOptional()
  actionMessage?: string;

  @ApiProperty({
    example: TransactionLogAction.APPROVE,
    description: 'The action of the transaction',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  action: TransactionLogAction;

  @ApiProperty({
    description: 'The ID of the related job (e.g., RewardJob ID)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Type(() => CheckpointDto)
  @IsNotEmpty()
  job: CheckpointDto;
}
