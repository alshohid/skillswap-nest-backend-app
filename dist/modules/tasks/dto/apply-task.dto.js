"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplyTaskDto", {
    enumerable: true,
    get: function() {
        return ApplyTaskDto;
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
let ApplyTaskDto = class ApplyTaskDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'I have 3 years of experience with Tailwind CSS and would love to help you with this task.',
        description: 'Cover letter explaining why you are a good fit for the task',
        maxLength: 2000
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MaxLength)(2000),
    _ts_metadata("design:type", String)
], ApplyTaskDto.prototype, "coverLetter", void 0);

//# sourceMappingURL=apply-task.dto.js.map