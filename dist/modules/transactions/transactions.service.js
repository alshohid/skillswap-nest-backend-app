// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionsService", {
    enumerable: true,
    get: function() {
        return TransactionsService;
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
let TransactionsService = class TransactionsService {
    /**
   * Get the ledger (point transaction history) for a specific user.
   * Shows both sent and received transactions using a UNION query.
   *
   * SQL pattern: instead of Prisma's `include`, we use JOINs and UNION
   * to produce a denormalized result set.
   */ async getUserLedger(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        // Total count of relevant transactions
        const countResult = await this.db.query(`SELECT COUNT(*) as total
       FROM point_transactions
       WHERE sender_id = $1 OR receiver_id = $1`, [
            userId
        ]);
        const total = parseInt(countResult.rows[0].total, 10);
        // UNION of sent and received transactions, with counterparty info
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
       LIMIT $2 OFFSET $3`, [
            userId,
            limit,
            offset
        ]);
        return {
            success: true,
            data: result.rows,
            meta: {
                page,
                limit,
                total
            }
        };
    }
    /**
   * Get the full ledger (admin view — all transactions).
   * Demonstrates a JOIN across 4 tables: transactions, users (sender),
   * users (receiver), and tasks.
   */ async getAllTransactions(page = 1, limit = 20) {
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
       LIMIT $1 OFFSET $2`, [
            limit,
            offset
        ]);
        return {
            success: true,
            data: result.rows,
            meta: {
                page,
                limit,
                total
            }
        };
    }
    /**
   * Get balance (skill_points) for a given user.
   */ async getUserBalance(userId) {
        const result = await this.db.query('SELECT skill_points FROM users WHERE id = $1', [
            userId
        ]);
        if (!result.rows[0]) {
            throw new _common.NotFoundException('User not found');
        }
        return {
            success: true,
            data: {
                user_id: userId,
                skill_points: result.rows[0].skill_points
            }
        };
    }
    constructor(db){
        this.db = db;
    }
};
TransactionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService
    ])
], TransactionsService);

//# sourceMappingURL=transactions.service.js.map