import { ApiProperty } from '@nestjs/swagger';
import { RewardJob } from '../../reward-job/domain/reward-job';
import { TransactionLogAction } from '../../utils/types/transaction-log.type';

export class TransactionLog {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  actionMessage?: string;

  @ApiProperty({
    type: String,
  })
  action: TransactionLogAction;

  @ApiProperty({
    type: () => RewardJob,
  })
  job: RewardJob;

  @ApiProperty({
    type: String,
  })
  createdAt: Date;
}
