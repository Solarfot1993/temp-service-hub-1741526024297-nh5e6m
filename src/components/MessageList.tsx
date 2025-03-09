import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Message } from '../types';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock } from 'lucide-react';
import { markLeadAsResponded } from '../services/messageService';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getLeadStatus = (message: Message) => {
    if (!message.isLead) return null;

    const messageTime = new Date(message.createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    const remainingTime = Math.max(0, 3 - hoursElapsed);

    if (message.leadStatus === 'responded') {
      return (
        <div className="flex items-center text-green-600 text-xs mt-1">
          <Zap size={12} className="mr-1" />
          Responded
        </div>
      );
    } else if (message.leadStatus === 'opportunity') {
      return (
        <div className="flex items-center text-yellow-600 text-xs mt-1">
          <Zap size={12} className="mr-1" />
          Opportunity Lead
        </div>
      );
    } else if (message.leadStatus === 'direct' && remainingTime > 0) {
      return (
        <div className="flex items-center text-indigo-600 text-xs mt-1">
          <Clock size={12} className="mr-1" />
          {`Direct Lead (${Math.floor(remainingTime)}h ${Math.floor((remainingTime % 1) * 60)}m remaining)`}
        </div>
      );
    }
    return null;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === user?.id;
          const leadStatus = getLeadStatus(message);
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end">
                {!isCurrentUser && (
                  <img
                    src={message.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderName || '')}&background=random`}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                  {leadStatus}
                </div>
                {isCurrentUser && (
                  <img
                    src={message.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderName || '')}&background=random`}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;