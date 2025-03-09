import { supabase } from '../lib/supabase';

// Send message and create lead for authenticated users
export const sendAuthenticatedMessage = async (serviceId: string, providerId: string, content: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const { data, error } = await supabase
      .rpc('create_lead_with_message', {
        p_customer_id: user.id,
        p_customer_email: null,
        p_customer_name: null,
        p_customer_phone: null,
        p_service_id: serviceId,
        p_provider_id: providerId,
        p_message_content: content,
        p_is_anonymous: false
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending authenticated message:', error);
    throw error;
  }
};

// Send message and create lead for anonymous users
export const sendAnonymousMessage = async (
  serviceId: string,
  providerId: string,
  content: string,
  customerEmail: string,
  customerName: string,
  customerPhone: string | null = null
) => {
  try {
    const { data, error } = await supabase
      .rpc('create_lead_with_message', {
        p_customer_id: null,
        p_customer_email: customerEmail,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_service_id: serviceId,
        p_provider_id: providerId,
        p_message_content: content,
        p_is_anonymous: true
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending anonymous message:', error);
    throw error;
  }
};

// Check and update expired leads
export const checkExpiredLeads = async () => {
  try {
    const { data: expiredLeads, error } = await supabase
      .from('leads')
      .select('id')
      .eq('status', 'direct')
      .lt('exclusivity_expires_at', new Date().toISOString());
    
    if (error) throw error;
    
    if (expiredLeads && expiredLeads.length > 0) {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'opportunity' })
        .in('id', expiredLeads.map(lead => lead.id));
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking expired leads:', error);
    throw error;
  }
};

// Fetch direct leads for a provider
export const fetchDirectLeads = async (providerId: string) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        service:service_id (
          title,
          category
        ),
        customer:customer_id (
          id,
          email,
          user_metadata->full_name
        )
      `)
      .eq('initial_provider_id', providerId)
      .eq('status', 'direct')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching direct leads:', error);
    throw error;
  }
};

// Fetch opportunity leads for a provider
export const fetchOpportunityLeads = async (providerId: string) => {
  try {
    // First get the provider's service categories
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('category')
      .eq('provider_id', providerId);
    
    if (servicesError) throw servicesError;
    
    const categories = [...new Set(services?.map(s => s.category))];
    
    // Then fetch leads in those categories
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        service:service_id (
          title,
          category
        ),
        customer:customer_id (
          id,
          email,
          user_metadata->full_name
        )
      `)
      .eq('status', 'opportunity')
      .in('service.category', categories)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching opportunity leads:', error);
    throw error;
  }
};

// Convert a lead
export const convertLead = async (leadId: string) => {
  try {
    const { error } = await supabase
      .from('leads')
      .update({
        status: 'converted',
        is_billed: true
      })
      .eq('id', leadId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error converting lead:', error);
    throw error;
  }
};