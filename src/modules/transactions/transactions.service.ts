// external imports
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// internal imports
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get the ledger (point transaction history) for a specific user.
   * Shows both sent and received transactions using a UNION query.
   *
   * SQL pattern: instead of Prisma's `include`, we use JOINs and UNION
   * to produce a denormalized result set.
   */
  async getUserLedger(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Total count of relevant transactions
    const countResult = await this.db.query(
      `SELECT COUNT(*) as total
       FROM point_transactions
       WHERE sender_id = $1 OR receiver_id = $1`,
      [userId],
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // UNION of sent and received transactions, with counterparty info
    const result = await this.db.query(
      `SELECT
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
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return {
      success: true,
      data: result.rows,
      meta: { page, limit, total },
    };
  }

  /**
   * Get the full ledger (admin view — all transactions).
   * Demonstrates a JOIN across 4 tables: transactions, users (sender),
   * users (receiver), and tasks.
   */
  async getAllTransactions(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countResult = await this.db.query(
      `SELECT COUNT(*) as total FROM point_transactions`,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const result = await this.db.query(
      `SELECT
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
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return {
      success: true,
      data: result.rows,
      meta: { page, limit, total },
    };
  }

  /**
   * Get balance (skill_points) for a given user.
   */
  async getUserBalance(userId: number) {
    const result = await this.db.query(
      'SELECT skill_points FROM users WHERE id = $1',
      [userId],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: {
        user_id: userId,
        skill_points: result.rows[0].skill_points,
      },
    };
  }
}
