import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { CheckpointEntity } from 'src/checkpoints/infrastructure/persistence/relational/entities/checkpoint.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'reward_job',
})
export class RewardJobEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipientAddress: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  updatedBy?: UserEntity | null;

  @ManyToOne(() => CheckpointEntity, {
    eager: true,
  })
  checkpoint: CheckpointEntity;

  @Column()
  stakeIndex: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  duration: number;

  @Column()
  rewardPercentage: number;

  @Column({ type: 'float' })
  rewardAmount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
