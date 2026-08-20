// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _publicguard = require("../../common/guards/public.guard");
const _getuserdecorator = require("../../common/decorators/get-user.decorator");
const _registerdto = require("./dto/register.dto");
const _logindto = require("./dto/login.dto");
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
let AuthController = class AuthController {
    async register(dto) {
        return await this.authService.register(dto);
    }
    async login(dto) {
        return await this.authService.login(dto);
    }
    async me(user) {
        return await this.authService.me(user.id);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user (receives 100 SkillPoints)'
    }),
    (0, _publicguard.Public)(),
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registerdto.RegisterDto === "undefined" ? Object : _registerdto.RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Login with email and password'
    }),
    (0, _publicguard.Public)(),
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logindto.LoginDto === "undefined" ? Object : _logindto.LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get the authenticated user profile'
    }),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('me'),
    _ts_param(0, (0, _getuserdecorator.GetUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map