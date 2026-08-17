import { PoolClient } from 'pg';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '../../database/base.repository';
import { SqlQueryLoader } from '../../database/sql-query-loader';
export declare class TasksRepository extends BaseRepository {
    constructor(db: DatabaseService, loader: SqlQueryLoader);
    findUserPoints(userId: number): Promise<QueryResult<T>>;
    insertTask(title: string, description: string, pointsOffered: number, creatorId: number): Promise<QueryResult<T>>;
    countOpenTasks(): Promise<QueryResult<T>>;
    findOpenTasks(limit: number, offset: number): Promise<QueryResult<T>>;
    findTaskById(taskId: number): Promise<QueryResult<T>>;
    findTaskBasic(taskId: number): Promise<QueryResult<T>>;
    findTaskCreator(taskId: number): Promise<QueryResult<T>>;
    cancelTask(taskId: number, creatorId: number): Promise<QueryResult<T>>;
    insertApplication(taskId: number, applicantId: number, coverLetter: string): Promise<QueryResult<T>>;
    findApplicationsByTask(taskId: number): Promise<QueryResult<T>>;
    findTaskForAssign(taskId: number): Promise<QueryResult<T>>;
    findPendingApplication(appId: number, taskId: number): Promise<QueryResult<T>>;
    updateApplicationStatus(status: string, appId: number): Promise<QueryResult<T>>;
    assignTask(assigneeId: number, taskId: number): Promise<QueryResult<T>>;
    lockTaskById(taskId: number, client: PoolClient): Promise<QueryResult<T>>;
    lockUserById(userId: number, client: PoolClient): Promise<QueryResult<T>>;
    deductPoints(amount: number, userId: number, client: PoolClient): Promise<QueryResult<T>>;
    creditPoints(amount: number, userId: number, client: PoolClient): Promise<QueryResult<T>>;
    insertPointTransaction(senderId: number, receiverId: number, taskId: number, amount: number, client: PoolClient): Promise<QueryResult<T>>;
    markTaskCompleted(taskId: number, client: PoolClient): Promise<QueryResult<T>>;
}
