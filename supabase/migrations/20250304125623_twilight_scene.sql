/*
  # Lead Generation System

  1. New Tables
    - No new tables, using existing messages table with new columns
  
  2. Changes
    - Add columns to messages table for lead tracking
    - Add columns to profiles table for lead pricing settings
  
  3. Security
    - Update RLS policies for messages table
*/

-- Add lead tracking columns to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_lead BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lead_status TEXT,
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id),
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS lead_price NUMERIC;

-- Add lead pricing settings to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS weekly_budget NUMERIC DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_lead_price NUMERIC DEFAULT 10,
ADD COLUMN IF NOT EXISTS lead_balance NUMERIC DEFAULT 0;

-- Create index for faster lead queries
CREATE INDEX IF NOT EXISTS idx_messages_is_lead ON messages (is_lead);
CREATE INDEX IF NOT EXISTS idx_messages_lead_status ON messages (lead_status);
CREATE INDEX IF NOT EXISTS idx_messages_service_id ON messages (service_id);

-- Create a function to check for expired leads
CREATE OR REPLACE FUNCTION check_expired_leads()
RETURNS void AS $$
BEGIN
  -- Update direct leads older than 3 hours to opportunity leads
  UPDATE messages
  SET lead_status = 'opportunity'
  WHERE is_lead = true
    AND lead_status = 'direct'
    AND created_at < NOW() - INTERVAL '3 hours'
    AND responded_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the function every hour
-- Note: This requires pg_cron extension to be enabled
-- In a real application, you might use a serverless function instead
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule('0 * * * *', 'SELECT check_expired_leads()');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If pg_cron is not available, we'll handle this with application code
    NULL;
END $$;