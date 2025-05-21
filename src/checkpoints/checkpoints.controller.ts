import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Checkpoint } from './domain/checkpoint';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCheckpointsDto } from './dto/find-all-checkpoints.dto';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Checkpoints')
@Controller({
  path: 'checkpoints',
  version: '1',
})
export class CheckpointsController {
  constructor(private readonly checkpointsService: CheckpointsService) {}

  // @Post()
  // @ApiCreatedResponse({
  //   type: Checkpoint,
  // })
  // create(@Body() createCheckpointDto: CreateCheckpointDto) {
  //   return this.checkpointsService.create(createCheckpointDto);
  // }

  @Get('latest')
  @ApiOkResponse({
    type: Checkpoint,
  })
  findLatest() {
    return this.checkpointsService.findLatest();
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Checkpoint),
  })
  async findAll(
    @Query() query: FindAllCheckpointsDto,
  ): Promise<InfinityPaginationResponseDto<Checkpoint>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.checkpointsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Checkpoint,
  })
  findById(@Param('id') id: string) {
    return this.checkpointsService.findById(id);
  }

  // @Patch(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: Checkpoint,
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCheckpointDto: UpdateCheckpointDto,
  // ) {
  //   return this.checkpointsService.update(id, updateCheckpointDto);
  // }

  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // remove(@Param('id') id: string) {
  //   return this.checkpointsService.remove(id);
  // }
}
