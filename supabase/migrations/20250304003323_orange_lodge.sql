/*
  # Fix messages table policies

  This migration checks if policies already exist before creating them to avoid errors.
  It also adds a function to safely create sample data.
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Check if the "Users can view messages they sent or received" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' AND policyname = 'Users can view messages they sent or received'
  ) THEN
    CREATE POLICY "Users can view messages they sent or received"
      ON messages
      FOR SELECT
      TO authenticated
      USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
  END IF;

  -- Check if the "Users can send messages" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' AND policyname = 'Users can send messages'
  ) THEN
    CREATE POLICY "Users can send messages"
      ON messages
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = sender_id);
  END IF;

  -- Check if the "Users can mark messages as read if they are the recipient" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' AND policyname = 'Users can mark messages as read if they are the recipient'
  ) THEN
    -- The issue is with OLD and NEW references in the policy
    -- These are only valid in triggers, not in policies directly
    CREATE POLICY "Users can mark messages as read if they are the recipient"
      ON messages
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = recipient_id);
  END IF;
END
$$;

-- Create a function to safely create sample data without violating foreign key constraints
CREATE OR REPLACE FUNCTION create_sample_data_if_needed()
RETURNS void AS $$
BEGIN
  -- This function will be empty for now
  -- We'll add sample data through the application instead of migrations
  -- to avoid foreign key constraint issues
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_sample_data_if_needed();