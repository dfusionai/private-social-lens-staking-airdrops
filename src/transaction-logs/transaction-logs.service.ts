import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';
import { TransactionLogRepository } from './infrastructure/persistence/transaction-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TransactionLog } from './domain/transaction-log';
import { RewardJobsService } from '../reward-job/reward-job.service';

@Injectable()
export class TransactionLogsService {
  constructor(
    private readonly transactionLogRepository: TransactionLogRepository,
    @Inject(forwardRef(() => RewardJobsService))
    private readonly rewardJobsService: RewardJobsService,
  ) {}

  async create(createTransactionLogDto: CreateTransactionLogDto) {
    const job = await this.rewardJobsService.findById(
      createTransactionLogDto.job.id,
    );

    if (!job) {
      throw new NotFoundException('Reward job not found');
    }

    return this.transactionLogRepository.create({
      ...createTransactionLogDto,
      job,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionLogRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findById(id: TransactionLog['id']) {
    const transactionLog = await this.transactionLogRepository.findById(id);
    if (!transactionLog) {
      throw new NotFoundException('Transaction log not found');
    }
    return transactionLog;
  }

  findByIds(ids: TransactionLog['id'][]) {
    return this.transactionLogRepository.findByIds(ids);
  }

  async update(
    id: TransactionLog['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTransactionLogDto: UpdateTransactionLogDto,
  ) {
    return this.transactionLogRepository.update(id, updateTransactionLogDto);
  }

  remove(id: TransactionLog['id']) {
    return this.transactionLogRepository.remove(id);
  }
}
