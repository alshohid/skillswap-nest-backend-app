"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PostgresExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let PostgresExceptionFilter = PostgresExceptionFilter_1 = class PostgresExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(PostgresExceptionFilter_1.name);
    }
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        const status = common_1.HttpStatus.BAD_REQUEST;
        const code = exception.code;
        let message = 'A database error occurred';
        switch (code) {
            case '23505':
                message = 'A record with this value already exists.';
                break;
            case '23503':
                message = 'Referenced record does not exist.';
                break;
            case '23502':
                message = 'A required field is missing.';
                break;
            case '23507':
                message = 'Cannot delete this record — it is referenced by other records.';
                break;
            case '23514':
                message = 'The provided value does not satisfy a constraint.';
                break;
            default:
                message = exception.message || 'Database error occurred';
        }
        this.logger.warn(`Postgres error [${code}]: ${exception.message}`);
        response.status(status).json({
            success: false,
            message,
            error: exception.message,
            statusCode: status,
        });
    }
};
exports.PostgresExceptionFilter = PostgresExceptionFilter;
exports.PostgresExceptionFilter = PostgresExceptionFilter = PostgresExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(pg_1.QueryFailedError)
], PostgresExceptionFilter);
//# sourceMappingURL=postgres-exception.filter.js.map