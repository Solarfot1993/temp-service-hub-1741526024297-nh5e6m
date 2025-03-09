/*
  # Update RLS Policies for Leads and Messages

  1. Changes
    - Add new RLS policies for leads and messages tables
    - Update existing policies to handle lead-related access
    - Add stored procedure for handling lead messages

  2. Security
    - Providers can view their direct leads
    - Providers can view opportunity leads in their categories
    - Providers can view and respond to lead messages
    - Users can view their own leads and messages

  3. Notes
    - Existing policies will be dropped and recreated
    - New stored procedure for handling lead messages
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view leads they created" ON leads;
DROP POLICY IF EXISTS "Providers can view leads assigned to them" ON leads;
DROP POLICY IF EXISTS "Users can create leads" ON leads;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

-- Create new policies for leads
CREATE POLICY "Providers can view their direct leads"
ON leads FOR SELECT
USING (auth.uid() = initial_provider_id);

CREATE POLICY "Providers can view opportunity leads"
ON leads FOR SELECT
USING (
  status = 'opportunity' AND
  service_id IN (
    SELECT s.id FROM services s
    WHERE s.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own leads"
ON leads FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Users can create leads"
ON leads FOR INSERT
WITH CHECK (customer_id = auth.uid());

-- Create new policies for messages
CREATE POLICY "Providers can view messages for their leads"
ON messages FOR SELECT
USING (
  lead_id IN (
    SELECT id FROM leads
    WHERE initial_provider_id = auth.uid()
    OR (
      status = 'opportunity' AND
      service_id IN (
        SELECT s.id FROM services s
        WHERE s.provider_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can view their lead messages"
ON messages FOR SELECT
USING (
  lead_id IN (
    SELECT id FROM leads
    WHERE customer_id = auth.uid()
  )
);

CREATE POLICY "Providers can insert message responses"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  NOT is_from_customer AND
  lead_id IN (
    SELECT id FROM leads
    WHERE initial_provider_id = auth.uid()
    OR (
      status = 'opportunity' AND
      service_id IN (
        SELECT s.id FROM services s
        WHERE s.provider_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can insert lead messages"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  is_from_customer AND
  lead_id IN (
    SELECT id FROM leads
    WHERE customer_id = auth.uid()
  )
);

-- Create stored procedure for handling lead messages
CREATE OR REPLACE FUNCTION handle_lead_message(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_content TEXT,
  p_service_id UUID DEFAULT NULL,
  p_is_lead BOOLEAN DEFAULT FALSE
) RETURNS JSON AS $$
DECLARE
  v_lead_id UUID;
  v_message_id UUID;
  v_exclusivity_time TIMESTAMP WITH TIME ZONE;
BEGIN
  IF p_is_lead THEN
    -- Set exclusivity expiration (3 hours from now)
    v_exclusivity_time := NOW() + INTERVAL '3 hours';
    
    -- Create the lead
    INSERT INTO leads (
      customer_id,
      service_id,
      initial_provider_id,
      status,
      exclusivity_expires_at
    ) VALUES (
      p_sender_id,
      p_service_id,
      p_recipient_id,
      'direct',
      v_exclusivity_time
    ) RETURNING id INTO v_lead_id;
  END IF;
  
  -- Create the message
  INSERT INTO messages (
    lead_id,
    sender_id,
    recipient_id,
    content,
    is_from_customer,
    is_lead,
    lead_status,
    created_at
  ) VALUES (
    v_lead_id,
    p_sender_id,
    p_recipient_id,
    p_content,
    TRUE,
    p_is_lead,
    CASE WHEN p_is_lead THEN 'direct' ELSE NULL END,
    NOW()
  ) RETURNING id INTO v_message_id;
  
  RETURN json_build_object(
    'lead_id', v_lead_id,
    'message_id', v_message_id,
    'exclusivity_expires_at', v_exclusivity_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create stored procedure for marking leads as responded
CREATE OR REPLACE FUNCTION mark_lead_responded(
  p_message_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_lead_id UUID;
BEGIN
  -- Get the lead ID from the message
  SELECT lead_id INTO v_lead_id
  FROM messages
  WHERE id = p_message_id;
  
  -- Update the lead status
  UPDATE leads
  SET status = 'converted'
  WHERE id = v_lead_id;
  
  -- Update the message
  UPDATE messages
  SET lead_status = 'responded',
      responded_at = NOW()
  WHERE lead_id = v_lead_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;