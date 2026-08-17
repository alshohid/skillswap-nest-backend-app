import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  app: {
    name: process.env.APP_NAME || 'SkillSwap Ledger',
    port: parseInt(process.env.PORT, 10) || 4000,
    url: process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`,
    client_app_url: process.env.CLIENT_APP_URL || 'http://localhost:3000',
  },

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'skillswap',
    max: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  security: {
    salt: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiry: process.env.JWT_EXPIRY || '30d',
  },
});
