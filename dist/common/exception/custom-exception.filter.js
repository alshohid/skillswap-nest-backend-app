"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomExceptionFilter", {
    enumerable: true,
    get: function() {
        return CustomExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _multer = require("multer");
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
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function isString(value) {
    return typeof value === 'string';
}
let CustomExceptionFilter = class CustomExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        let status = exception.getStatus();
        let responseBody;
        const exceptionResponse = exception?.getResponse();
        // Handle Multer file errors
        if (exception instanceof _multer.MulterError) {
            if (exception.code === 'LIMIT_FILE_SIZE') {
                status = 400;
                responseBody = {
                    message: 'File too large. Maximum allowed size exceeded.'
                };
            } else {
                responseBody = {
                    message: `File upload error: ${exception.message}`
                };
            }
            return response.status(status).json({
                success: false,
                ...responseBody
            });
        }
        if (isObject(exceptionResponse)) {
            responseBody = exceptionResponse;
        } else if (isString(exceptionResponse)) {
            responseBody = {
                message: exceptionResponse
            };
        } else {
            responseBody = {
                message: 'Internal Server Error'
            };
        }
        // Log unexpected errors (non-4xx) for debugging
        if (status >= 500) {
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
        }
        response.status(status).json({
            success: false,
            ...responseBody
        });
    }
    constructor(){
        this.logger = new _common.Logger(CustomExceptionFilter.name);
    }
};
CustomExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_common.HttpException)
], CustomExceptionFilter);

//# sourceMappingURL=custom-exception.filter.js.map