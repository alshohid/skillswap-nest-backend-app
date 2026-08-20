"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostgresExceptionFilter", {
    enumerable: true,
    get: function() {
        return PostgresExceptionFilter;
    }
});
const _common = require("@nestjs/common");
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
let PostgresExceptionFilter = class PostgresExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        const status = _common.HttpStatus.BAD_REQUEST;
        const code = exception.code; // PostgreSQL error code (e.g., '23505')
        let message = 'A database error occurred';
        switch(code){
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
        this.logger.warn(`Postgres error [${code}]: ${exception.message}`);
        response.status(status).json({
            success: false,
            message,
            error: exception.message,
            statusCode: status
        });
    }
    constructor(){
        this.logger = new _common.Logger(PostgresExceptionFilter.name);
    }
};
PostgresExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_pg.QueryFailedError)
], PostgresExceptionFilter);

//# sourceMappingURL=postgres-exception.filter.js.map