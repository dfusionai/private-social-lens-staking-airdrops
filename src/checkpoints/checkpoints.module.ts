import {
  // common
  Module,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CheckpointsController } from './checkpoints.controller';
import { RelationalCheckpointPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalCheckpointPersistenceModule,
  ],
  controllers: [CheckpointsController],
  providers: [CheckpointsService],
  exports: [CheckpointsService, RelationalCheckpointPersistenceModule],
})
export class CheckpointsModule {}
