import { RewardJob } from '../../../../domain/reward-job';
import { RewardJobEntity } from '../entities/reward-job.entity';

export class RewardJobMapper {
  static toDomain(raw: RewardJobEntity): RewardJob {
    const domainEntity = new RewardJob();
    domainEntity.id = raw.id;
    domainEntity.checkpointId = raw.checkpointId;
    domainEntity.stakeIndex = raw.stakeIndex;
    domainEntity.amount = raw.amount;
    domainEntity.startTime = raw.startTime;
    domainEntity.duration = raw.duration;
    domainEntity.hasWithdrawn = raw.hasWithdrawn;
    domainEntity.withdrawalTime = raw.withdrawalTime;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: RewardJob): RewardJobEntity {
    const persistenceEntity = new RewardJobEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.checkpointId = domainEntity.checkpointId;
    persistenceEntity.stakeIndex = domainEntity.stakeIndex;
    persistenceEntity.amount = domainEntity.amount;
    persistenceEntity.startTime = domainEntity.startTime;
    persistenceEntity.duration = domainEntity.duration;
    persistenceEntity.hasWithdrawn = domainEntity.hasWithdrawn;
    persistenceEntity.withdrawalTime = domainEntity.withdrawalTime;
    persistenceEntity.createdAt = domainEntity.createdAt;

    return persistenceEntity;
  }
}
