/**
 * DateHelper - Centralized date utilities.
 * Mirrors the pattern used in the parent palomazollc_backend project.
 */
export class DateHelper {
  /**
   * Returns the current timestamp in ISO string format.
   */
  static now(): string {
    return new Date().toISOString();
  }

  /**
   * Formats a date to a SQL-friendly timestamp string.
   * Uses the database server's timezone (no conversion).
   */
  static toSqlTimestamp(date: string | Date): string {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Format a Date for JSON responses (ISO with seconds precision).
   */
  static format(date: string | Date): string {
    return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
}
