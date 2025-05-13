import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateRewardJobDto } from './dto/create-reward-job.dto';
import { UpdateRewardJobDto } from './dto/update-reward-job.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RewardJob } from './domain/reward-job';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { FindAllRewardJobsDto } from './dto/find-all-reward-job.dto';
import { RewardJobsService } from './reward-job.service';

@ApiTags('Reward jobs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'reward-jobs',
  version: '1',
})
export class RewardJobsController {
  constructor(private readonly rewardJobsService: RewardJobsService) {}

  @Post()
  @ApiCreatedResponse({
    type: RewardJob,
  })
  create(@Body() createRewardJobDto: CreateRewardJobDto) {
    return this.rewardJobsService.create(createRewardJobDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(RewardJob),
  })
  async findAll(@Query() query: FindAllRewardJobsDto): Promise<any> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return await this.rewardJobsService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Post('scan-unstakes')
  @ApiOkResponse({
    type: InfinityPaginationResponse(RewardJob),
  })
  async scanUnstakes(): Promise<{
    unStakeCount: number;
  }> {
    return await this.rewardJobsService.scanUnstakeEventsHandler();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: RewardJob,
  })
  findById(@Param('id') id: string) {
    return this.rewardJobsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: RewardJob,
  })
  update(
    @Param('id') id: string,
    @Body() updateRewardJobDto: UpdateRewardJobDto,
  ) {
    return this.rewardJobsService.update(id, updateRewardJobDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.rewardJobsService.remove(id);
  }
}
