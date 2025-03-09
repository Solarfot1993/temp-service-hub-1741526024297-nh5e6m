import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { markLeadAsResponded } from '../services/messageService';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  isLead?: boolean;
  leadId?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  isLead = false,
  leadId
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      // If this is a response to a lead, mark it as responded
      if (isLead && leadId) {
        try {
          await markLeadAsResponded(leadId);
        } catch (error) {
          console.error('Error marking lead as responded:', error);
        }
      }

      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={disabled}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-md ${
            disabled || !message.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
          disabled={disabled || !message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;