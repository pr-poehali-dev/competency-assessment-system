CREATE TABLE IF NOT EXISTS t_p56928299_competency_assessmen.warranty_claims (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    agency VARCHAR(255) NOT NULL,
    hire_date DATE,
    fire_date DATE,
    tenure_months NUMERIC(4,1),
    recruitment_cost NUMERIC(12,2),
    guarantee_months INTEGER,
    claim_status VARCHAR(32) NOT NULL DEFAULT 'not_filed',
    claim_date DATE,
    deadline DATE,
    replacement_date DATE,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_warranty_claims_status ON t_p56928299_competency_assessmen.warranty_claims (claim_status);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_agency ON t_p56928299_competency_assessmen.warranty_claims (agency);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_deadline ON t_p56928299_competency_assessmen.warranty_claims (deadline);