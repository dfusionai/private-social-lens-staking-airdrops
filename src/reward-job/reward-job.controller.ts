import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RewardJob } from './domain/reward-job';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { FindAllRewardJobsDto } from './dto/find-all-reward-job.dto';
import { RewardJobsService } from './reward-job.service';
import { RejectRewardJobDto } from './dto/reject-reward-job.dto';
import { ScanUnstakeResDto } from './dto/scan-unstake-res.dto';
import { ApproveRewardResDto } from './dto/approve-reward-res.dto';
import { Request } from 'express';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ScanUnstakeDto } from './dto/scan-unstake.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Reward jobs')
@SerializeOptions({
  groups: ['admin'],
})
@Controller({
  path: 'reward-jobs',
  version: '1',
})
export class RewardJobsController {
  constructor(private readonly rewardJobsService: RewardJobsService) {}

  // @Post()
  // @ApiCreatedResponse({
  //   type: RewardJob,
  // })
  // create(@Body() createRewardJobDto: CreateRewardJobDto) {
  //   return this.rewardJobsService.create(createRewardJobDto);
  // }

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({
    type: ScanUnstakeResDto,
  })
  async scanUnstakes(@Body() body: ScanUnstakeDto): Promise<ScanUnstakeResDto> {
    return await this.rewardJobsService.scanUnstakeEventsHandler(body);
  }

  @Patch(':id/approve')
  @ApiOkResponse({
    type: ApproveRewardResDto,
  })
  async approveRewardJob(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ApproveRewardResDto> {
    const userId = (req as any).user.id;
    return await this.rewardJobsService.approveRewardJob(id, userId);
  }

  @Patch(':id/reject')
  async rejectRewardJob(
    @Body() body: RejectRewardJobDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const userId = (req as any).user.id;
    return await this.rewardJobsService.rejectRewardJob(body, userId);
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

  // @Patch(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: RewardJob,
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRewardJobDto: UpdateRewardJobDto,
  // ) {
  //   return this.rewardJobsService.update(id, updateRewardJobDto);
  // }

  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // remove(@Param('id') id: string) {
  //   return this.rewardJobsService.remove(id);
  // }
}
