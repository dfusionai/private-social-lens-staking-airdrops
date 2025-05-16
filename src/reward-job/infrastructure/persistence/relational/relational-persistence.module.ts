import { Module } from '@nestjs/common';
import { RewardJobRepository } from '../reward-job.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardJobEntity } from './entities/reward-job.entity';
import { RewardJobRelationalRepository } from './repositories/user-unstake.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RewardJobEntity])],
  providers: [
    {
      provide: RewardJobRepository,
      useClass: RewardJobRelationalRepository,
    },
  ],
  exports: [RewardJobRepository],
})
export class RelationalRewardJobPersistenceModule {}
