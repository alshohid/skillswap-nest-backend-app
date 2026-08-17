

-- name: findUserPoints
SELECT skill_points FROM users WHERE id = $1;

-- name: insertTask
INSERT INTO tasks (title, description, points_offered, creator_id)
VALUES ($1, $2, $3, $4)
RETURNING id, title, description, points_offered, creator_id, status, created_at;

-- name: countOpenTasks
SELECT COUNT(*) as total FROM tasks WHERE status = 'OPEN';

-- name: findOpenTasks
SELECT
    t.id, t.title, t.description, t.points_offered, t.status,
    t.creator_id, t.assignee_id, t.created_at, t.updated_at,
    c.full_name AS creator_name
FROM tasks t
JOIN users c ON t.creator_id = c.id
WHERE t.status = 'OPEN'
ORDER BY t.created_at DESC
LIMIT $1 OFFSET $2;

-- name: findTaskById
SELECT
    t.id, t.title, t.description, t.points_offered, t.status,
    t.creator_id, t.assignee_id,
    t.created_at, t.updated_at,
    c.full_name AS creator_name,
    a.full_name AS assignee_name
FROM tasks t
LEFT JOIN users c ON t.creator_id = c.id
LEFT JOIN users a ON t.assignee_id = a.id
WHERE t.id = $1;

-- name: findTaskBasic
SELECT creator_id, status FROM tasks WHERE id = $1;

-- name: findTaskCreator
SELECT creator_id FROM tasks WHERE id = $1;

-- name: lockTaskById
SELECT * FROM tasks WHERE id = $1 FOR UPDATE;

-- name: markTaskCompleted
UPDATE tasks SET status = 'COMPLETED', updated_at = NOW()
WHERE id = $1;

-- name: cancelTask
UPDATE tasks
SET status = 'CANCELLED', updated_at = NOW()
WHERE id = $1 AND creator_id = $2 AND status IN ('OPEN', 'ASSIGNED')
RETURNING id, status;
