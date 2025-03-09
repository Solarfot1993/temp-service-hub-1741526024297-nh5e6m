import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchConversations, fetchMessages, sendMessage } from '../services/messageService';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { Conversation, Message } from '../types';
import { ArrowLeft } from 'lucide-react';

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(userId || null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchConversations(user.id);
        setConversations(data);
        
        // If no active conversation is set but we have conversations, set the first one as active
        if (!activeConversation && data.length > 0) {
          setActiveConversation(data[0].userId);
          navigate(`/messages/${data[0].userId}`);
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversations');
        setLoading(false);
      }
    };
    
    loadConversations();
    
    // Set up polling for new messages
    const intervalId = setInterval(loadConversations, 10000);
    
    return () => clearInterval(intervalId);
  }, [user, navigate]);
  
  useEffect(() => {
    if (!user || !activeConversation) return;
    
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(user.id, activeConversation);
        setMessages(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
      }
    };
    
    loadMessages();
    
    // Set up polling for new messages in the active conversation
    const intervalId = setInterval(loadMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [user, activeConversation]);
  
  useEffect(() => {
    // Update active conversation when URL param changes
    if (userId) {
      setActiveConversation(userId);
    }
  }, [userId]);
  
  const handleSelectConversation = (userId: string) => {
    setActiveConversation(userId);
    navigate(`/messages/${userId}`);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!user || !activeConversation) return;
    
    try {
      setSending(true);
      await sendMessage(user.id, activeConversation, content);
      
      // Refresh messages
      const data = await fetchMessages(user.id, activeConversation);
      setMessages(data);
      
      // Refresh conversations
      const conversationsData = await fetchConversations(user.id);
      setConversations(conversationsData);
      
      setSending(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setSending(false);
    }
  };
  
  if (!user) {
    return null; // This should be handled by the ProtectedRoute component
  }
  
  const activeUser = conversations.find(c => c.userId === activeConversation);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations sidebar */}
          <div className="border-r border-gray-200 md:col-span-1">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
              />
            )}
          </div>
          
          {/* Message area */}
          <div className="flex flex-col md:col-span-2">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <button
                    onClick={() => navigate('/messages')}
                    className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  {activeUser && (
                    <div className="flex items-center">
                      <img
                        src={activeUser.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.userName)}&background=random`}
                        alt={activeUser.userName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{activeUser.userName}</h3>
                      </div>
                    </div>
                  )}
                </div>
                
                <MessageList messages={messages} />
                
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={sending}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default Messages;