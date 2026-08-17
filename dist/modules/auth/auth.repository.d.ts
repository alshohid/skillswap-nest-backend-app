import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '../../database/base.repository';
import { SqlQueryLoader } from '../../database/sql-query-loader';
export declare class AuthRepository extends BaseRepository {
    constructor(db: DatabaseService, loader: SqlQueryLoader);
    findByEmailExists(email: string): Promise<QueryResult<T>>;
    findUserWithPassword(email: string): Promise<QueryResult<T>>;
    insertUser(fullName: string, email: string, passwordHash: string): Promise<QueryResult<T>>;
    findUserById(userId: number): Promise<QueryResult<T>>;
}
