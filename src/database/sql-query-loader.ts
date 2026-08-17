import { readFileSync } from 'fs';

export type QueryMap = Record<string, string>;

/**
 * SqlQueryLoader
 * --------------
 * Single responsibility (SRP): reads `.sql` files and turns their
 * `-- name: <queryName>` blocks into a `queryName -> sql` map.
 *
 * It has no knowledge of `pg` or business logic — it only parses SQL
 * source files so the exact query text stays out of TypeScript code.
 */
export class SqlQueryLoader {
  /**
   * Load a single `.sql` file into a map of queryName -> SQL statement.
   *
   * Each named block is introduced by a `-- name: <name>` marker line
   * and continues until the next marker (blank lines and comment lines
   * inside a block are ignored).
   *
   * @throws Error when two blocks in the same file share a name (fail fast).
   */
  load(filePath: string): QueryMap {
    const raw = readFileSync(filePath, 'utf-8');
    const map: QueryMap = {};
    const buffer: string[] = [];
    let current: string | null = null;

    const flush = () => {
      if (current && buffer.length > 0) {
        if (map[current]) {
          throw new Error(
            `Duplicate SQL query name "${current}" in file: ${filePath}`,
          );
        }
        map[current] = buffer.join(' ').trim();
      }
      buffer.length = 0;
    };

    for (const line of raw.split(/\r?\n/)) {
      const nameMatch = line.match(/^--\s*name:\s*(.+?)\s*$/i);
      if (nameMatch) {
        flush();
        current = nameMatch[1].trim();
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--')) {
        continue;
      }
      buffer.push(trimmed);
    }
    flush();

    return map;
  }
}
