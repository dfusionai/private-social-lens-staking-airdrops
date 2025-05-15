import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { TransactionLogsService } from './transaction-logs.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionLog } from './domain/transaction-log';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTransactionLogsDto } from './dto/find-all-transaction-logs.dto';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@SerializeOptions({ groups: ['admin'] })
@ApiTags('Transaction-logs')
@Controller({
  path: 'transaction-logs',
  version: '1',
})
export class TransactionLogsController {
  constructor(
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  // @Post()
  // @ApiCreatedResponse({
  //   type: TransactionLog,
  // })
  // create(@Body() createTransactionLogDto: CreateTransactionLogDto) {
  //   return this.transactionLogsService.create(createTransactionLogDto);
  // }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TransactionLog),
  })
  async findAll(
    @Query() query: FindAllTransactionLogsDto,
  ): Promise<InfinityPaginationResponseDto<TransactionLog>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.transactionLogsService.findAllWithPagination({
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
    type: TransactionLog,
  })
  findById(@Param('id') id: string) {
    return this.transactionLogsService.findById(id);
  }

  // @Patch(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: TransactionLog,
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransactionLogDto: UpdateTransactionLogDto,
  // ) {
  //   return this.transactionLogsService.update(id, updateTransactionLogDto);
  // }

  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // remove(@Param('id') id: string) {
  //   return this.transactionLogsService.remove(id);
  // }
}
