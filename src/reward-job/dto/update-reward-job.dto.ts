// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateRewardJobDto } from './create-reward-job.dto';

export class UpdateRewardJobDto extends PartialType(CreateRewardJobDto) {}
