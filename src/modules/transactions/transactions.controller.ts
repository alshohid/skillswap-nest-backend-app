// external imports
import {
  Controller,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// internal imports
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Get authenticated user point ledger' })
  @Get('me')
  async myLedger(
    @GetUser('id') userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.transactionsService.getUserLedger(userId, page, limit);
  }

  @ApiOperation({ summary: 'Get authenticated user SkillPoint balance' })
  @Get('balance')
  async myBalance(@GetUser('id') userId: number) {
    return await this.transactionsService.getUserBalance(userId);
  }

  @ApiOperation({ summary: 'Get all point transactions (admin)' })
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.transactionsService.getAllTransactions(page, limit);
  }
}
