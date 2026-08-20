// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TasksController", {
    enumerable: true,
    get: function() {
        return TasksController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _tasksservice = require("./tasks.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _getuserdecorator = require("../../common/decorators/get-user.decorator");
const _createtaskdto = require("./dto/create-task.dto");
const _applytaskdto = require("./dto/apply-task.dto");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let TasksController = class TasksController {
    async create(dto, userId) {
        return await this.tasksService.createTask(dto, userId);
    }
    async findOpen(page, limit) {
        return await this.tasksService.findOpenTasks(page, limit);
    }
    async findOne(id) {
        return await this.tasksService.findOne(id);
    }
    async apply(taskId, userId, body) {
        return await this.tasksService.applyToTask(taskId, userId, body.coverLetter);
    }
    async getApplications(taskId, userId) {
        return await this.tasksService.getApplications(taskId, userId);
    }
    async assign(taskId, appId, userId) {
        return await this.tasksService.assignTask(taskId, appId, userId);
    }
    async complete(taskId, userId) {
        return await this.tasksService.completeTask(taskId, userId);
    }
    async cancel(taskId, userId) {
        return await this.tasksService.cancelTask(taskId, userId);
    }
    constructor(tasksService){
        this.tasksService = tasksService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Create a new task (skill request)'
    }),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createtaskdto.CreateTaskDto === "undefined" ? Object : _createtaskdto.CreateTaskDto,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'List all open tasks'
    }),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('page', new _common.ParseIntPipe({
        optional: true
    }))),
    _ts_param(1, (0, _common.Query)('limit', new _common.ParseIntPipe({
        optional: true
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "findOpen", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get a single task by ID'
    }),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Apply to a task'
    }),
    (0, _common.Post)(':id/applications'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _getuserdecorator.GetUser)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        typeof _applytaskdto.ApplyTaskDto === "undefined" ? Object : _applytaskdto.ApplyTaskDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "apply", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'List applications for a task'
    }),
    (0, _common.Get)(':id/applications'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "getApplications", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Assign a task to an applicant'
    }),
    (0, _common.Post)(':taskId/assign/:appId'),
    _ts_param(0, (0, _common.Param)('taskId', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Param)('appId', _common.ParseIntPipe)),
    _ts_param(2, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "assign", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Complete a task (transfers SkillPoints via ACID transaction)'
    }),
    (0, _common.Post)(':id/complete'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "complete", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Cancel a task'
    }),
    (0, _common.Post)(':id/cancel'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TasksController.prototype, "cancel", null);
TasksController = _ts_decorate([
    (0, _swagger.ApiTags)('tasks'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('tasks'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tasksservice.TasksService === "undefined" ? Object : _tasksservice.TasksService
    ])
], TasksController);

//# sourceMappingURL=tasks.controller.js.map