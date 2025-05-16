import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RewardJobEntity } from '../entities/reward-job.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { RewardJob } from '../../../../domain/reward-job';
import { RewardJobMapper } from '../mappers/reward-job.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { RewardJobRepository } from '../../reward-job.repository';

@Injectable()
export class RewardJobRelationalRepository implements RewardJobRepository {
  constructor(
    @InjectRepository(RewardJobEntity)
    private readonly userUnstakeRepository: Repository<RewardJobEntity>,
  ) {}

  async create(data: RewardJob): Promise<RewardJob> {
    const persistenceModel = RewardJobMapper.toPersistence(data);
    const newEntity = await this.userUnstakeRepository.save(
      this.userUnstakeRepository.create(persistenceModel),
    );
    return RewardJobMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RewardJob[]> {
    const entities = await this.userUnstakeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => RewardJobMapper.toDomain(entity));
  }

  async findById(id: RewardJob['id']): Promise<NullableType<RewardJob>> {
    const entity = await this.userUnstakeRepository.findOne({
      where: { id },
    });

    return entity ? RewardJobMapper.toDomain(entity) : null;
  }

  async findByIds(ids: RewardJob['id'][]): Promise<RewardJob[]> {
    const entities = await this.userUnstakeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => RewardJobMapper.toDomain(entity));
  }

  async update(
    id: RewardJob['id'],
    payload: Partial<RewardJob>,
  ): Promise<RewardJob> {
    const entity = await this.userUnstakeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.userUnstakeRepository.save(
      this.userUnstakeRepository.create(
        RewardJobMapper.toPersistence({
          ...RewardJobMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RewardJobMapper.toDomain(updatedEntity);
  }

  async remove(id: RewardJob['id']): Promise<void> {
    await this.userUnstakeRepository.delete(id);
  }
}
