

-- name: findByEmailExists
SELECT id FROM users WHERE email = $1;

-- name: findUserWithPassword
SELECT id, full_name, email, password_hash, skill_points, created_at
FROM users WHERE email = $1;

-- name: insertUser
INSERT INTO users (full_name, email, password_hash, skill_points)
VALUES ($1, $2, $3, 100)
RETURNING id, full_name, email, skill_points, created_at;

-- name: findUserById
SELECT id, full_name, email, skill_points, created_at, updated_at
FROM users WHERE id = $1;
