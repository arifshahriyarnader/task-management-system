CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER')),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'DONE')),
        assigned_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
        created_by UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        actor_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        action_type VARCHAR(50) NOT NULL CHECK (
            action_type IN (
                'TASK_CREATED',
                'TASK_UPDATED',
                'TASK_DELETED',
                'TASK_ASSIGNED',
                'TASK_STATUS_CHANGED'
            )
        ),
        entity_type VARCHAR(50) NOT NULL DEFAULT 'TASK',
        entity_id UUID NOT NULL,
        before_data JSONB,
        after_data JSONB,
        created_at TIMESTAMP DEFAULT NOW ()
    );

INSERT INTO
    users (name, email, password_hash, role)
VALUES
    (
        'Admin User',
        'admin@taskapp.com',
        '$2b$10$Ky36V8dyx9RZaoNRV/2ff.CQHi95TJTo9VfdWPD8IVBOq6vr1MEky',
        'ADMIN'
    ) ON CONFLICT (email) DO NOTHING;

INSERT INTO
    users (name, email, password_hash, role)
VALUES
    (
        'User 1',
        'user1@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 2',
        'user2@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 3',
        'user3@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 4',
        'user4@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 5',
        'user5@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 6',
        'user6@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 7',
        'user7@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 8',
        'user8@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 9',
        'user9@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ),
    (
        'User 10',
        'user10@taskapp.com',
        '$2b$10$71YznL2ijvmHZRtwnu29kutzJJY1kZ.Nhd4gwqltfOBwYGHSzZmgy',
        'USER'
    ) ON CONFLICT (email) DO NOTHING;