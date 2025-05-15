import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { RewardJobEntity } from '../../../../../reward-job/infrastructure/persistence/relational/entities/reward-job.entity';
import { TransactionLogAction } from '../../../../../utils/types/transaction-log.type';

@Entity({
  name: 'transaction_log',
})
export class TransactionLogEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: true })
  actionMessage?: string;

  @Column({ type: String, nullable: true })
  action: TransactionLogAction;

  @ManyToOne(() => RewardJobEntity, {
    eager: true,
  })
  job: RewardJobEntity;

  @CreateDateColumn()
  createdAt: Date;
}
