import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Conversation } from '../types';
import { Zap } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (userId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const getLeadIndicator = (conversation: Conversation) => {
    if (!conversation.isLead) return null;

    switch (conversation.leadStatus) {
      case 'direct':
        return (
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            Direct Lead
          </span>
        );
      case 'opportunity':
        return (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Opportunity
          </span>
        );
      case 'responded':
        return (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
            Responded
          </span>
        );
      default:
        return null;
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div
          key={conversation.userId}
          className={`p-4 cursor-pointer hover:bg-gray-50 ${
            activeConversation === conversation.userId ? 'bg-indigo-50' : ''
          }`}
          onClick={() => onSelectConversation(conversation.userId)}
        >
          <div className="flex items-start">
            <img
              src={conversation.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.userName)}&background=random`}
              alt={conversation.userName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.userName}
                </h3>
                {conversation.lastMessageDate && (
                  <span className="text-xs text-gray-500">
                    {formatDate(conversation.lastMessageDate)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage || 'No messages yet'}
              </p>
              {getLeadIndicator(conversation)}
            </div>
            {conversation.unreadCount > 0 && (
              <div className="ml-2 bg-indigo-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;