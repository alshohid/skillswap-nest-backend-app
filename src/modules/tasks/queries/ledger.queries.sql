-- ============================================================
-- Tasks Module — SkillPoint Ledger Queries
-- ------------------------------------------------------------
-- Used inside the `completeTask` ACID transaction. These statements
-- lock user rows and move points, so they always run on the SAME
-- transaction client via TasksRepository.qTx().
-- Loaded by TasksRepository (which extends BaseRepository).
-- ============================================================

-- name: lockUserById
SELECT skill_points FROM users WHERE id = $1 FOR UPDATE;

-- name: deductPoints
UPDATE users
SET skill_points = skill_points - $1, updated_at = NOW()
WHERE id = $2;

-- name: creditPoints
UPDATE users
SET skill_points = skill_points + $1, updated_at = NOW()
WHERE id = $2;

-- name: insertPointTransaction
INSERT INTO point_transactions (sender_id, receiver_id, task_id, amount)
VALUES ($1, $2, $3, $4);
