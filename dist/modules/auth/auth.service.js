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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const auth_repository_1 = require("./auth.repository");
let AuthService = AuthService_1 = class AuthService {
    constructor(authRepo, jwtService) {
        this.authRepo = authRepo;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const existing = await this.authRepo.findByEmailExists(normalizedEmail);
        if (existing.rows.length > 0) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        const passwordHash = await bcrypt.hash(dto.password, bcryptSaltRounds);
        const result = await this.authRepo.insertUser(dto.fullName, normalizedEmail, passwordHash);
        const user = result.rows[0];
        this.logger.log(`✅ New user registered: ${user.email} (ID: ${user.id})`);
        const payload = { sub: user.id, email: user.email };
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
                access_token: accessToken,
            },
        };
    }
    async validateUser(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        const result = await this.authRepo.findUserWithPassword(normalizedEmail);
        const user = result.rows[0];
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        const payload = { sub: user.id, email: user.email };
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
                    skill_points: user.skill_points,
                },
            },
        };
    }
    async me(userId) {
        const result = await this.authRepo.findUserById(userId);
        if (!result.rows[0]) {
            return {
                success: false,
                message: 'User not found',
            };
        }
        return {
            success: true,
            data: result.rows[0],
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map