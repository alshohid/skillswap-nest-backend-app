# SkillSwap Ledger

A professional NestJS project demonstrating **Raw SQL** data access (using `pg` — node-postgres) instead of Prisma. Users exchange skills via a **SkillPoint** economy with full ACID transaction safety.

## Architecture

```
skillswap-backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Entry point (Swagger, ValidationPipe, CORS, global filters)
│   ├── config/app.config.ts   # Structured environment configuration
│   ├── common/
│   │   ├── exception/
│   │   │   ├── custom-exception.filter.ts     # HttpException filter
│   │   │   └── postgres-exception.filter.ts   # pg QueryFailedError filter
│   │   ├── guards/
│   │   │   ├── auth.guard.ts   # JWT guard (no Passport needed)
│   │   │   └── public.guard.ts # @Public() decorator
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts  # @GetUser()
│   │   ├── middleware/
│   │   │   └── logger.middleware.ts
│   │   └── helpers/
│   │       └── date.helper.ts
│   ├── database/               # Raw SQL connection layer (replaces Prisma)
│   │   ├── database.module.ts  # @Global() module
│   │   ├── database.service.ts # pg Pool, query(), getClient()
│   │   ├── sql-query-loader.ts # Parses "-- name:" blocks from .sql files
│   │   ├── base.repository.ts  # Abstract BaseRepository (q() / qTx())
│   │   ├── schema.sql          # PostgreSQL DDL
│   │   └── seed.sql            # Seed data
│   └── modules/
│       ├── auth/               # Register, Login, JWT
│       │   ├── auth.repository.ts
│       │   └── queries/auth.queries.sql   # user lookup / insert
│       ├── users/              # Profile management
│       ├── tasks/              # Task CRUD + ACID point transfer
│       │   ├── tasks.repository.ts
│       │   └── queries/        # SQL split by concern (.sql files)
│       │       ├── tasks.queries.sql         # task lifecycle & listing
│       │       ├── applications.queries.sql  # applications & assignment
│       │       └── ledger.queries.sql        # SkillPoint ACID transfer
│       └── transactions/       # Ledger queries
├── .env
└── package.json
```

## Getting Started

```bash
cd skillswap-backend
npm install
cp .env .env.local
psql -U postgres -d skillswap -f src/database/schema.sql
npm run start:dev
```

API docs: `http://localhost:4000/api/docs`

## Key Patterns

- **DatabaseService** (`@Global`): wraps `pg.Pool` with `query()` and `getClient()` (for transactions)
- **Queries in `.sql` files**: SQL lives outside TypeScript, split by concern per module (see `tasks/queries/`), so it gets VS Code SQL highlighting and can be opened in a DB tool. Named blocks are introduced with `-- name: <queryName>`.
- **BaseRepository** (abstract): shared infra for raw-SQL repositories. Exposes `q(name, params)` for the pool and `qTx(name, params, client)` for queries inside an explicit transaction. Concrete repositories (e.g. `TasksRepository`) extend it, load their own `.sql` files, and expose typed domain methods.
- **SqlQueryLoader**: parses named query blocks, fails fast on duplicates.
- **Parameterized queries** (`$1, $2`) everywhere — no string interpolation
- **ACID Transaction**: `BEGIN / FOR UPDATE locks / COMMIT or ROLLBACK`
- **SQL Joins**: replaces Prisma `include` — full control over SELECT projections
- **PostgresExceptionFilter**: maps PG error codes (23505, 23503, etc.) to HTTP responses
# skillswap-nest-backend-app
