export enum RewardJobStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
}

export interface IUnstakeStake {
  walletAddress: string;
  stakeIndex: number;
  amount: number;
  startTime: number;
  duration: number;
  hasWithdrawn: boolean;
  withdrawalTime: number;
  blockNumber: number;
}
