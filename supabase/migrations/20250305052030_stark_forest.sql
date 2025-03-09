-- Add new columns for project type and pricing
ALTER TABLE services
ADD COLUMN project_type TEXT NOT NULL DEFAULT 'hourly',
ADD COLUMN minimum_charge NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN daily_rate NUMERIC;

-- Update existing services to use minimum_charge
UPDATE services
SET minimum_charge = price,
    project_type = 'hourly';

-- Add check constraint for project_type
ALTER TABLE services
ADD CONSTRAINT valid_project_type CHECK (project_type IN ('hourly', 'daily', 'project'));