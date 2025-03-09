/*
  # Add Portfolio Items Table

  1. New Tables
    - `portfolio_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `service_id` (uuid, foreign key to services, optional)
      - `title` (text)
      - `description` (text, optional)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `portfolio_items` table
    - Add policies for authenticated users to manage their own portfolio items
    - Add policy for public read access to portfolio items
*/

-- Create portfolio_items table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS portfolio_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id uuid REFERENCES services(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_portfolio_items_service_id ON portfolio_items(service_id);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read access to portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Users can create their own portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Users can update their own portfolio items" ON portfolio_items;
  DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON portfolio_items;
END $$;

-- Create new policies
CREATE POLICY "Public read access to portfolio items"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own portfolio items"
  ON portfolio_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items"
  ON portfolio_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
  ON portfolio_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);