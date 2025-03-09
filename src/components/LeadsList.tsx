import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Clock, Tag, DollarSign, Zap } from 'lucide-react';
import { Lead } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LeadsListProps {
  leads: Lead[];
  type: 'direct' | 'opportunity';
  onRefresh: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, type, onRefresh }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleContactCustomer = (lead: Lead) => {
    navigate(`/messages/${lead.userId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          {type === 'direct' 
            ? 'No direct leads at the moment. When customers contact you, they will appear here.'
            : 'No opportunity leads available. Check back later for leads that other providers haven\'t responded to.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-800">{lead.userName}</h3>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  type === 'direct' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {type === 'direct' ? 'Direct Lead' : 'Opportunity'}
                </span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Clock size={14} className="mr-1" />
                <span>{formatTimeAgo(lead.createdAt)}</span>
                {lead.serviceId && (
                  <>
                    <span className="mx-2">•</span>
                    <Tag size={14} className="mr-1" />
                    <span>{lead.serviceCategory || 'Service Request'}</span>
                  </>
                )}
                {type === 'opportunity' && lead.price && (
                  <>
                    <span className="mx-2">•</span>
                    <DollarSign size={14} className="mr-1" />
                    <span>${lead.price.toFixed(2)} per response</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => handleContactCustomer(lead)}
              className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <MessageSquare size={16} className="mr-1" />
              {type === 'direct' ? 'Respond' : 'Contact Customer'}
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-gray-700">{lead.content}</p>
          </div>
          
          {type === 'direct' && (
            <div className="mt-3 text-sm text-gray-500 flex items-center">
              <Zap size={14} className="mr-1 text-yellow-500" />
              <span>Respond within 3 hours to keep this lead exclusive</span>
            </div>
          )}
          
          {type === 'opportunity' && (
            <div className="mt-3 text-sm text-gray-500">
              <p>This lead is available to all service providers in your category.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeadsList;