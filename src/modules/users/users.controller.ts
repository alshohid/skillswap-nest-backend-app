// external imports
import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// internal imports
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get authenticated user profile' })
  @Get('me')
  async me(@GetUser('id') userId: number) {
    return await this.usersService.me(userId);
  }

  @ApiOperation({ summary: 'Get a user public profile by ID' })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update authenticated user profile' })
  @Patch('me')
  async update(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(userId, dto);
  }
}
