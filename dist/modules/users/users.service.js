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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const result = await this.db.query(`SELECT id, full_name, email, skill_points, created_at, updated_at
       FROM users WHERE id = $1`, [id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: result.rows[0],
        };
    }
    async update(id, dto) {
        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (dto.fullName) {
            updates.push(`full_name = $${paramIndex++}`);
            values.push(dto.fullName);
        }
        if (updates.length === 0) {
            throw new common_1.BadRequestException('No fields provided to update');
        }
        updates.push(`updated_at = NOW()`);
        values.push(id);
        const result = await this.db.query(`UPDATE users SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, full_name, email, skill_points, created_at, updated_at`, values);
        return {
            success: true,
            message: 'User profile updated successfully',
            data: result.rows[0],
        };
    }
    async me(id) {
        return this.findById(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map