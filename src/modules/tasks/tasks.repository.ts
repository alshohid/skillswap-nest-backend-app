// external imports
import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { PoolClient } from 'pg';

// internal imports
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '../../database/base.repository';
import { SqlQueryLoader } from '../../database/sql-query-loader';

@Injectable()
export class TasksRepository extends BaseRepository {
  constructor(db: DatabaseService, loader: SqlQueryLoader) {
    super(
      db,
      loader,
      resolve(__dirname, 'queries', 'tasks.queries.sql'),
      resolve(__dirname, 'queries', 'applications.queries.sql'),
      resolve(__dirname, 'queries', 'ledger.queries.sql'),
    );
  }

  findUserPoints(userId: number) {
    return this.q('findUserPoints', [userId]);
  }

  insertTask(
    title: string,
    description: string,
    pointsOffered: number,
    creatorId: number,
  ) {
    return this.q('insertTask', [title, description, pointsOffered, creatorId]);
  }

  countOpenTasks() {
    return this.q('countOpenTasks');
  }

  findOpenTasks(limit: number, offset: number) {
    return this.q('findOpenTasks', [limit, offset]);
  }

  findTaskById(taskId: number) {
    return this.q('findTaskById', [taskId]);
  }

  findTaskBasic(taskId: number) {
    return this.q('findTaskBasic', [taskId]);
  }

  findTaskCreator(taskId: number) {
    return this.q('findTaskCreator', [taskId]);
  }

  cancelTask(taskId: number, creatorId: number) {
    return this.q('cancelTask', [taskId, creatorId]);
  }

  // ── Task applications & assignment ────────────────────────

  insertApplication(taskId: number, applicantId: number, coverLetter: string) {
    return this.q('insertApplication', [taskId, applicantId, coverLetter]);
  }

  findApplicationsByTask(taskId: number) {
    return this.q('findApplicationsByTask', [taskId]);
  }

  findTaskForAssign(taskId: number) {
    return this.q('findTaskForAssign', [taskId]);
  }

  findPendingApplication(appId: number, taskId: number) {
    return this.q('findPendingApplication', [appId, taskId]);
  }

  updateApplicationStatus(status: string, appId: number) {
    return this.q('updateApplicationStatus', [status, appId]);
  }

  assignTask(assigneeId: number, taskId: number) {
    return this.q('assignTask', [assigneeId, taskId]);
  }

  // ── SkillPoint ledger (ACID transaction) ──────────────────
  // These always run on the caller's transaction client via qTx().

  lockTaskById(taskId: number, client: PoolClient) {
    return this.qTx('lockTaskById', [taskId], client);
  }

  lockUserById(userId: number, client: PoolClient) {
    return this.qTx('lockUserById', [userId], client);
  }

  deductPoints(amount: number, userId: number, client: PoolClient) {
    return this.qTx('deductPoints', [amount, userId], client);
  }

  creditPoints(amount: number, userId: number, client: PoolClient) {
    return this.qTx('creditPoints', [amount, userId], client);
  }

  insertPointTransaction(
    senderId: number,
    receiverId: number,
    taskId: number,
    amount: number,
    client: PoolClient,
  ) {
    return this.qTx(
      'insertPointTransaction',
      [senderId, receiverId, taskId, amount],
      client,
    );
  }

  markTaskCompleted(taskId: number, client: PoolClient) {
    return this.qTx('markTaskCompleted', [taskId], client);
  }
}
