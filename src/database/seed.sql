/**
 * Seed script — inserts initial test data.
 * Run after schema.sql is applied.
 *
 * Usage:
 *   psql -U postgres -d skillswap -f src/database/seed.sql
 */

-- Create two test users (passwords are bcrypt hashes of 'password123')
INSERT INTO users (full_name, email, password_hash, skill_points)
VALUES
  ('Alice Smith', 'alice@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 100),
  ('Bob Jones', 'bob@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 100),
  ('Charlie Brown', 'charlie@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 100);

-- Create a sample open task from Alice (offering 30 points)
INSERT INTO tasks (title, description, points_offered, creator_id, status)
VALUES
  ('Need help with Next.js styling', 'I need someone to help me style my Next.js dashboard with Tailwind CSS.', 30, 1, 'OPEN'),
  ('Logo design needed', 'Looking for a creative designer to create a modern logo.', 50, 2, 'OPEN');
