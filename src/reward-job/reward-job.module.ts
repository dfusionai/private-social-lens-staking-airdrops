import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { RewardJobsService } from './reward-job.service';
import { RewardJobsController } from './reward-job.controller';
import { RelationalRewardJobPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CheckpointsModule } from '../checkpoints/checkpoints.module';
import { Web3Service } from './web3.service';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    RelationalRewardJobPersistenceModule,
    CheckpointsModule,
    forwardRef(() => TransactionLogsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [RewardJobsController],
  providers: [RewardJobsService, Web3Service],
  exports: [RewardJobsService, RelationalRewardJobPersistenceModule],
})
export class RewardJobsModule {}
