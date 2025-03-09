/*
  # Fix RLS policies for profiles table

  1. Changes
    - Add policy for users to insert their own profiles
    - Make profiles viewable by everyone
    - Ensure policies are only created if they don't already exist
*/

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone"
          ON profiles
          FOR SELECT
          USING (true);
    END IF;
END
$$;

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile"
          ON profiles
          FOR INSERT
          WITH CHECK (auth.uid() = id);
    END IF;
END
$$;

-- No need to recreate the update policy as it already exists