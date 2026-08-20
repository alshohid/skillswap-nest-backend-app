"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _dotenv = /*#__PURE__*/ _interop_require_wildcard(require("dotenv"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
_dotenv.config();
const _default = ()=>({
        app: {
            name: process.env.APP_NAME || 'SkillSwap Ledger',
            port: parseInt(process.env.PORT, 10) || 4000,
            url: process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`,
            client_app_url: process.env.CLIENT_APP_URL || 'http://localhost:3000'
        },
        database: {
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
            user: process.env.DATABASE_USER || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgres',
            name: process.env.DATABASE_NAME || 'skillswap',
            max: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        },
        security: {
            salt: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'your-super-secret-key',
            expiry: process.env.JWT_EXPIRY || '30d'
        }
    });

//# sourceMappingURL=app.config.js.map