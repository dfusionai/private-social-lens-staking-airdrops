import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRewardJobDto } from './dto/create-reward-job.dto';
import { UpdateRewardJobDto } from './dto/update-reward-job.dto';
import { RewardJobRepository } from './infrastructure/persistence/reward-job.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { RewardJob } from './domain/reward-job';
import { ethers } from 'ethers';
import stakingABI from '../assets/contracts/StakingImplemenation.json';
import { CheckpointsService } from '../checkpoints/checkpoints.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { IUnstakeStake, RewardJobStatus } from '../utils/types/reward-job.type';
import {
  dayInSeconds,
  oneSecondInMs,
  rewardsDuration,
} from '../utils/constants/common';
import Big from 'big.js';
import { Web3Service } from './web3.service';
import tokenABI from '../assets/contracts/TokenImplementation.json';
import { RejectRewardJobDto } from './dto/reject-reward-job.dto';
import { TransactionLogsService } from '../transaction-logs/transaction-logs.service';
import { TransactionLogAction } from '../utils/types/transaction-log.type';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { User } from '../users/domain/user';
@Injectable()
export class RewardJobsService {
  private provider: ethers.JsonRpcProvider;
  private stakingContract: ethers.Contract;
  private tokenContract: ethers.Contract;
  private signer: ethers.Wallet;
  private initialBlockNumber: number;
  private rewardPercentageObject: Record<string, number>;
  private maxScanRange = 10000;

  constructor(
    // Dependencies here
    private readonly rewardJobRepository: RewardJobRepository,
    private readonly checkpointsService: CheckpointsService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly web3Service: Web3Service,
    private readonly transactionLogsService: TransactionLogsService,
    private readonly userRepository: UserRepository,
  ) {
    this.provider = this.web3Service.getProvider();
    this.stakingContract = this.web3Service.getStakingContract();
    this.tokenContract = this.web3Service.getTokenContract();
    this.signer = this.web3Service.getSigner();
    this.initialBlockNumber = 2680000;
    this.rewardPercentageObject = {
      [rewardsDuration.week]: this.configService.getOrThrow(
        'rewardJob.duration7DaysRate',
        {
          infer: true,
        },
      ),
      [rewardsDuration.month]: this.configService.getOrThrow(
        'rewardJob.duration30DaysRate',
        {
          infer: true,
        },
      ),
      [rewardsDuration.twoMonths]: this.configService.getOrThrow(
        'rewardJob.duration60DaysRate',
        {
          infer: true,
        },
      ),
      [rewardsDuration.threeMonths]: this.configService.getOrThrow(
        'rewardJob.duration90DaysRate',
        {
          infer: true,
        },
      ),
    };
  }

  async create(createRewardJobDto: CreateRewardJobDto) {
    if (!createRewardJobDto.checkpoint?.id) {
      throw new BadRequestException('Checkpoint is required.');
    }

    const checkpoint = await this.checkpointsService.findById(
      createRewardJobDto.checkpoint.id,
    );

    if (!checkpoint) {
      throw new BadRequestException(
        'Checkpoint with the provided ID does not exist.',
      );
    }

    let updatedBy: User | null = null;

    if (createRewardJobDto.updatedBy?.id) {
      updatedBy = await this.userRepository.findById(
        createRewardJobDto.updatedBy.id,
      );

      if (!updatedBy) {
        throw new BadRequestException('User does not exist.');
      }
    }

    return this.rewardJobRepository.create({
      ...createRewardJobDto,
      checkpoint,
      updatedBy,
    });
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.rewardJobRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: RewardJob['id']) {
    return this.rewardJobRepository.findById(id);
  }

  findByIds(ids: RewardJob['id'][]) {
    return this.rewardJobRepository.findByIds(ids);
  }

  async update(id: RewardJob['id'], updateRewardJobDto: UpdateRewardJobDto) {
    return this.rewardJobRepository.update(id, updateRewardJobDto);
  }

  remove(id: RewardJob['id']) {
    return this.rewardJobRepository.remove(id);
  }

