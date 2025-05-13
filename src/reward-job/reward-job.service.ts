import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateRewardJobDto } from './dto/create-reward-job.dto';
import { UpdateRewardJobDto } from './dto/update-reward-job.dto';
import { RewardJobRepository } from './infrastructure/persistence/reward-job.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { RewardJob } from './domain/reward-job';
import { ethers } from 'ethers';
import stakingABI from '../assets/contracts/StakingImplemenation.json';
import { CheckpointsService } from '../checkpoints/checkpoints.service';
@Injectable()
export class RewardJobsService {
  private provider: ethers.JsonRpcProvider;
  private stakingContract: ethers.Contract;
  private initialBlockNumber: number;
  private currentBlockNumber: number;
  private unstakeEvents: any[] = [];
  private formattedUnstakeEvents: any[] = [];
  private continueScanning = true;

  constructor(
    // Dependencies here
    private readonly rewardJobRepository: RewardJobRepository,
    private readonly checkpointsService: CheckpointsService,
  ) {
    this.provider = new ethers.JsonRpcProvider('https://rpc.moksha.vana.org');
    this.stakingContract = new ethers.Contract(
      '0x9B9bD709844a3Fa34EfFAd67a7cB91d881ca4fA0',
      stakingABI.abi,
      this.provider,
    );
    this.initialBlockNumber = 2650000;
    this.currentBlockNumber = 0;
  }

  async create(createRewardJobDto: CreateRewardJobDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.rewardJobRepository.create(createRewardJobDto);
  }

  async scanUnstakes(fromBlock: number, toBlock: number) {
    const stakeEvents = await this.stakingContract.queryFilter(
      this.stakingContract.filters.TokensUnstaked(),
      fromBlock,
      toBlock,
    );

    const formattedEvents = stakeEvents.map((event: ethers.EventLog) => ({
      user: event.args[0],
      amount: event.args[1].toString(),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    }));

    return formattedEvents;
  }

  async getStakeIndex(transactionHash: string) {
    const tx = await this.provider.getTransaction(transactionHash);
    const iface = new ethers.Interface(stakingABI.abi); // Use the provided ABI
    const decodedInput = iface.parseTransaction({ data: tx?.data || '' });
    const stakeIndex = decodedInput?.args[0]; // Extract stakeI
    return stakeIndex;
  }

  async saveCheckpoint() {
    const newestUnstake = this.unstakeEvents[this.unstakeEvents.length - 1];
    const newestUnstakeBlockNumber = newestUnstake?.blockNumber;
    const block = await this.provider.getBlock(newestUnstakeBlockNumber);
    const newestBlockTimestamp = block?.timestamp;
    const newCheckpoint = {
      blockNumber: newestUnstakeBlockNumber as number,
      timestamp: newestBlockTimestamp || 0,
      processedAt: new Date(),
    };
    await this.checkpointsService.create(newCheckpoint);
  }

  async formatUnstakeEvents() {
    const promiseResult = await Promise.all(
      this.unstakeEvents.map(async (event) => {
        const stakeIndex = await this.getStakeIndex(event.transactionHash);
        return this.stakingContract.getStake(event.user, Number(stakeIndex));
      }),
    );

    const formattedUnstakeEvents = promiseResult.map((stake, index) => {
      return {
        walletAddress: this.unstakeEvents[index].user,
        amount: Number(stake[0]),
        startTime: Number(stake[1]),
        duration: Number(stake[2]),
        hasWithdrawn: stake[3],
        withdrawalTime: Number(stake[4]),
      };
    });

    this.formattedUnstakeEvents = formattedUnstakeEvents;
  }

  async scanUnstakeEventsHandler() {
    const checkpoint = await this.checkpointsService.findAllWithPagination({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
    });
    // const rewardJobs = await this.rewardJobRepository.finON({
    //   paginationOptions: {
    //     page: 1,
    //     limit: 10,
    //   },
    // });
    const latestCheckpoint = checkpoint[checkpoint.length - 1];
    const newestCheckpointBlockNumber = latestCheckpoint?.blockNumber;
    let fromBlock = newestCheckpointBlockNumber
      ? newestCheckpointBlockNumber + 1
      : this.initialBlockNumber;
    const blockNumber = await this.provider.getBlockNumber();

    while (this.continueScanning) {
      console.log('🚀 ~ RewardJobsService ~ fromBlock:', fromBlock);
      const unstakeEvents = await this.scanUnstakes(
        fromBlock,
        fromBlock + 10000,
      );
      this.unstakeEvents.push(...unstakeEvents);
      fromBlock += 10000;

      if (fromBlock >= blockNumber) {
        this.continueScanning = false;
      }
    }

    if (this.unstakeEvents.length > 0) {
      await this.saveCheckpoint();
      await this.formatUnstakeEvents();
    }

    return {
      unStakeCount: this.formattedUnstakeEvents.length,
      allUnstakeEvents: this.formattedUnstakeEvents,
    };
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    console.log(
      '🚀 ~ RewardJobsService ~ paginationOptions:',
      paginationOptions,
    );
    const checkpoint = await this.checkpointsService.findAllWithPagination({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
    });
    const latestCheckpoint = checkpoint[checkpoint.length - 1];
    const newestCheckpointBlockNumber = latestCheckpoint?.blockNumber;
    let fromBlock = newestCheckpointBlockNumber
      ? newestCheckpointBlockNumber
      : this.initialBlockNumber;
    const blockNumber = await this.provider.getBlockNumber();

    while (this.continueScanning) {
      const unstakeEvents = await this.scanUnstakes(
        fromBlock,
        fromBlock + 10000,
      );
      this.unstakeEvents.push(...unstakeEvents);
      const newestUnstake = unstakeEvents[unstakeEvents.length - 1];
      const newestUnstakeBlockNumber = newestUnstake?.blockNumber;
      this.currentBlockNumber = newestUnstakeBlockNumber;
      fromBlock += 10000;
      console.log('🚀 ~ RewardJobsService ~ fromBlock:', fromBlock);
      console.log('🚀 ~ RewardJobsService ~ blockNumber:', blockNumber);

      if (fromBlock >= blockNumber) {
        this.continueScanning = false;
      }
    }

    const promiseResult = await Promise.all(
      this.unstakeEvents.map(async (event) => {
        const stakeIndex = await this.getStakeIndex(event.transactionHash);
        return this.stakingContract.getStake(event.user, Number(stakeIndex));
      }),
    );

    const allUnstakeStakes = promiseResult.map((stake, index) => {
      return {
        walletAddress: this.unstakeEvents[index].user,
        amount: Number(stake[0]),
        startTime: Number(stake[1]),
        duration: Number(stake[2]),
        hasWithdrawn: stake[3],
        withdrawalTime: Number(stake[4]),
      };
    });

    // 2710204
    return {
      blockNumber,
      stakeEvents: allUnstakeStakes,
      currentBlockNumber: this.currentBlockNumber,
    };
  }

  findById(id: RewardJob['id']) {
    return this.rewardJobRepository.findById(id);
  }

  findByIds(ids: RewardJob['id'][]) {
    return this.rewardJobRepository.findByIds(ids);
  }

  async update(
    id: RewardJob['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateRewardJobDto: UpdateRewardJobDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.rewardJobRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: RewardJob['id']) {
    return this.rewardJobRepository.remove(id);
  }
}
