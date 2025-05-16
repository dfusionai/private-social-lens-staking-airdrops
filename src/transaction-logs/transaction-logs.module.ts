import { Module, forwardRef } from '@nestjs/common';
import { TransactionLogsService } from './transaction-logs.service';
import { TransactionLogsController } from './transaction-logs.controller';
import { RelationalTransactionLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RewardJobsModule } from '../reward-job/reward-job.module';

@Module({
  imports: [
    RelationalTransactionLogPersistenceModule,
    forwardRef(() => RewardJobsModule),
  ],
  controllers: [TransactionLogsController],
  providers: [TransactionLogsService],
  exports: [TransactionLogsService, RelationalTransactionLogPersistenceModule],
})
export class TransactionLogsModule {}
