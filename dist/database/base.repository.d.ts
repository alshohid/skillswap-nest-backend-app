import { Logger } from '@nestjs/common';
import { PoolClient, QueryResult } from 'pg';
import { DatabaseService } from './database.service';
import { SqlQueryLoader } from './sql-query-loader';
export declare abstract class BaseRepository {
    protected readonly db: DatabaseService;
    protected readonly logger: Logger;
    private readonly queries;
    constructor(db: DatabaseService, loader: SqlQueryLoader, ...sqlFilePaths: string[]);
    protected q<T = any>(name: string, params?: any[]): Promise<QueryResult<T>>;
    protected qTx<T = any>(name: string, params: any[], client: PoolClient): Promise<QueryResult<T>>;
    private requireSql;
}
