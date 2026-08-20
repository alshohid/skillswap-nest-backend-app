"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _jwt = require("@nestjs/jwt");
const _databaseservice = require("../../database/database.service");
const _publicguard = require("./public.guard");
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
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride(_publicguard.PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) {
            return true;
        }
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new _common.UnauthorizedException('Missing or invalid Authorization header');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new _common.UnauthorizedException('Token not provided');
        }
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch  {
            throw new _common.UnauthorizedException('Invalid or expired token');
        }
        // Look up the user in the database using Raw SQL
        const result = await this.db.query(`SELECT id, full_name, email, skill_points, created_at, updated_at
       FROM users
       WHERE id = $1`, [
            parseInt(payload.sub, 10)
        ]);
        if (!result.rows[0]) {
            throw new _common.UnauthorizedException('User not found');
        }
        // Attach user to request for downstream controllers / @GetUser()
        request.user = result.rows[0];
        return true;
    }
    constructor(jwtService, db, reflector){
        this.jwtService = jwtService;
        this.db = db;
        this.reflector = reflector;
        this.logger = new _common.Logger(JwtAuthGuard.name);
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService,
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map