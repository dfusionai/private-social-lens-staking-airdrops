import {
  // common
  Module,
} from '@nestjs/common';
import { RewardJobsService } from './reward-job.service';
import { RewardJobsController } from './reward-job.controller';
import { RelationalRewardJobPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CheckpointsModule } from '../checkpoints/checkpoints.module';

@Module({
  imports: [RelationalRewardJobPersistenceModule, CheckpointsModule],
  controllers: [RewardJobsController],
  providers: [RewardJobsService],
  exports: [RewardJobsService, RelationalRewardJobPersistenceModule],
})
export class RewardJobsModule {}
