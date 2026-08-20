// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _appconfig = /*#__PURE__*/ _interop_require_default(require("./config/app.config"));
const _loggermiddleware = require("./common/middleware/logger.middleware");
const _databasemodule = require("./database/database.module");
const _authmodule = require("./modules/auth/auth.module");
const _usersmodule = require("./modules/users/users.module");
const _tasksmodule = require("./modules/tasks/tasks.module");
const _transactionsmodule = require("./modules/transactions/transactions.module");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(_loggermiddleware.LoggerMiddleware).forRoutes('*');
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    _appconfig.default
                ]
            }),
            _databasemodule.DatabaseModule,
            _jwt.JwtModule.registerAsync({
                global: true,
                useFactory: ()=>({
                        secret: process.env.JWT_SECRET,
                        signOptions: {
                            expiresIn: process.env.JWT_EXPIRY || '30d'
                        }
                    })
            }),
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _tasksmodule.TasksModule,
            _transactionsmodule.TransactionsModule
        ],
        controllers: [],
        providers: []
    })
], AppModule);

//# sourceMappingURL=app.module.js.map