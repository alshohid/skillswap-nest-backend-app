// external imports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _appmodule = require("./app.module");
const _customexceptionfilter = require("./common/exception/custom-exception.filter");
const _postgresexceptionfilter = require("./common/exception/postgres-exception.filter");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        rawBody: true
    });
    // Global API prefix
    app.setGlobalPrefix('api');
    // CORS
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001'
        ],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    });
    // Security headers
    app.use((0, _helmet.default)({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false
    }));
    // Global validation pipe
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    // Global exception filters
    app.useGlobalFilters(new _postgresexceptionfilter.PostgresExceptionFilter(), new _customexceptionfilter.CustomExceptionFilter());
    // Swagger
    const options = new _swagger.DocumentBuilder().setTitle('SkillSwap Ledger API').setDescription('A skill-based point exchange platform using Raw SQL').setVersion('1.0').addTag('skillswap').addBearerAuth().build();
    const document = _swagger.SwaggerModule.createDocument(app, options);
    _swagger.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 SkillSwap Ledger API running on http://localhost:${port}/api`);
    console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

//# sourceMappingURL=main.js.map