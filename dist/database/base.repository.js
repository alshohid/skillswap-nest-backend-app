"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseRepository", {
    enumerable: true,
    get: function() {
        return BaseRepository;
    }
});
const _common = require("@nestjs/common");
let BaseRepository = class BaseRepository {
    async q(name, params = []) {
        return await this.db.query(this.requireSql(name), params);
    }
    async qTx(name, params, client) {
        return await client.query(this.requireSql(name), params);
    }
    requireSql(name) {
        const sql = this.queries[name];
        if (!sql) {
            throw new Error(`SQL query "${name}" is not defined in any of the loaded query files`);
        }
        return sql;
    }
    constructor(db, loader, ...sqlFilePaths){
        this.db = db;
        this.logger = new _common.Logger(this.constructor.name);
        this.queries = {};
        for (const filePath of sqlFilePaths){
            Object.assign(this.queries, loader.load(filePath));
        }
        this.logger.log(`✅ Loaded ${Object.keys(this.queries).length} queries from ` + `${sqlFilePaths.length} SQL file(s).`);
    }
};

//# sourceMappingURL=base.repository.js.map