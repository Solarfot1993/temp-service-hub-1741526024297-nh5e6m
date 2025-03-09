/*
  # Update Messages Schema and Functions

  1. Changes
    - Add new columns to messages table:
      - `is_lead` (boolean)
      - `lead_status` (text)
      - `responded_at` (timestamptz)
    - Update existing messages table
    - Create new function for handling lead messages

  2. Security
    - Function runs with SECURITY DEFINER
    - Maintains existing RLS policies
*/

-- Add new columns to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_lead BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lead_status TEXT CHECK (lead_status IN ('direct', 'opportunity', 'responded', NULL)),
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

-- Create or replace the stored procedure
CREATE OR REPLACE FUNCTION handle_lead_message(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_content TEXT,
  p_service_id UUID,
  p_is_lead BOOLEAN DEFAULT FALSE
) RETURNS JSON AS $$
DECLARE
  v_message_id UUID;
  v_lead_status TEXT;
  v_exclusivity_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set initial values
  v_lead_status := CASE WHEN p_is_lead THEN 'direct' ELSE NULL END;
  v_exclusivity_time := CASE WHEN p_is_lead THEN NOW() + INTERVAL '3 hours' ELSE NULL END;
  
  -- Create the message
  INSERT INTO messages (
    sender_id,
    recipient_id,
    content,
    service_id,
    is_lead,
    lead_status,
    created_at,
    responded_at
  ) VALUES (
    p_sender_id,
    p_recipient_id,
    p_content,
    p_service_id,
    p_is_lead,
    v_lead_status,
    NOW(),
    NULL
  ) RETURNING id INTO v_message_id;
  
  -- Return the result
  RETURN json_build_object(
    'message_id', v_message_id,
    'lead_status', v_lead_status,
    'exclusivity_expires_at', v_exclusivity_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark lead as responded
CREATE OR REPLACE FUNCTION mark_lead_responded(
  p_message_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE messages
  SET 
    lead_status = 'responded',
    responded_at = NOW()
  WHERE 
    id = p_message_id 
    AND is_lead = TRUE 
    AND lead_status = 'direct';
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and update expired leads
CREATE OR REPLACE FUNCTION check_expired_leads() RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET lead_status = 'opportunity'
  WHERE 
    is_lead = TRUE 
    AND lead_status = 'direct'
    AND responded_at IS NULL
    AND created_at < NOW() - INTERVAL '3 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;