/*
  # Add Profile Columns Migration

  1. Changes
    - Add `location` column to profiles table
    - Add `phone` column to profiles table
    - Add `weekly_budget` column to profiles table
    - Add `max_lead_price` column to profiles table
    - Add `lead_balance` column to profiles table

  2. Notes
    - All columns are nullable to maintain backward compatibility
    - Default values set for budget-related columns
*/

-- Add new columns to profiles table
DO $$ BEGIN
  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  -- Add weekly_budget column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'weekly_budget'
  ) THEN
    ALTER TABLE profiles ADD COLUMN weekly_budget numeric DEFAULT 100;
  END IF;

  -- Add max_lead_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'max_lead_price'
  ) THEN
    ALTER TABLE profiles ADD COLUMN max_lead_price numeric DEFAULT 10;
  END IF;

  -- Add lead_balance column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'lead_balance'
  ) THEN
    ALTER TABLE profiles ADD COLUMN lead_balance numeric DEFAULT 0;
  END IF;
END $$;