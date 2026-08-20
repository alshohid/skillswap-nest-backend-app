// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRepository", {
    enumerable: true,
    get: function() {
        return AuthRepository;
    }
});
const _common = require("@nestjs/common");
const _path = require("path");
const _databaseservice = require("../../database/database.service");
const _baserepository = require("../../database/base.repository");
const _sqlqueryloader = require("../../database/sql-query-loader");
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
let AuthRepository = class AuthRepository extends _baserepository.BaseRepository {
    /** Check whether an email already exists (returns the matching row id). */ findByEmailExists(email) {
        return this.q('findByEmailExists', [
            email
        ]);
    }
    /** Fetch a user by email including the password hash (login/validate). */ findUserWithPassword(email) {
        return this.q('findUserWithPassword', [
            email
        ]);
    }
    /** Create a new user with the given password hash; returns the new row. */ insertUser(fullName, email, passwordHash) {
        return this.q('insertUser', [
            fullName,
            email,
            passwordHash
        ]);
    }
    /** Fetch a user's public profile by id. */ findUserById(userId) {
        return this.q('findUserById', [
            userId
        ]);
    }
    constructor(db, loader){
        super(db, loader, (0, _path.resolve)(__dirname, 'queries', 'auth.queries.sql'));
    }
};
AuthRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService,
        typeof _sqlqueryloader.SqlQueryLoader === "undefined" ? Object : _sqlqueryloader.SqlQueryLoader
    ])
], AuthRepository);

//# sourceMappingURL=auth.repository.js.map