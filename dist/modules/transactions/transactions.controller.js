// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionsController", {
    enumerable: true,
    get: function() {
        return TransactionsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _transactionsservice = require("./transactions.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _getuserdecorator = require("../../common/decorators/get-user.decorator");
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
let TransactionsController = class TransactionsController {
    async myLedger(userId, page, limit) {
        return await this.transactionsService.getUserLedger(userId, page, limit);
    }
    async myBalance(userId) {
        return await this.transactionsService.getUserBalance(userId);
    }
    async getAll(page, limit) {
        return await this.transactionsService.getAllTransactions(page, limit);
    }
    constructor(transactionsService){
        this.transactionsService = transactionsService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get authenticated user point ledger'
    }),
    (0, _common.Get)('me'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('id')),
    _ts_param(1, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('limit', new _common.DefaultValuePipe(20), _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TransactionsController.prototype, "myLedger", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get authenticated user SkillPoint balance'
    }),
    (0, _common.Get)('balance'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TransactionsController.prototype, "myBalance", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get all point transactions (admin)'
    }),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Query)('limit', new _common.DefaultValuePipe(20), _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAll", null);
TransactionsController = _ts_decorate([
    (0, _swagger.ApiTags)('transactions'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('transactions'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _transactionsservice.TransactionsService === "undefined" ? Object : _transactionsservice.TransactionsService
    ])
], TransactionsController);

//# sourceMappingURL=transactions.controller.js.map