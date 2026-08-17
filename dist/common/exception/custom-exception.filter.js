"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function isString(value) {
    return typeof value === 'string';
}
let CustomExceptionFilter = CustomExceptionFilter_1 = class CustomExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(CustomExceptionFilter_1.name);
    }
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        let status = exception.getStatus();
        let responseBody;
        const exceptionResponse = exception?.getResponse();
        if (exception instanceof multer_1.MulterError) {
            if (exception.code === 'LIMIT_FILE_SIZE') {
                status = 400;
                responseBody = {
                    message: 'File too large. Maximum allowed size exceeded.',
                };
            }
            else {
                responseBody = {
                    message: `File upload error: ${exception.message}`,
                };
            }
            return response.status(status).json({
                success: false,
                ...responseBody,
            });
        }
        if (isObject(exceptionResponse)) {
            responseBody = exceptionResponse;
        }
        else if (isString(exceptionResponse)) {
            responseBody = {
                message: exceptionResponse,
            };
        }
        else {
            responseBody = {
                message: 'Internal Server Error',
            };
        }
        if (status >= 500) {
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
        }
        response.status(status).json({
            success: false,
            ...responseBody,
        });
    }
};
exports.CustomExceptionFilter = CustomExceptionFilter;
exports.CustomExceptionFilter = CustomExceptionFilter = CustomExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], CustomExceptionFilter);
//# sourceMappingURL=custom-exception.filter.js.map