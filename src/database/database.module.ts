import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SqlQueryLoader } from './sql-query-loader';

@Global()
@Module({
  providers: [DatabaseService, SqlQueryLoader],
  exports: [DatabaseService, SqlQueryLoader],
})
export class DatabaseModule {}
