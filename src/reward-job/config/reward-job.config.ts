import { registerAs } from '@nestjs/config';
import { IsString, IsEthereumAddress } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { RewardJobConfig } from './reward-job-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  VANA_RPC_URL: string;

  @IsEthereumAddress()
  STAKING_CONTRACT_ADDRESS: string;

  @IsEthereumAddress()
  TOKEN_CONTRACT_ADDRESS: string;

  @IsString()
  ADMIN_WALLET_PRIVATE_KEY: string;

  @IsString()
  ADMIN_WALLET_ADDRESS: string;

  @IsString()
  DURATION_7_DAYS_RATE: string;

  @IsString()
  DURATION_30_DAYS_RATE: string;

  @IsString()
  DURATION_60_DAYS_RATE: string;

  @IsString()
  DURATION_90_DAYS_RATE: string;
}

export default registerAs<RewardJobConfig>('rewardJob', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    vanaRpcUrl: process.env.VANA_RPC_URL,
    stakingContractAddress: process.env.STAKING_CONTRACT_ADDRESS,
    tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
    adminWalletPrivateKey: process.env.ADMIN_WALLET_PRIVATE_KEY,
    adminWalletAddress: process.env.ADMIN_WALLET_ADDRESS,
    duration7DaysRate: process.env.DURATION_7_DAYS_RATE,
    duration30DaysRate: process.env.DURATION_30_DAYS_RATE,
    duration60DaysRate: process.env.DURATION_60_DAYS_RATE,
    duration90DaysRate: process.env.DURATION_90_DAYS_RATE,
  };
});
