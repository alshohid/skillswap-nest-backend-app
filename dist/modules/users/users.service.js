// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _databaseservice = require("../../database/database.service");
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
let UsersService = class UsersService {
    async findById(id) {
        const result = await this.db.query(`SELECT id, full_name, email, skill_points, created_at, updated_at
       FROM users WHERE id = $1`, [
            id
        ]);
        if (!result.rows[0]) {
            throw new _common.NotFoundException('User not found');
        }
        return {
            success: true,
            data: result.rows[0]
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
            throw new _common.BadRequestException('No fields provided to update');
        }
        updates.push(`updated_at = NOW()`);
        values.push(id);
        const result = await this.db.query(`UPDATE users SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, full_name, email, skill_points, created_at, updated_at`, values);
        return {
            success: true,
            message: 'User profile updated successfully',
            data: result.rows[0]
        };
    }
    /**
   * Get the authenticated user's profile (from JWT).
   */ async me(id) {
        return this.findById(id);
    }
    constructor(db){
        this.db = db;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map