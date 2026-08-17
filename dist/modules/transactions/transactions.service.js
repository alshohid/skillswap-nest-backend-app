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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let TransactionsService = class TransactionsService {
    constructor(db) {
        this.db = db;
    }
    async getUserLedger(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const countResult = await this.db.query(`SELECT COUNT(*) as total
       FROM point_transactions
       WHERE sender_id = $1 OR receiver_id = $1`, [userId]);
        const total = parseInt(countResult.rows[0].total, 10);
        const result = await this.db.query(`SELECT
         pt.id,
         pt.amount,
         pt.created_at,
         pt.sender_id,
         pt.receiver_id,
         pt.task_id,
         t.title AS task_title,
         CASE
           WHEN pt.sender_id = $1 THEN 'DEBIT'
           ELSE 'CREDIT'
         END AS direction
       FROM point_transactions pt
       LEFT JOIN tasks t ON pt.task_id = t.id
       WHERE pt.sender_id = $1 OR pt.receiver_id = $1
       ORDER BY pt.created_at DESC
       LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        return {
            success: true,
            data: result.rows,
            meta: { page, limit, total },
        };
    }
    async getAllTransactions(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const countResult = await this.db.query(`SELECT COUNT(*) as total FROM point_transactions`);
        const total = parseInt(countResult.rows[0].total, 10);
        const result = await this.db.query(`SELECT
         pt.id,
         pt.amount,
         pt.created_at,
         s.full_name AS sender_name,
         s.email     AS sender_email,
         r.full_name AS receiver_name,
         r.email     AS receiver_email,
         t.title     AS task_title
       FROM point_transactions pt
       LEFT JOIN users s ON pt.sender_id   = s.id
       LEFT JOIN users r ON pt.receiver_id = r.id
       LEFT JOIN tasks t ON pt.task_id     = t.id
       ORDER BY pt.created_at DESC
       LIMIT $1 OFFSET $2`, [limit, offset]);
        return {
            success: true,
            data: result.rows,
            meta: { page, limit, total },
        };
    }
    async getUserBalance(userId) {
        const result = await this.db.query('SELECT skill_points FROM users WHERE id = $1', [userId]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: {
                user_id: userId,
                skill_points: result.rows[0].skill_points,
            },
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map