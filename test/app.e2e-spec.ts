import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './../src/database/database.module';
import { DatabaseService } from './../src/database/database.service';
import { AuthModule } from './../src/modules/auth/auth.module';
import { TasksModule } from './../src/modules/tasks/tasks.module';
import appConfig from './../src/config/app.config';

describe('SkillSwap Ledger (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
        JwtModule.register({
          global: true,
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        DatabaseModule,
        AuthModule,
        TasksModule,
      ],
    }).compile();

    db = moduleFixture.get<DatabaseService>(DatabaseService);
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    // Ensure schema exists for testing
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        skill_points INT DEFAULT 100 CHECK (skill_points >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.query(`
      DO $$ BEGIN
        CREATE TYPE task_status AS ENUM ('OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED');
        EXCEPTION WHEN duplicate_type THEN NULL;
      END $$;
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        points_offered INT NOT NULL CHECK (points_offered > 0),
        creator_id INT REFERENCES users(id) ON DELETE CASCADE,
        assignee_id INT REFERENCES users(id) ON DELETE SET NULL,
        status task_status DEFAULT 'OPEN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS point_transactions (
        id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES users(id) ON DELETE SET NULL,
        receiver_id INT REFERENCES users(id) ON DELETE SET NULL,
        task_id INT REFERENCES tasks(id) ON DELETE SET NULL,
        amount INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  afterAll(async () => {
    await db.query('DROP TABLE IF EXISTS point_transactions;');
    await db.query('DROP TABLE IF EXISTS tasks;');
    await db.query('DROP TABLE IF EXISTS users;');
    await db.query('DROP TYPE IF EXISTS task_status;');
    await app.close();
  });

  it('should register a new user (POST /api/auth/register)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'P@ssw0rd123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skill_points).toBe(100);
    expect(res.body.data.access_token).toBeDefined();
  });
});

