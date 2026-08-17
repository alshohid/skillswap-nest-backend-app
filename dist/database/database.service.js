"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
        const db = this.configService.get('database');
        this.pool = new pg_1.Pool({
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password,
            database: db.name,
            max: db.max,
            idleTimeoutMillis: db.idleTimeoutMillis,
            connectionTimeoutMillis: db.connectionTimeoutMillis,
        });
        this.pool.on('error', (err) => {
            this.logger.error(`Unexpected error on idle database client: ${err.message}`, err.stack);
        });
    }
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
        }
        catch (err) {
            const duration = Date.now() - start;
            this.logger.error(`[${duration}ms] ERROR EXECUTING: ${text} | ${err.message}`);
            throw err;
        }
    }
    async getClient() {
        return await this.pool.connect();
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map