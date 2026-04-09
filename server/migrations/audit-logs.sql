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