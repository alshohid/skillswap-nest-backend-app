import { Logger } from '@nestjs/common';
import { PoolClient, QueryResult } from 'pg';

import { DatabaseService } from './database.service';
import { QueryMap, SqlQueryLoader } from './sql-query-loader';

export abstract class BaseRepository {
  protected readonly logger = new Logger(this.constructor.name);
  private readonly queries: QueryMap = {};

  constructor(
    protected readonly db: DatabaseService,
    loader: SqlQueryLoader,
    ...sqlFilePaths: string[]
  ) {
    for (const filePath of sqlFilePaths) {
      Object.assign(this.queries, loader.load(filePath));
    }
    this.logger.log(
      `✅ Loaded ${Object.keys(this.queries).length} queries from ` +
        `${sqlFilePaths.length} SQL file(s).`,
    );
  }

  protected async q<T = any>(
    name: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    return await this.db.query<T>(this.requireSql(name), params);
  }

  protected async qTx<T = any>(
    name: string,
    params: any[],
    client: PoolClient,
  ): Promise<QueryResult<T>> {
    return await client.query<T>(this.requireSql(name), params);
  }

  private requireSql(name: string): string {
    const sql = this.queries[name];
    if (!sql) {
      throw new Error(
        `SQL query "${name}" is not defined in any of the loaded query files`,
      );
    }
    return sql;
  }
}
