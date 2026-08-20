// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TasksRepository", {
    enumerable: true,
    get: function() {
        return TasksRepository;
    }
});
const _common = require("@nestjs/common");
const _path = require("path");
const _databaseservice = require("../../database/database.service");
const _baserepository = require("../../database/base.repository");
const _sqlqueryloader = require("../../database/sql-query-loader");
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
let TasksRepository = class TasksRepository extends _baserepository.BaseRepository {
    findUserPoints(userId) {
        return this.q('findUserPoints', [
            userId
        ]);
    }
    insertTask(title, description, pointsOffered, creatorId) {
        return this.q('insertTask', [
            title,
            description,
            pointsOffered,
            creatorId
        ]);
    }
    countOpenTasks() {
        return this.q('countOpenTasks');
    }
    findOpenTasks(limit, offset) {
        return this.q('findOpenTasks', [
            limit,
            offset
        ]);
    }
    findTaskById(taskId) {
        return this.q('findTaskById', [
            taskId
        ]);
    }
    findTaskBasic(taskId) {
        return this.q('findTaskBasic', [
            taskId
        ]);
    }
    findTaskCreator(taskId) {
        return this.q('findTaskCreator', [
            taskId
        ]);
    }
    cancelTask(taskId, creatorId) {
        return this.q('cancelTask', [
            taskId,
            creatorId
        ]);
    }
    // ── Task applications & assignment ────────────────────────
    insertApplication(taskId, applicantId, coverLetter) {
        return this.q('insertApplication', [
            taskId,
            applicantId,
            coverLetter
        ]);
    }
    findApplicationsByTask(taskId) {
        return this.q('findApplicationsByTask', [
            taskId
        ]);
    }
    findTaskForAssign(taskId) {
        return this.q('findTaskForAssign', [
            taskId
        ]);
    }
    findPendingApplication(appId, taskId) {
        return this.q('findPendingApplication', [
            appId,
            taskId
        ]);
    }
    updateApplicationStatus(status, appId) {
        return this.q('updateApplicationStatus', [
            status,
            appId
        ]);
    }
    assignTask(assigneeId, taskId) {
        return this.q('assignTask', [
            assigneeId,
            taskId
        ]);
    }
    // ── SkillPoint ledger (ACID transaction) ──────────────────
    // These always run on the caller's transaction client via qTx().
    lockTaskById(taskId, client) {
        return this.qTx('lockTaskById', [
            taskId
        ], client);
    }
    lockUserById(userId, client) {
        return this.qTx('lockUserById', [
            userId
        ], client);
    }
    deductPoints(amount, userId, client) {
        return this.qTx('deductPoints', [
            amount,
            userId
        ], client);
    }
    creditPoints(amount, userId, client) {
        return this.qTx('creditPoints', [
            amount,
            userId
        ], client);
    }
    insertPointTransaction(senderId, receiverId, taskId, amount, client) {
        return this.qTx('insertPointTransaction', [
            senderId,
            receiverId,
            taskId,
            amount
        ], client);
    }
    markTaskCompleted(taskId, client) {
        return this.qTx('markTaskCompleted', [
            taskId
        ], client);
    }
    constructor(db, loader){
        super(db, loader, (0, _path.resolve)(__dirname, 'queries', 'tasks.queries.sql'), (0, _path.resolve)(__dirname, 'queries', 'applications.queries.sql'), (0, _path.resolve)(__dirname, 'queries', 'ledger.queries.sql'));
    }
};
TasksRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService,
        typeof _sqlqueryloader.SqlQueryLoader === "undefined" ? Object : _sqlqueryloader.SqlQueryLoader
    ])
], TasksRepository);

//# sourceMappingURL=tasks.repository.js.map