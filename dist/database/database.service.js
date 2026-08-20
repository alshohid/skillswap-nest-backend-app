"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseService", {
    enumerable: true,
    get: function() {
        return DatabaseService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _pg = require("pg");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
let DatabaseService = class DatabaseService {
    async onModuleInit() {
        await this.pool.query('SELECT 1');
        this.logger.log('✅ Database pool initialized successfully.');
    }
    async onModuleDestroy() {
        await this.pool.end();
        this.logger.log('🔌 Database pool closed gracefully.');
    }
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            this.logger.debug(`[${duration}ms] ${text}`);
            return res;
        } catch (err) {
            const duration = Date.now() - start;
            this.logger.error(`[${duration}ms] ERROR EXECUTING: ${text} | ${err.message}`);
            throw err;
        }
    }
    async getClient() {
        return await this.pool.connect();
    }
    constructor(configService){
        this.configService = configService;
        this.logger = new _common.Logger(DatabaseService.name);
        const db = this.configService.get('database');
        this.pool = new _pg.Pool({
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password,
            database: db.name,
            max: db.max,
            idleTimeoutMillis: db.idleTimeoutMillis,
            connectionTimeoutMillis: db.connectionTimeoutMillis
        });
        this.pool.on('error', (err)=>{
            this.logger.error(`Unexpected error on idle database client: ${err.message}`, err.stack);
        });
    }
};
DatabaseService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], DatabaseService);

//# sourceMappingURL=database.service.js.map