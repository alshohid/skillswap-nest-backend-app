"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const tasks_repository_1 = require("./tasks.repository");
let TasksService = TasksService_1 = class TasksService {
    constructor(db, tasksRepo) {
        this.db = db;
        this.tasksRepo = tasksRepo;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async createTask(dto, creatorId) {
        const userResult = await this.tasksRepo.findUserPoints(creatorId);
        if (!userResult.rows[0]) {
            throw new common_1.NotFoundException('Creator user not found');
        }
        const result = await this.tasksRepo.insertTask(dto.title, dto.description, dto.pointsOffered, creatorId);
        return {
            success: true,
            message: 'Task created successfully',
            data: result.rows[0],
        };
    }
    async findOpenTasks(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const countResult = await this.tasksRepo.countOpenTasks();
        const total = parseInt(countResult.rows[0].total, 10);
        const result = await this.tasksRepo.findOpenTasks(limit, offset);
        return {
            success: true,
            data: result.rows,
            meta: { page, limit, total },
        };
    }
    async findOne(taskId) {
        const result = await this.tasksRepo.findTaskById(taskId);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Task not found');
        }
        return {
            success: true,
            data: result.rows[0],
        };
    }
    async applyToTask(taskId, applicantId, coverLetter) {
        const taskResult = await this.tasksRepo.findTaskBasic(taskId);
        const task = taskResult.rows[0];
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.status !== 'OPEN') {
            throw new common_1.BadRequestException('Cannot apply to a task that is not OPEN');
        }
        if (task.creator_id === applicantId) {
            throw new common_1.BadRequestException('You cannot apply to your own task');
        }
        try {
            const result = await this.tasksRepo.insertApplication(taskId, applicantId, coverLetter);
            return {
                success: true,
                message: 'Application submitted successfully',
                data: result.rows[0],
            };
        }
        catch (err) {
            if (err.code === '23505') {
                throw new common_1.ConflictException('You have already applied to this task');
            }
            throw err;
        }
    }
    async getApplications(taskId, userId) {
        const taskCheck = await this.tasksRepo.findTaskCreator(taskId);
        if (!taskCheck.rows[0]) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (taskCheck.rows[0].creator_id !== userId) {
            throw new common_1.ForbiddenException('Only the task creator can view applications');
        }
        const result = await this.tasksRepo.findApplicationsByTask(taskId);
        return {
            success: true,
            data: result.rows,
        };
    }
    async assignTask(taskId, appId, creatorId) {
        const taskResult = await this.tasksRepo.findTaskForAssign(taskId);
        const task = taskResult.rows[0];
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.creator_id !== creatorId) {
            throw new common_1.ForbiddenException('Only the task creator can assign this task');
        }
        if (task.status !== 'OPEN') {
            throw new common_1.BadRequestException('Task must be in OPEN state to assign');
        }
        const appResult = await this.tasksRepo.findPendingApplication(appId, taskId);
        const application = appResult.rows[0];
        if (!application) {
            throw new common_1.NotFoundException('Application not found for this task');
        }
        if (application.status !== 'PENDING') {
            throw new common_1.ConflictException('Application is no longer pending');
        }
        await this.tasksRepo.updateApplicationStatus('ACCEPTED', appId);
        const updateResult = await this.tasksRepo.assignTask(application.applicant_id, taskId);
        return {
            success: true,
            message: 'Task assigned successfully',
            data: updateResult.rows[0],
        };
    }
    async completeTask(taskId, creatorId) {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');
            const taskRes = await this.tasksRepo.lockTaskById(taskId, client);
            const task = taskRes.rows[0];
            if (!task) {
                throw new common_1.NotFoundException('Task not found');
            }
            if (task.creator_id !== creatorId) {
                throw new common_1.ForbiddenException('Only the task creator can complete this task');
            }
            if (task.status !== 'ASSIGNED') {
                throw new common_1.BadRequestException('Task must be in ASSIGNED state to complete');
            }
            if (!task.assignee_id) {
                throw new common_1.BadRequestException('No assignee assigned to this task');
            }
            const creatorRes = await this.tasksRepo.lockUserById(creatorId, client);
            const creatorPoints = creatorRes.rows[0].skill_points;
            if (creatorPoints < task.points_offered) {
                throw new common_1.BadRequestException('Insufficient skill points balance');
            }
            await this.tasksRepo.deductPoints(task.points_offered, creatorId, client);
            await this.tasksRepo.creditPoints(task.points_offered, task.assignee_id, client);
            await this.tasksRepo.insertPointTransaction(creatorId, task.assignee_id, taskId, task.points_offered, client);
            await this.tasksRepo.markTaskCompleted(taskId, client);
            await client.query('COMMIT');
            this.logger.log(`✅ Task ${taskId} completed: ${task.points_offered} points transferred ` +
                `from user ${creatorId} to user ${task.assignee_id}`);
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
        }
        catch (error) {
            await client.query('ROLLBACK');
            this.logger.error(`❌ Failed to complete task ${taskId}: ${error.message}`);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async cancelTask(taskId, creatorId) {
        const result = await this.tasksRepo.cancelTask(taskId, creatorId);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Task not found, or you do not have permission to cancel it, ' +
                'or it cannot be cancelled in its current state');
        }
        return {
            success: true,
            message: 'Task cancelled successfully',
            data: result.rows[0],
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        tasks_repository_1.TasksRepository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map