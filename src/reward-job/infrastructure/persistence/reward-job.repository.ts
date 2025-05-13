import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { RewardJob } from '../../domain/reward-job';

export abstract class RewardJobRepository {
  abstract create(
    data: Omit<RewardJob, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RewardJob>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RewardJob[]>;

  abstract findById(id: RewardJob['id']): Promise<NullableType<RewardJob>>;

  abstract findByIds(ids: RewardJob['id'][]): Promise<RewardJob[]>;

  abstract update(
    id: RewardJob['id'],
    payload: DeepPartial<RewardJob>,
  ): Promise<RewardJob | null>;

  abstract remove(id: RewardJob['id']): Promise<void>;
}
