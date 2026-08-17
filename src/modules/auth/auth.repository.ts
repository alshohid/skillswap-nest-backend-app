// external imports
import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

// internal imports
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '../../database/base.repository';
import { SqlQueryLoader } from '../../database/sql-query-loader';

/**
 * AuthRepository
 * ---------------
 * Data-access boundary for the auth module. Extends the shared
 * BaseRepository and loads its SQL from queries/auth.queries.sql.
 * All user lookup / creation used by authentication flows live here.
 */
@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(db: DatabaseService, loader: SqlQueryLoader) {
    super(
      db,
      loader,
      resolve(__dirname, 'queries', 'auth.queries.sql'),
    );
  }

  /** Check whether an email already exists (returns the matching row id). */
  findByEmailExists(email: string) {
    return this.q('findByEmailExists', [email]);
  }

  /** Fetch a user by email including the password hash (login/validate). */
  findUserWithPassword(email: string) {
    return this.q('findUserWithPassword', [email]);
  }

  /** Create a new user with the given password hash; returns the new row. */
  insertUser(fullName: string, email: string, passwordHash: string) {
    return this.q('insertUser', [fullName, email, passwordHash]);
  }

  /** Fetch a user's public profile by id. */
  findUserById(userId: number) {
    return this.q('findUserById', [userId]);
  }
}
