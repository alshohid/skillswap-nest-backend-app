"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SqlQueryLoader", {
    enumerable: true,
    get: function() {
        return SqlQueryLoader;
    }
});
const _fs = require("fs");
let SqlQueryLoader = class SqlQueryLoader {
    load(filePath) {
        const raw = (0, _fs.readFileSync)(filePath, 'utf-8');
        const map = {};
        const buffer = [];
        let current = null;
        const flush = ()=>{
            if (current && buffer.length > 0) {
                if (map[current]) {
                    throw new Error(`Duplicate SQL query name "${current}" in file: ${filePath}`);
                }
                map[current] = buffer.join(' ').trim();
            }
            buffer.length = 0;
        };
        for (const line of raw.split(/\r?\n/)){
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
};

//# sourceMappingURL=sql-query-loader.js.map