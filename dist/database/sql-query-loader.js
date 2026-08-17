"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlQueryLoader = void 0;
const fs_1 = require("fs");
class SqlQueryLoader {
    load(filePath) {
        const raw = (0, fs_1.readFileSync)(filePath, 'utf-8');
        const map = {};
        const buffer = [];
        let current = null;
        const flush = () => {
            if (current && buffer.length > 0) {
                if (map[current]) {
                    throw new Error(`Duplicate SQL query name "${current}" in file: ${filePath}`);
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
exports.SqlQueryLoader = SqlQueryLoader;
//# sourceMappingURL=sql-query-loader.js.map