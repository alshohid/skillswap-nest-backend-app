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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRepository = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const database_service_1 = require("../../database/database.service");
const base_repository_1 = require("../../database/base.repository");
const sql_query_loader_1 = require("../../database/sql-query-loader");
let TasksRepository = class TasksRepository extends base_repository_1.BaseRepository {
    constructor(db, loader) {
        super(db, loader, (0, path_1.resolve)(__dirname, 'queries', 'tasks.queries.sql'), (0, path_1.resolve)(__dirname, 'queries', 'applications.queries.sql'), (0, path_1.resolve)(__dirname, 'queries', 'ledger.queries.sql'));
    }
    findUserPoints(userId) {
        return this.q('findUserPoints', [userId]);
    }
    insertTask(title, description, pointsOffered, creatorId) {
        return this.q('insertTask', [title, description, pointsOffered, creatorId]);
    }
    countOpenTasks() {
        return this.q('countOpenTasks');
    }
    findOpenTasks(limit, offset) {
        return this.q('findOpenTasks', [limit, offset]);
    }
    findTaskById(taskId) {
        return this.q('findTaskById', [taskId]);
    }
    findTaskBasic(taskId) {
        return this.q('findTaskBasic', [taskId]);
    }
    findTaskCreator(taskId) {
        return this.q('findTaskCreator', [taskId]);
    }
    cancelTask(taskId, creatorId) {
        return this.q('cancelTask', [taskId, creatorId]);
    }
    insertApplication(taskId, applicantId, coverLetter) {
        return this.q('insertApplication', [taskId, applicantId, coverLetter]);
    }
    findApplicationsByTask(taskId) {
        return this.q('findApplicationsByTask', [taskId]);
    }
    findTaskForAssign(taskId) {
        return this.q('findTaskForAssign', [taskId]);
    }
    findPendingApplication(appId, taskId) {
        return this.q('findPendingApplication', [appId, taskId]);
    }
    updateApplicationStatus(status, appId) {
        return this.q('updateApplicationStatus', [status, appId]);
    }
    assignTask(assigneeId, taskId) {
        return this.q('assignTask', [assigneeId, taskId]);
    }
    lockTaskById(taskId, client) {
        return this.qTx('lockTaskById', [taskId], client);
    }
    lockUserById(userId, client) {
        return this.qTx('lockUserById', [userId], client);
    }
    deductPoints(amount, userId, client) {
        return this.qTx('deductPoints', [amount, userId], client);
    }
    creditPoints(amount, userId, client) {
        return this.qTx('creditPoints', [amount, userId], client);
    }
    insertPointTransaction(senderId, receiverId, taskId, amount, client) {
        return this.qTx('insertPointTransaction', [senderId, receiverId, taskId, amount], client);
    }
    markTaskCompleted(taskId, client) {
        return this.qTx('markTaskCompleted', [taskId], client);
    }
};
exports.TasksRepository = TasksRepository;
exports.TasksRepository = TasksRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, sql_query_loader_1.SqlQueryLoader])
], TasksRepository);
//# sourceMappingURL=tasks.repository.js.map