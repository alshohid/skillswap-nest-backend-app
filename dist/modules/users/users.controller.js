// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _usersservice = require("./users.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _getuserdecorator = require("../../common/decorators/get-user.decorator");
const _updateuserdto = require("./dto/update-user.dto");
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
let UsersController = class UsersController {
    async me(userId) {
        return await this.usersService.me(userId);
    }
    async findById(id) {
        return await this.usersService.findById(id);
    }
    async update(userId, dto) {
        return await this.usersService.update(userId, dto);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get authenticated user profile'
    }),
    (0, _common.Get)('me'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get a user public profile by ID'
    }),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Update authenticated user profile'
    }),
    (0, _common.Patch)('me'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _updateuserdto.UpdateUserDto === "undefined" ? Object : _updateuserdto.UpdateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
UsersController = _ts_decorate([
    (0, _swagger.ApiTags)('users'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map