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