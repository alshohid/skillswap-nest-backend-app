// external imports
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// internal imports
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApplyTaskDto } from './dto/apply-task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task (skill request)' })
  @Post()
  async create(@Body() dto: CreateTaskDto, @GetUser('id') userId: number) {
    return await this.tasksService.createTask(dto, userId);
  }

  @ApiOperation({ summary: 'List all open tasks' })
  @Get()
  async findOpen(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.tasksService.findOpenTasks(page, limit);
  }

  @ApiOperation({ summary: 'Get a single task by ID' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tasksService.findOne(id);
  }

  @ApiOperation({ summary: 'Apply to a task' })
  @Post(':id/applications')
  async apply(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
    @Body() body: ApplyTaskDto,
  ) {
    return await this.tasksService.applyToTask(
      taskId,
      userId,
      body.coverLetter,
    );
  }

  @ApiOperation({ summary: 'List applications for a task' })
  @Get(':id/applications')
  async getApplications(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.tasksService.getApplications(taskId, userId);
  }

  @ApiOperation({ summary: 'Assign a task to an applicant' })
  @Post(':taskId/assign/:appId')
  async assign(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('appId', ParseIntPipe) appId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.tasksService.assignTask(taskId, appId, userId);
  }

  @ApiOperation({
    summary: 'Complete a task (transfers SkillPoints via ACID transaction)',
  })
  @Post(':id/complete')
  async complete(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.tasksService.completeTask(taskId, userId);
  }

  @ApiOperation({ summary: 'Cancel a task' })
  @Post(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.tasksService.cancelTask(taskId, userId);
  }
}
