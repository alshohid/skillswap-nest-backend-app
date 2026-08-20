
INSERT INTO task_applications (task_id, applicant_id, cover_letter)
VALUES ($1, $2, $3)
RETURNING id, task_id, applicant_id, cover_letter, status, created_at;

-- name: findApplicationsByTask
SELECT
    ta.id, ta.cover_letter, ta.status, ta.created_at,
    u.full_name, u.email
FROM task_applications ta
JOIN users u ON ta.applicant_id = u.id
WHERE ta.task_id = $1
ORDER BY ta.created_at ASC;

-- name: findTaskForAssign
SELECT id, creator_id, status, assignee_id
FROM tasks WHERE id = $1;

-- name: findPendingApplication
SELECT id, applicant_id, status
FROM task_applications WHERE id = $1 AND task_id = $2;

-- name: updateApplicationStatus
UPDATE task_applications SET status = $1 WHERE id = $2;

-- name: assignTask
UPDATE tasks
SET assignee_id = $1, status = 'ASSIGNED', updated_at = NOW()
WHERE id = $2
RETURNING id, title, points_offered, assignee_id, status, updated_at;
