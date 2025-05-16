import { Injectable } from '@nestjs/common';
import { CheckpointEntity } from '../entities/checkpoint.entity';
import { Checkpoint } from '../../../../domain/checkpoint';

@Injectable()
export class CheckpointMapper {
  static toDomain(entity: CheckpointEntity): Checkpoint {
    const domain = new Checkpoint();
    domain.id = entity.id;
    domain.blockNumber = entity.blockNumber;
    domain.blockTimestamp = entity.blockTimestamp;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    return domain;
  }

  static toPersistence(domain: Checkpoint): CheckpointEntity {
    const entity = new CheckpointEntity();
    entity.id = domain.id;
    entity.blockNumber = domain.blockNumber;
    entity.blockTimestamp = domain.blockTimestamp;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
