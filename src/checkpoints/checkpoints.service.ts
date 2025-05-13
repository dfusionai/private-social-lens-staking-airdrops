import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { CheckpointRepository } from './infrastructure/persistence/checkpoint.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Checkpoint } from './domain/checkpoint';

@Injectable()
export class CheckpointsService {
  constructor(
    // Dependencies here
    private readonly checkpointRepository: CheckpointRepository,
  ) {}

  async create(createCheckpointDto: CreateCheckpointDto) {
    return this.checkpointRepository.create({
      blockNumber: createCheckpointDto.blockNumber,
      timestamp: createCheckpointDto.timestamp,
      processedAt: createCheckpointDto.processedAt || new Date(),
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.checkpointRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Checkpoint['id']) {
    return this.checkpointRepository.findById(id);
  }

  findByIds(ids: Checkpoint['id'][]) {
    return this.checkpointRepository.findByIds(ids);
  }

  async update(id: Checkpoint['id'], updateCheckpointDto: UpdateCheckpointDto) {
    return this.checkpointRepository.update(id, {
      blockNumber: updateCheckpointDto.blockNumber,
      timestamp: updateCheckpointDto.timestamp,
      processedAt: updateCheckpointDto.processedAt,
    });
  }

  remove(id: Checkpoint['id']) {
    return this.checkpointRepository.remove(id);
  }

  async getLatestCheckpoint(): Promise<Checkpoint | null> {
    return this.checkpointRepository.findLatest();
  }
}
