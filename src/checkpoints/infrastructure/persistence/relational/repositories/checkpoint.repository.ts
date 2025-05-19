import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CheckpointEntity } from '../entities/checkpoint.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Checkpoint } from '../../../../domain/checkpoint';
import { CheckpointRepository } from '../../checkpoint.repository';
import { CheckpointMapper } from '../mappers/checkpoint.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DataSource } from 'typeorm';

@Injectable()
export class CheckpointRelationalRepository implements CheckpointRepository {
  constructor(
    @InjectRepository(CheckpointEntity)
    private readonly checkpointRepository: Repository<CheckpointEntity>,
    protected readonly dataSource: DataSource,
    protected readonly mapper: CheckpointMapper,
  ) {}

  async create(data: Checkpoint): Promise<Checkpoint> {
    const persistenceModel = CheckpointMapper.toPersistence(data);
    const newEntity = await this.checkpointRepository.save(
      this.checkpointRepository.create(persistenceModel),
    );
    return CheckpointMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Checkpoint[]> {
    const entities = await this.checkpointRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CheckpointMapper.toDomain(entity));
  }

  async findById(id: Checkpoint['id']): Promise<NullableType<Checkpoint>> {
    const entity = await this.checkpointRepository.findOne({
      where: { id },
    });

    return entity ? CheckpointMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Checkpoint['id'][]): Promise<Checkpoint[]> {
    const entities = await this.checkpointRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CheckpointMapper.toDomain(entity));
  }

  async update(
    id: Checkpoint['id'],
    payload: Partial<Checkpoint>,
  ): Promise<Checkpoint> {
    const entity = await this.checkpointRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.checkpointRepository.save(
      this.checkpointRepository.create(
        CheckpointMapper.toPersistence({
          ...CheckpointMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CheckpointMapper.toDomain(updatedEntity);
  }

  async remove(id: Checkpoint['id']): Promise<void> {
    await this.checkpointRepository.delete(id);
  }

  async findLatest(): Promise<Checkpoint | null> {
    const latestCheckpoint = await this.checkpointRepository.findOne({
      where: {},
      order: {
        blockNumber: 'DESC',
      },
    });

    return latestCheckpoint
      ? CheckpointMapper.toDomain(latestCheckpoint)
      : null;
  }
}
