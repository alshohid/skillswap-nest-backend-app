import { readFileSync } from 'fs';

export type QueryMap = Record<string, string>;

export class SqlQueryLoader {
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
