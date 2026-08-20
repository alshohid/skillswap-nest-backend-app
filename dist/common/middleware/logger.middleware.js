"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggerMiddleware", {
    enumerable: true,
    get: function() {
        return LoggerMiddleware;
    }
});
const _common = require("@nestjs/common");
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
let LoggerMiddleware = class LoggerMiddleware {
    use(req, res, next) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '-';
        // Log incoming request
        this.logger.debug(`${method} ${originalUrl} - ${ip} - ${userAgent}`);
        // Log response time
        const startTime = Date.now();
        res.on('finish', ()=>{
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            this.logger.debug(`${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
        });
        next();
    }
    constructor(){
        this.logger = new _common.Logger(LoggerMiddleware.name);
    }
};
LoggerMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], LoggerMiddleware);

//# sourceMappingURL=logger.middleware.js.map