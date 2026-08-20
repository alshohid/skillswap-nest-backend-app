"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LoginDto () {
        return LoginDto;
    },
    get RegisterDto () {
        return RegisterDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
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
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Alice Smith'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'alice@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'P@ssw0rd123'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'alice@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'P@ssw0rd123'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);

//# sourceMappingURL=register.dto.js.map