  async scanUnstakes(fromBlock: number, toBlock: number) {
    const unStakeEvents = await this.stakingContract.queryFilter(
      this.stakingContract.filters.TokensUnstaked(),
      fromBlock,
      toBlock,
    );

    const unStakeIndexes: number[] = await Promise.all(
      unStakeEvents.map(async (event) => {
        const stakeIndex = await this.getStakeIndex(event.transactionHash);
        return Number(stakeIndex);
      }),
    );

    const unstakeStakes: IUnstakeStake[] = await Promise.all(
      unStakeEvents.map(async (event: ethers.EventLog, index: number) => {
        const unstakeStake = await this.stakingContract.getStake(
          event.args[0], //wallet address
          unStakeIndexes[index],
        );

        return {
          walletAddress: event.args[0],
          stakeIndex: unStakeIndexes[index],
          amount: Number(ethers.formatUnits(unstakeStake[0], 18)),
          startTime: Number(unstakeStake[1]) * oneSecondInMs,
          duration: this.convertToDays(Number(unstakeStake[2])),
          hasWithdrawn: unstakeStake[3],
          withdrawalTime: Number(unstakeStake[4]) * oneSecondInMs,
          blockNumber: event.blockNumber,
        };
      }),
    );

    return unstakeStakes;
  }

  async getStakeIndex(transactionHash: string) {
    const tx = await this.provider.getTransaction(transactionHash);
    const iface = new ethers.Interface(stakingABI.abi); // Use the provided ABI
    const decodedInput = iface.parseTransaction({ data: tx?.data || '' });
    const stakeIndex = decodedInput?.args[0]; // Extract stakeI
    return stakeIndex;
  }

  async saveCheckpoint(newestUnstakeBlockNumber: number) {
    const block = await this.provider.getBlock(newestUnstakeBlockNumber);
    const newestBlockTimestamp = block?.timestamp || 0;

    const newCheckpoint = {
      blockNumber: newestUnstakeBlockNumber,
      blockTimestamp: newestBlockTimestamp * oneSecondInMs,
      processedAt: new Date().toUTCString(),
    };
    const checkpoint = await this.checkpointsService.create(newCheckpoint);

    return checkpoint;
  }

  calcualteStakingReward(unstakeStake: IUnstakeStake) {
    const duration = unstakeStake.duration;
    let realDuration = 0;

    if (duration >= rewardsDuration.threeMonths) {
      realDuration = rewardsDuration.threeMonths;
    } else if (duration >= rewardsDuration.twoMonths) {
      realDuration = rewardsDuration.twoMonths;
    } else if (duration >= rewardsDuration.month) {
      realDuration = rewardsDuration.month;
    } else if (duration >= rewardsDuration.week) {
      realDuration = rewardsDuration.week;
    }

    const rewardPercentage = new Big(
      this.rewardPercentageObject[realDuration] || 0,
    );
    const unStakeAmount = new Big(unstakeStake.amount);

    return {
      rewardPercentage: Number(rewardPercentage),
      rewardAmount: Number(unStakeAmount.mul(rewardPercentage).div(100)),
    };
  }

  convertToDays(duration: number) {
    return Number(new Big(duration).div(dayInSeconds));
  }

  async scanUnstakeEventsHandler() {
    let continueScanning = true;
    let newRewardJobCount = 0;
    const unstakeStakes: IUnstakeStake[] = [];

    const lateCheckpoint = await this.checkpointsService.findLatest();
    const newestCheckpointBlockNumber = lateCheckpoint?.blockNumber || 0;
    let fromBlock = newestCheckpointBlockNumber
      ? newestCheckpointBlockNumber + 1 //query from the next block
      : this.initialBlockNumber;
    const blockNumber = await this.provider.getBlockNumber();
    // query loop
    while (continueScanning) {
      console.log('🚀 ~ RewardJobsService ~ fromBlock:', fromBlock);
      const unstakeEvents = await this.scanUnstakes(
        fromBlock,
        fromBlock + this.maxScanRange,
      );

      unstakeStakes.push(...unstakeEvents);

      if (fromBlock + this.maxScanRange > blockNumber) {
        continueScanning = false;
      } else {
        fromBlock += this.maxScanRange;
      }
    }

    if (unstakeStakes.length > 0) {
      /*
        To prevent double processing, we need to save the latest unstake block number, not fromblock here
      */
      const newestUnstakeBlockNumber =
        unstakeStakes[unstakeStakes.length - 1].blockNumber;
      const checkpoint = await this.saveCheckpoint(newestUnstakeBlockNumber);
      const newRewardJobs = unstakeStakes
        //make sure the event is after the latest checkpoint to prevent double processing
        .filter((event) => {
          const notProcessedYet =
            event.blockNumber > newestCheckpointBlockNumber;
          const isEligible = event.duration >= 7; //stakes under 7 days are not eligible for rewards

          return notProcessedYet && isEligible;
        })
        .map((event) => {
          const { rewardPercentage, rewardAmount } =
            this.calcualteStakingReward(event);

          return {
            recipientAddress: event.walletAddress,
            checkpoint: {
              id: checkpoint.id,
            },
            stakeIndex: event.stakeIndex,
            amount: event.amount,
            duration: event.duration,
            rewardPercentage,
            rewardAmount,
            status: RewardJobStatus.PENDING,
            updatedBy: null,
          };
        });

      newRewardJobCount = newRewardJobs.length;

      await Promise.all(
        newRewardJobs.map(async (job) => {
          return await this.create(job);
        }),
      );
    } else {
      //if no unstake events, we can save the lastest checked point(fromblock)
      await this.saveCheckpoint(fromBlock);
    }

    return {
      newUnstakeCount: unstakeStakes.length,
      newRewardJobCount: newRewardJobCount,
    };
  }

