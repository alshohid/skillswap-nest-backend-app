// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TasksService", {
    enumerable: true,
    get: function() {
        return TasksService;
    }
});
const _common = require("@nestjs/common");
const _databaseservice = require("../../database/database.service");
const _tasksrepository = require("./tasks.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
let TasksService = class TasksService {
    async createTask(dto, creatorId) {
        const userResult = await this.tasksRepo.findUserPoints(creatorId);
        if (!userResult.rows[0]) {
            throw new _common.NotFoundException('Creator user not found');
        }
        const result = await this.tasksRepo.insertTask(dto.title, dto.description, dto.pointsOffered, creatorId);
        return {
            success: true,
            message: 'Task created successfully',
            data: result.rows[0]
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
            meta: {
                page,
                limit,
                total
            }
        };
    }
    async findOne(taskId) {
        const result = await this.tasksRepo.findTaskById(taskId);
        if (!result.rows[0]) {
            throw new _common.NotFoundException('Task not found');
        }
        return {
            success: true,
            data: result.rows[0]
        };
    }
    async applyToTask(taskId, applicantId, coverLetter) {
        const taskResult = await this.tasksRepo.findTaskBasic(taskId);
        const task = taskResult.rows[0];
        if (!task) {
            throw new _common.NotFoundException('Task not found');
        }
        if (task.status !== 'OPEN') {
            throw new _common.BadRequestException('Cannot apply to a task that is not OPEN');
        }
        if (task.creator_id === applicantId) {
            throw new _common.BadRequestException('You cannot apply to your own task');
        }
        try {
            const result = await this.tasksRepo.insertApplication(taskId, applicantId, coverLetter);
            return {
                success: true,
                message: 'Application submitted successfully',
                data: result.rows[0]
            };
        } catch (err) {
            if (err.code === '23505') {
                throw new _common.ConflictException('You have already applied to this task');
            }
            throw err;
        }
    }
    async getApplications(taskId, userId) {
        const taskCheck = await this.tasksRepo.findTaskCreator(taskId);
        if (!taskCheck.rows[0]) {
            throw new _common.NotFoundException('Task not found');
        }
        if (taskCheck.rows[0].creator_id !== userId) {
            throw new _common.ForbiddenException('Only the task creator can view applications');
        }
        const result = await this.tasksRepo.findApplicationsByTask(taskId);
        return {
            success: true,
            data: result.rows
        };
    }
    async assignTask(taskId, appId, creatorId) {
        const taskResult = await this.tasksRepo.findTaskForAssign(taskId);
        const task = taskResult.rows[0];
        if (!task) {
            throw new _common.NotFoundException('Task not found');
        }
        if (task.creator_id !== creatorId) {
            throw new _common.ForbiddenException('Only the task creator can assign this task');
        }
        if (task.status !== 'OPEN') {
            throw new _common.BadRequestException('Task must be in OPEN state to assign');
        }
        // Verify the application exists and is PENDING
        const appResult = await this.tasksRepo.findPendingApplication(appId, taskId);
        const application = appResult.rows[0];
        if (!application) {
            throw new _common.NotFoundException('Application not found for this task');
        }
        if (application.status !== 'PENDING') {
            throw new _common.ConflictException('Application is no longer pending');
        }
        // Update the application to ACCEPTED
        await this.tasksRepo.updateApplicationStatus('ACCEPTED', appId);
        // Update the task: set assignee and status to ASSIGNED
        const updateResult = await this.tasksRepo.assignTask(application.applicant_id, taskId);
        return {
            success: true,
            message: 'Task assigned successfully',
            data: updateResult.rows[0]
        };
    }
    async completeTask(taskId, creatorId) {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');
            const taskRes = await this.tasksRepo.lockTaskById(taskId, client);
            const task = taskRes.rows[0];
            if (!task) {
                throw new _common.NotFoundException('Task not found');
            }
            if (task.creator_id !== creatorId) {
                throw new _common.ForbiddenException('Only the task creator can complete this task');
            }
            if (task.status !== 'ASSIGNED') {
                throw new _common.BadRequestException('Task must be in ASSIGNED state to complete');
            }
            if (!task.assignee_id) {
                throw new _common.BadRequestException('No assignee assigned to this task');
            }
            // ── 2. Lock the creator's row (prevents double-spend) ──
            const creatorRes = await this.tasksRepo.lockUserById(creatorId, client);
            const creatorPoints = creatorRes.rows[0].skill_points;
            if (creatorPoints < task.points_offered) {
                throw new _common.BadRequestException('Insufficient skill points balance');
            }
            // ── 3. Deduct points from the creator ──
            await this.tasksRepo.deductPoints(task.points_offered, creatorId, client);
            // ── 4. Credit points to the assignee ──
            await this.tasksRepo.creditPoints(task.points_offered, task.assignee_id, client);
            // ── 5. Record the transaction in the ledger ──
            await this.tasksRepo.insertPointTransaction(creatorId, task.assignee_id, taskId, task.points_offered, client);
            // ── 6. Mark the task as COMPLETED ──
            await this.tasksRepo.markTaskCompleted(taskId, client);
            await client.query('COMMIT');
            this.logger.log(`✅ Task ${taskId} completed: ${task.points_offered} points transferred ` + `from user ${creatorId} to user ${task.assignee_id}`);
            return {
                success: true,
                message: 'Task completed and SkillPoints transferred successfully',
                data: {
                    task_id: task.id,
                    points_transferred: task.points_offered,
                    from_user_id: creatorId,
                    to_user_id: task.assignee_id
                }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error(`❌ Failed to complete task ${taskId}: ${error.message}`);
            throw error;
        } finally{
            client.release();
        }
    }
    async cancelTask(taskId, creatorId) {
        const result = await this.tasksRepo.cancelTask(taskId, creatorId);
        if (!result.rows[0]) {
            throw new _common.NotFoundException('Task not found, or you do not have permission to cancel it, ' + 'or it cannot be cancelled in its current state');
        }
        return {
            success: true,
            message: 'Task cancelled successfully',
            data: result.rows[0]
        };
    }
    constructor(db, tasksRepo){
        this.db = db;
        this.tasksRepo = tasksRepo;
        this.logger = new _common.Logger(TasksService.name);
    }
};
TasksService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService,
        typeof _tasksrepository.TasksRepository === "undefined" ? Object : _tasksrepository.TasksRepository
    ])
], TasksService);

//# sourceMappingURL=tasks.service.js.map