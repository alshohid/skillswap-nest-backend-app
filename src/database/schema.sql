CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    skill_points INT DEFAULT 100 CHECK (skill_points >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE task_status AS ENUM ('OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED');

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    points_offered INT NOT NULL CHECK (points_offered > 0),
    creator_id INT REFERENCES users (id) ON DELETE CASCADE,
    assignee_id INT REFERENCES users (id) ON DELETE SET NULL,
    status task_status DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE application_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE task_applications (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks (id) ON DELETE CASCADE,
    applicant_id INT REFERENCES users (id) ON DELETE CASCADE,
    cover_letter TEXT,
    status application_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (task_id, applicant_id)
);

CREATE TABLE point_transactions (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users (id) ON DELETE SET NULL,
    receiver_id INT REFERENCES users (id) ON DELETE SET NULL,
    task_id INT REFERENCES tasks (id) ON DELETE SET NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);