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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const database_service_1 = require("../../database/database.service");
const base_repository_1 = require("../../database/base.repository");
const sql_query_loader_1 = require("../../database/sql-query-loader");
let AuthRepository = class AuthRepository extends base_repository_1.BaseRepository {
    constructor(db, loader) {
        super(db, loader, (0, path_1.resolve)(__dirname, 'queries', 'auth.queries.sql'));
    }
    findByEmailExists(email) {
        return this.q('findByEmailExists', [email]);
    }
    findUserWithPassword(email) {
        return this.q('findUserWithPassword', [email]);
    }
    insertUser(fullName, email, passwordHash) {
        return this.q('insertUser', [fullName, email, passwordHash]);
    }
    findUserById(userId) {
        return this.q('findUserById', [userId]);
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, sql_query_loader_1.SqlQueryLoader])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map