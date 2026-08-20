// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _jwt = require("@nestjs/jwt");
const _common = require("@nestjs/common");
const _authrepository = require("./auth.repository");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
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
let AuthService = class AuthService {
    async register(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        // 1. Check for existing user (parameterized query via repository)
        const existing = await this.authRepo.findByEmailExists(normalizedEmail);
        if (existing.rows.length > 0) {
            throw new _common.BadRequestException('Email already registered');
        }
        const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        const passwordHash = await _bcrypt.hash(dto.password, bcryptSaltRounds);
        const result = await this.authRepo.insertUser(dto.fullName, normalizedEmail, passwordHash);
        const user = result.rows[0];
        this.logger.log(`✅ New user registered: ${user.email} (ID: ${user.id})`);
        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            success: true,
            message: 'User registered successfully',
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                skill_points: user.skill_points,
                created_at: user.created_at,
                access_token: accessToken
            }
        };
    }
    async validateUser(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        const result = await this.authRepo.findUserWithPassword(normalizedEmail);
        const user = result.rows[0];
        if (!user) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await _bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        // Strip the password hash before returning
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
    /**
   * Login an existing user and return a JWT access token.
   */ async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        const payload = {
            sub: user.id,
            email: user.email
        };
        const accessToken = this.jwtService.sign(payload);
        this.logger.log(`🔑 User logged in: ${user.email}`);
        return {
            success: true,
            message: 'Login successful',
            data: {
                access_token: accessToken,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    skill_points: user.skill_points
                }
            }
        };
    }
    /**
   * Get the current authenticated user's profile.
   */ async me(userId) {
        const result = await this.authRepo.findUserById(userId);
        if (!result.rows[0]) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        return {
            success: true,
            data: result.rows[0]
        };
    }
    constructor(authRepo, jwtService){
        this.authRepo = authRepo;
        this.jwtService = jwtService;
        this.logger = new _common.Logger(AuthService.name);
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrepository.AuthRepository === "undefined" ? Object : _authrepository.AuthRepository,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map