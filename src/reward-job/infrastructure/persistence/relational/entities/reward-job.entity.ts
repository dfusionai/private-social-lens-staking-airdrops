import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'reward_job',
})
export class RewardJobEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  checkpointId: number;

  @Column()
  stakeIndex: number;

  @Column()
  amount: number;

  @Column()
  startTime: number;

  @Column()
  duration: number;

  @Column({ default: false })
  hasWithdrawn: boolean;

  @Column()
  withdrawalTime: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
