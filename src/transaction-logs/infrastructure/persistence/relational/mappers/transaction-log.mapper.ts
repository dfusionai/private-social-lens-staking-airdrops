import { RewardJobMapper } from '../../../../../reward-job/infrastructure/persistence/relational/mappers/reward-job.mapper';
import { TransactionLog } from '../../../../domain/transaction-log';
import { TransactionLogEntity } from '../entities/transaction-log.entity';

export class TransactionLogMapper {
  static toDomain(raw: TransactionLogEntity): TransactionLog {
    const domainEntity = new TransactionLog();
    if (raw.job) {
      domainEntity.job = RewardJobMapper.toDomain(raw.job);
    }
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.action = raw.action;
    domainEntity.actionMessage = raw.actionMessage;

    return domainEntity;
  }

  static toPersistence(domainEntity: TransactionLog): TransactionLogEntity {
    const persistenceEntity = new TransactionLogEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.job) {
      persistenceEntity.job = RewardJobMapper.toPersistence(domainEntity.job);
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.action = domainEntity.action;
    persistenceEntity.actionMessage = domainEntity.actionMessage;

    return persistenceEntity;
  }
}
