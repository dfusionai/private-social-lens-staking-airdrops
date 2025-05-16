//create a web3 service that will be used to interact with the blockchain using the admin wallet info from env here

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AllConfigType } from '../config/config.type';
import stakingABI from '../assets/contracts/StakingImplemenation.json';
import tokenABI from '../assets/contracts/TokenImplementation.json';

@Injectable()
export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private stakingContract: ethers.Contract;
  private tokenContract: ethers.Contract;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.getOrThrow('rewardJob.vanaRpcUrl', {
        infer: true,
      }),
    );
    this.signer = new ethers.Wallet(
      this.configService.getOrThrow('rewardJob.adminWalletPrivateKey', {
        infer: true,
      }),
      this.provider,
    );
    this.stakingContract = new ethers.Contract(
      this.configService.getOrThrow('rewardJob.stakingContractAddress', {
        infer: true,
      }),
      stakingABI.abi,
      this.provider,
    );
    this.tokenContract = new ethers.Contract(
      this.configService.getOrThrow('rewardJob.tokenContractAddress', {
        infer: true,
      }),
      tokenABI.abi,
      this.provider,
    );
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }

  getStakingContract() {
    return this.stakingContract;
  }

  getTokenContract() {
    return this.tokenContract;
  }
}
