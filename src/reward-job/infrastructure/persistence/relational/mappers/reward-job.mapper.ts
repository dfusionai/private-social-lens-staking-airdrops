import { CheckpointMapper } from 'src/checkpoints/infrastructure/persistence/relational/mappers/checkpoint.mapper';
import { RewardJobStatus } from 'src/utils/types/reward-job.type';
import { RewardJob } from 'src/reward-job/domain/reward-job';
import { RewardJobEntity } from '../entities/reward-job.entity';
import { UserMapper } from 'src/users/infrastructure/persistence/relational/mappers/user.mapper';
export class RewardJobMapper {
  static toDomain(raw: RewardJobEntity): RewardJob {
    const domainEntity = new RewardJob();
    domainEntity.id = raw.id;
    domainEntity.recipientAddress = raw.recipientAddress;
    if (raw.checkpoint) {
      domainEntity.checkpoint = CheckpointMapper.toDomain(raw.checkpoint);
    }
    if (raw.updatedBy) {
      domainEntity.updatedBy = UserMapper.toDomain(raw.updatedBy);
    }
    domainEntity.stakeIndex = raw.stakeIndex;
    domainEntity.amount = raw.amount;
    domainEntity.duration = raw.duration;
    domainEntity.rewardPercentage = raw.rewardPercentage;
    domainEntity.rewardAmount = raw.rewardAmount;
    domainEntity.status = raw.status as RewardJobStatus;

    return domainEntity;
  }

  static toPersistence(domainEntity: RewardJob): RewardJobEntity {
    const persistenceEntity = new RewardJobEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.recipientAddress = domainEntity.recipientAddress;
    if (domainEntity.checkpoint) {
      persistenceEntity.checkpoint = CheckpointMapper.toPersistence(
        domainEntity.checkpoint,
      );
    }
    if (domainEntity.updatedBy) {
      persistenceEntity.updatedBy = UserMapper.toPersistence(
        domainEntity.updatedBy,
      );
    }
    persistenceEntity.stakeIndex = domainEntity.stakeIndex;
    persistenceEntity.amount = domainEntity.amount;
    persistenceEntity.duration = domainEntity.duration;
    persistenceEntity.rewardPercentage = domainEntity.rewardPercentage;
    persistenceEntity.rewardAmount = domainEntity.rewardAmount;
    persistenceEntity.status = domainEntity.status;

    return persistenceEntity;
  }
}
