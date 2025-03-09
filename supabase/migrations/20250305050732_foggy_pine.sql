-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to portfolio items"
  ON portfolio_items
  FOR SELECT
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
  ON portfolio_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items (user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_service_id ON portfolio_items (service_id);