import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const db = this.configService.get('database');
    this.pool = new Pool({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.name,
      max: db.max,
      idleTimeoutMillis: db.idleTimeoutMillis,
      connectionTimeoutMillis: db.connectionTimeoutMillis,
    });

    this.pool.on('error', (err: Error) => {
      this.logger.error(
        `Unexpected error on idle database client: ${err.message}`,
        err.stack,
      );
    });
  }

  async onModuleInit() {
    await this.pool.query('SELECT 1');
    this.logger.log('✅ Database pool initialized successfully.');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('🔌 Database pool closed gracefully.');
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const res = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      this.logger.debug(`[${duration}ms] ${text}`);
      return res;
    } catch (err) {
      const duration = Date.now() - start;
      this.logger.error(
        `[${duration}ms] ERROR EXECUTING: ${text} | ${err.message}`,
      );
      throw err;
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
}
