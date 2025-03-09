/*
  # Add Leads and Messages Tables

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references auth.users)
      - `customer_email` (text)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `service_id` (uuid, references services)
      - `initial_provider_id` (uuid, references auth.users)
      - `status` (text, check constraint)
      - `is_billed` (boolean)
      - `exclusivity_expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `sender_id` (uuid, references auth.users)
      - `sender_email` (text)
      - `sender_name` (text)
      - `is_from_customer` (boolean)
      - `recipient_id` (uuid, references auth.users)
      - `content` (text)
      - `is_read` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id),
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  service_id UUID NOT NULL REFERENCES services(id),
  initial_provider_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('direct', 'opportunity', 'converted', 'expired')),
  is_billed BOOLEAN DEFAULT FALSE,
  exclusivity_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  sender_id UUID REFERENCES auth.users(id),
  sender_email TEXT,
  sender_name TEXT,
  is_from_customer BOOLEAN NOT NULL,
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view leads they created" ON leads;
DROP POLICY IF EXISTS "Providers can view leads assigned to them" ON leads;
DROP POLICY IF EXISTS "Users can create leads" ON leads;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

-- Create new policies
CREATE POLICY "Users can view leads they created"
  ON leads
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Providers can view leads assigned to them"
  ON leads
  FOR SELECT
  TO authenticated
  USING (initial_provider_id = auth.uid());

CREATE POLICY "Users can create leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can view messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Create stored procedure
CREATE OR REPLACE FUNCTION create_lead_with_message(
  p_customer_id UUID,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_service_id UUID,
  p_provider_id UUID,
  p_message_content TEXT,
  p_is_anonymous BOOLEAN
) RETURNS JSON AS $$
DECLARE
  v_lead_id UUID;
  v_message_id UUID;
  v_exclusivity_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set exclusivity expiration (3 hours from now)
  v_exclusivity_time := NOW() + INTERVAL '3 hours';
  
  -- Create the lead
  INSERT INTO leads (
    customer_id,
    customer_email,
    customer_name,
    customer_phone,
    service_id,
    initial_provider_id,
    status,
    exclusivity_expires_at
  ) VALUES (
    p_customer_id,
    p_customer_email,
    p_customer_name,
    p_customer_phone,
    p_service_id,
    p_provider_id,
    'direct',
    v_exclusivity_time
  ) RETURNING id INTO v_lead_id;
  
  -- Create the message
  INSERT INTO messages (
    lead_id,
    sender_id,
    sender_email,
    sender_name,
    is_from_customer,
    recipient_id,
    content
  ) VALUES (
    v_lead_id,
    p_customer_id,
    p_customer_email,
    p_customer_name,
    TRUE,
    p_provider_id,
    p_message_content
  ) RETURNING id INTO v_message_id;
  
  RETURN json_build_object(
    'lead_id', v_lead_id,
    'message_id', v_message_id,
    'exclusivity_expires_at', v_exclusivity_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;