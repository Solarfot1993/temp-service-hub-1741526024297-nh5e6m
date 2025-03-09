import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types';

export const sendMessage = async (senderId: string, recipientId: string, content: string, serviceId?: string, isLead: boolean = false) => {
  try {
    const { data, error } = await supabase
      .rpc('handle_lead_message', {
        p_sender_id: senderId,
        p_recipient_id: recipientId,
        p_content: content,
        p_service_id: serviceId,
        p_is_lead: isLead
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markLeadAsResponded = async (messageId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('mark_lead_responded', {
        p_message_id: messageId
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking lead as responded:', error);
    throw error;
  }
};

export const fetchConversations = async (userId: string) => {
  try {
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        read,
        is_lead,
        lead_status,
        recipient:recipient_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (sentError) throw sentError;

    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        read,
        is_lead,
        lead_status,
        sender:sender_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (receivedError) throw receivedError;

    // Process conversations
    const conversationsMap = new Map<string, Conversation>();

    // Process sent messages
    sentMessages?.forEach(message => {
      const otherUserId = message.recipient.id;
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.recipient.full_name,
          userAvatar: message.recipient.avatar_url,
          lastMessage: message.content,
          lastMessageDate: message.created_at,
          unreadCount: 0,
          isLead: message.is_lead,
          leadStatus: message.lead_status
        });
      }
    });

    // Process received messages
    receivedMessages?.forEach(message => {
      const otherUserId = message.sender.id;
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.sender.full_name,
          userAvatar: message.sender.avatar_url,
          lastMessage: message.content,
          lastMessageDate: message.created_at,
          unreadCount: message.read ? 0 : 1,
          isLead: message.is_lead,
          leadStatus: message.lead_status
        });
      } else {
        const existing = conversationsMap.get(otherUserId)!;
        if (new Date(message.created_at) > new Date(existing.lastMessageDate || '')) {
          existing.lastMessage = message.content;
          existing.lastMessageDate = message.created_at;
          existing.isLead = message.is_lead;
          existing.leadStatus = message.lead_status;
          if (!message.read) {
            existing.unreadCount += 1;
          }
          conversationsMap.set(otherUserId, existing);
        }
      }
    });

    return Array.from(conversationsMap.values())
      .sort((a, b) => {
        const dateA = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
        const dateB = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
        return dateB - dateA;
      });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchMessages = async (userId: string, otherUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        read,
        is_lead,
        lead_status,
        service_id,
        created_at,
        responded_at,
        sender:sender_id (
          full_name,
          avatar_url
        ),
        recipient:recipient_id (
          full_name,
          avatar_url
        )
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Transform to Message type
    const messages: Message[] = data.map(item => ({
      id: item.id,
      senderId: item.sender_id,
      senderName: item.sender.full_name,
      senderAvatar: item.sender.avatar_url,
      recipientId: item.recipient_id,
      recipientName: item.recipient.full_name,
      recipientAvatar: item.recipient.avatar_url,
      content: item.content,
      read: item.read,
      isLead: item.is_lead,
      leadStatus: item.lead_status,
      serviceId: item.service_id,
      createdAt: item.created_at,
      respondedAt: item.responded_at
    }));

    // Mark unread messages as read
    const unreadMessageIds = data
      .filter(message => message.recipient_id === userId && !message.read)
      .map(message => message.id);

    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessageIds);
    }

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getUnreadMessageCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};