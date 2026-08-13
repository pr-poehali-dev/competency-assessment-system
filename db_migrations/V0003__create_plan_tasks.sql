CREATE TABLE IF NOT EXISTS t_p56928299_competency_assessmen.plan_tasks (
    task_id VARCHAR(16) PRIMARY KEY,
    status VARCHAR(16) NOT NULL DEFAULT 'todo',
    note TEXT NOT NULL DEFAULT '',
    author VARCHAR(120) NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_tasks_updated ON t_p56928299_competency_assessmen.plan_tasks (updated_at DESC);