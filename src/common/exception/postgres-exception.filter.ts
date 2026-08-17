import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'pg';

/**
 * Translates PostgreSQL error codes (from node-postgres) into
 * standardized HTTP responses.
 *
 * Key error codes handled:
 *  23505 → unique_violation       (duplicate value for a unique constraint)
 *  23503 → foreign_key_violation   (referencing a non-existent record)
 *  23502 → not_null_violation      (missing required column value)
 *  23507 → foreign_key_no_action   (cannot delete — row is referenced)
 *  23514 → check_violation         (CHECK constraint violation)
 */
@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PostgresExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.BAD_REQUEST;

    const code = exception.code; // PostgreSQL error code (e.g., '23505')
    let message = 'A database error occurred';

    switch (code) {
      case '23505':
        // unique_violation — extract column name from the detail
        message = 'A record with this value already exists.';
        break;
      case '23503':
        // foreign_key_violation
        message = 'Referenced record does not exist.';
        break;
      case '23502':
        // not_null_violation
        message = 'A required field is missing.';
        break;
      case '23507':
        // foreign_key_no_action
        message = 'Cannot delete this record — it is referenced by other records.';
        break;
      case '23514':
        // check_violation
        message = 'The provided value does not satisfy a constraint.';
        break;
      default:
        message = exception.message || 'Database error occurred';
    }

    this.logger.warn(
      `Postgres error [${code}]: ${exception.message}`,
    );

    response.status(status).json({
      success: false,
      message,
      error: exception.message,
      statusCode: status,
    });
  }
}
