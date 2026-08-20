// external imports
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';

// internal imports
import { DatabaseService } from '../../database/database.service';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly tasksRepo: TasksRepository,
  ) {}

  async createTask(dto: CreateTaskDto, creatorId: number) {
    const userResult = await this.tasksRepo.findUserPoints(creatorId);
    if (!userResult.rows[0]) {
      throw new NotFoundException('Creator user not found');
    }

    const result = await this.tasksRepo.insertTask(
      dto.title,
      dto.description,
      dto.pointsOffered,
      creatorId,
    );

    return {
      success: true,
      message: 'Task created successfully',
      data: result.rows[0],
    };
  }

  async findOpenTasks(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const countResult = await this.tasksRepo.countOpenTasks();
    console.log('countResult', countResult.rows[0]);
    const total = parseInt(countResult.rows[0].total, 10);

    const result = await this.tasksRepo.findOpenTasks(limit, offset);

    return {
      success: true,
      data: result.rows,
      meta: { page, limit, total },
    };
  }

  async findOne(taskId: number) {
    const result = await this.tasksRepo.findTaskById(taskId);

    if (!result.rows[0]) {
      throw new NotFoundException('Task not found');
    }

    return {
      success: true,
      data: result.rows[0],
    };
  }

  async applyToTask(taskId: number, applicantId: number, coverLetter: string) {
    const taskResult = await this.tasksRepo.findTaskBasic(taskId);
    const task = taskResult.rows[0];
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status !== 'OPEN') {
      throw new BadRequestException('Cannot apply to a task that is not OPEN');
    }
    if (task.creator_id === applicantId) {
      throw new BadRequestException('You cannot apply to your own task');
    }

    try {
      const result = await this.tasksRepo.insertApplication(
        taskId,
        applicantId,
        coverLetter,
      );

      return {
        success: true,
        message: 'Application submitted successfully',
        data: result.rows[0],
      };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('You have already applied to this task');
      }
      throw err;
    }
  }

  async getApplications(taskId: number, userId: number) {
    const taskCheck = await this.tasksRepo.findTaskCreator(taskId);
    if (!taskCheck.rows[0]) {
      throw new NotFoundException('Task not found');
    }
    if (taskCheck.rows[0].creator_id !== userId) {
      throw new ForbiddenException(
        'Only the task creator can view applications',
      );
    }
    const result = await this.tasksRepo.findApplicationsByTask(taskId);
    return {
      success: true,
      data: result.rows,
    };
  }

  async assignTask(taskId: number, appId: number, creatorId: number) {
    const taskResult = await this.tasksRepo.findTaskForAssign(taskId);
    const task = taskResult.rows[0];
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.creator_id !== creatorId) {
      throw new ForbiddenException(
        'Only the task creator can assign this task',
      );
    }
    if (task.status !== 'OPEN') {
      throw new BadRequestException('Task must be in OPEN state to assign');
    }

    // Verify the application exists and is PENDING
    const appResult = await this.tasksRepo.findPendingApplication(
      appId,
      taskId,
    );
    const application = appResult.rows[0];
    if (!application) {
      throw new NotFoundException('Application not found for this task');
    }
    if (application.status !== 'PENDING') {
      throw new ConflictException('Application is no longer pending');
    }

    // Update the application to ACCEPTED
    await this.tasksRepo.updateApplicationStatus('ACCEPTED', appId);

    // Update the task: set assignee and status to ASSIGNED
    const updateResult = await this.tasksRepo.assignTask(
      application.applicant_id,
      taskId,
    );

    return {
      success: true,
      message: 'Task assigned successfully',
      data: updateResult.rows[0],
    };
  }

  async completeTask(taskId: number, creatorId: number) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');
      const taskRes = await this.tasksRepo.lockTaskById(taskId, client);
      const task = taskRes.rows[0];

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.creator_id !== creatorId) {
        throw new ForbiddenException(
          'Only the task creator can complete this task',
        );
      }

      if (task.status !== 'ASSIGNED') {
        throw new BadRequestException(
          'Task must be in ASSIGNED state to complete',
        );
      }

      if (!task.assignee_id) {
        throw new BadRequestException('No assignee assigned to this task');
      }

      // ── 2. Lock the creator's row (prevents double-spend) ──
      const creatorRes = await this.tasksRepo.lockUserById(creatorId, client);
      const creatorPoints = creatorRes.rows[0].skill_points;

      if (creatorPoints < task.points_offered) {
        throw new BadRequestException('Insufficient skill points balance');
      }

      // ── 3. Deduct points from the creator ──
      await this.tasksRepo.deductPoints(task.points_offered, creatorId, client);

      // ── 4. Credit points to the assignee ──
      await this.tasksRepo.creditPoints(
        task.points_offered,
        task.assignee_id,
        client,
      );

      // ── 5. Record the transaction in the ledger ──
      await this.tasksRepo.insertPointTransaction(
        creatorId,
        task.assignee_id,
        taskId,
        task.points_offered,
        client,
      );

      // ── 6. Mark the task as COMPLETED ──
      await this.tasksRepo.markTaskCompleted(taskId, client);

      await client.query('COMMIT');

      this.logger.log(
        `✅ Task ${taskId} completed: ${task.points_offered} points transferred ` +
          `from user ${creatorId} to user ${task.assignee_id}`,
      );

      return {
        success: true,
        message: 'Task completed and SkillPoints transferred successfully',
        data: {
          task_id: task.id,
          points_transferred: task.points_offered,
          from_user_id: creatorId,
          to_user_id: task.assignee_id,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error(
        `❌ Failed to complete task ${taskId}: ${error.message}`,
      );
      throw error;
    } finally {
      client.release();
    }
  }

  async cancelTask(taskId: number, creatorId: number) {
    const result = await this.tasksRepo.cancelTask(taskId, creatorId);

    if (!result.rows[0]) {
      throw new NotFoundException(
        'Task not found, or you do not have permission to cancel it, ' +
          'or it cannot be cancelled in its current state',
      );
    }

    return {
      success: true,
      message: 'Task cancelled successfully',
      data: result.rows[0],
    };
  }
}
