/*
  # Update Service Schema for Project Types and Pricing

  1. Changes
    - Add project_type column if it doesn't exist
    - Add minimum_charge column if it doesn't exist
    - Add daily_rate column if it doesn't exist
    - Update existing services to use new pricing model
    - Add constraint for valid project types

  2. Safety
    - Uses DO blocks to safely check for column existence
    - Handles existing data migration
    - Adds constraints only if they don't exist
*/

-- Safely add new columns
DO $$
BEGIN
  -- Add project_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'project_type'
  ) THEN
    ALTER TABLE services ADD COLUMN project_type TEXT NOT NULL DEFAULT 'hourly';
  END IF;

  -- Add minimum_charge column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'minimum_charge'
  ) THEN
    ALTER TABLE services ADD COLUMN minimum_charge NUMERIC NOT NULL DEFAULT 0;
  END IF;

  -- Add daily_rate column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'daily_rate'
  ) THEN
    ALTER TABLE services ADD COLUMN daily_rate NUMERIC;
  END IF;
END $$;

-- Update existing services to use minimum_charge if price column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'price'
  ) THEN
    -- Update minimum_charge from price
    UPDATE services
    SET minimum_charge = price,
        project_type = 'hourly'
    WHERE minimum_charge = 0;

    -- Drop the price column
    ALTER TABLE services DROP COLUMN price;
  END IF;
END $$;

-- Add check constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'services' AND constraint_name = 'valid_project_type'
  ) THEN
    ALTER TABLE services
    ADD CONSTRAINT valid_project_type CHECK (project_type IN ('hourly', 'daily', 'project'));
  END IF;
END $$;