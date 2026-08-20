"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateTaskDto", {
    enumerable: true,
    get: function() {
        return CreateTaskDto;
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
let CreateTaskDto = class CreateTaskDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Need help with Next.js styling',
        description: 'Title of the task/skill request'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'I need someone to help me style my Next.js dashboard with Tailwind CSS. Must have experience with responsive design.',
        description: 'Detailed description of what help is needed'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 30,
        description: 'Skill points offered as reward for completing the task',
        minimum: 1
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], CreateTaskDto.prototype, "pointsOffered", void 0);

//# sourceMappingURL=create-task.dto.js.map