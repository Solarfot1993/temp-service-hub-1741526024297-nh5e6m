import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendMessage } from '../services/messageService';

interface MessageButtonProps {
  recipientId: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  label?: string;
  serviceId?: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  recipientId,
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true,
  label = 'Message',
  serviceId
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const baseClasses = 'flex items-center justify-center rounded-md transition-colors';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/login', { state: { redirectTo: `/messages/${recipientId}` } });
      return;
    }
    
    // If this is a new conversation and we have a serviceId, create a lead message
    if (serviceId) {
      try {
        // Send an initial message as a lead
        await sendMessage(
          user.id,
          recipientId,
          "I'm interested in your service. Can you provide more information?",
          serviceId,
          true // Mark as lead
        );
      } catch (error) {
        console.error("Error creating lead message:", error);
      }
    }
    
    // Navigate to the messages page
    navigate(`/messages/${recipientId}`);
  };
  
  return (
    <button onClick={handleClick} className={buttonClasses}>
      {showIcon && <MessageSquare size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="mr-1" />}
      {label}
    </button>
  );
};

export default MessageButton;