  async approveRewardJob(id: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    const rewardJob = await this.rewardJobRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    if (!rewardJob) {
      throw new NotFoundException('Reward job not found');
    }

    if (rewardJob.status !== RewardJobStatus.PENDING) {
      throw new BadRequestException('Reward job is not pending');
    }

    const rewardAmont = rewardJob?.rewardAmount;

    try {
      const parsedRewardAmount = ethers.parseUnits(String(rewardAmont), 18);
      const tokenContractWithSigner = new ethers.Contract(
        this.tokenContract.target,
        tokenABI.abi,
        this.signer,
      );
      // check admin vfs balance
      const adminAddress = this.signer.address;
      const adminVFSNBalance =
        await tokenContractWithSigner.balanceOf(adminAddress);
      if (adminVFSNBalance < parsedRewardAmount) {
        throw new BadRequestException(
          `Admin wallet has insufficient vfsn token balance for reward.`,
        );
      }
      // calculate gas limit
      const gasLimit = await tokenContractWithSigner['transfer'].estimateGas(
        rewardJob.recipientAddress,
        parsedRewardAmount,
      );
      const gasPrice = await this.provider.getFeeData();
      const estimatedGasFee = gasLimit * (gasPrice.gasPrice || 0n);
      const estimatedGas = Number(ethers.formatEther(estimatedGasFee) || 0);
      //check vana balance
      const adminVanaBalance = await this.provider.getBalance(adminAddress);
      if (adminVanaBalance < estimatedGas) {
        throw new BadRequestException(
          `Admin wallet has insufficient vana token balance for gas fee.`,
        );
      }
      // make transfer
      const tx = await tokenContractWithSigner['transfer'](
        rewardJob.recipientAddress,
        parsedRewardAmount,
      );
      //update reward job status
      await this.rewardJobRepository.update(id, {
        status: RewardJobStatus.COMPLETED,
        updatedBy: user,
      });
      // create transaction log
      await this.transactionLogsService.create({
        job: { id },
        action: TransactionLogAction.APPROVE,
      });

      return {
        vanaFee: estimatedGas,
        rewardSent: rewardAmont,
        txHash: tx.hash,
        recipientAddress: rewardJob.recipientAddress,
      };
    } catch (error) {
      await this.transactionLogsService.create({
        job: { id },
        action: TransactionLogAction.APPROVE,
        actionMessage: error.message,
      });
      throw error;
    }
  }

  async rejectRewardJob(body: RejectRewardJobDto, userId: string) {
    const { id, reason } = body;
    const user = await this.userRepository.findById(userId);
    const rewardJob = await this.rewardJobRepository.findById(body.id);

    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    if (!rewardJob) {
      throw new NotFoundException('Reward job not found');
    }

    if (rewardJob.status !== RewardJobStatus.PENDING) {
      throw new BadRequestException('Reward job is not pending');
    }

    //update reward job status
    await this.rewardJobRepository.update(id, {
      status: RewardJobStatus.DECLINED,
      updatedBy: user,
    });
    // create transaction log
    await this.transactionLogsService.create({
      job: { id },
      actionMessage: reason,
      action: TransactionLogAction.REJECT,
    });

    return {
      message: 'Reward job rejected successfully',
    };
  }
}
