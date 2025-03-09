/*
  # Add Payment Methods Table Migration

  1. New Tables
    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text: 'card', 'bank', 'mobile')
      - `data` (jsonb, stores payment details)
      - `is_default` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on payment_methods table
    - Add policies for authenticated users to manage their payment methods

  3. Constraints
    - Foreign key to profiles table
    - Check constraint on payment type
*/

-- Create payment_methods table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('card', 'bank', 'mobile')),
    data jsonb NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create index if it doesn't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;
END $$;

-- Create policies
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS ensure_single_default_payment_method ON payment_methods;
DROP FUNCTION IF EXISTS update_default_payment_method();

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION update_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE payment_methods
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to manage default payment methods
CREATE TRIGGER ensure_single_default_payment_method
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_default_payment_method();