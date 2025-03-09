import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDirectLeads, fetchOpportunityLeads } from '../services/leadService';
import { MessageSquare, Clock, Tag, DollarSign, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  created_at: string;
  customer_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  service: {
    title: string;
    category: string;
  };
  customer?: {
    id: string;
    email: string;
    full_name: string;
  };
  status: 'direct' | 'opportunity' | 'converted' | 'expired';
}

const ProviderLeads: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [directLeads, setDirectLeads] = useState<Lead[]>([]);
  const [opportunityLeads, setOpportunityLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'direct' | 'opportunity'>('direct');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadLeads = async () => {
      setLoading(true);
      try {
        if (activeTab === 'direct') {
          const leads = await fetchDirectLeads(user.id);
          setDirectLeads(leads);
        } else {
          const leads = await fetchOpportunityLeads(user.id);
          setOpportunityLeads(leads);
        }
      } catch (err: any) {
        console.error('Error loading leads:', err);
        setError(err.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    loadLeads();

    // Set up polling for new leads
    const interval = setInterval(loadLeads, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, activeTab]);

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
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const handleContactCustomer = (lead: Lead) => {
    const customerId = lead.customer_id || lead.customer?.id;
    if (customerId) {
      navigate(`/messages/${customerId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const leads = activeTab === 'direct' ? directLeads : opportunityLeads;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'direct'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Direct Leads
          </button>
          <button
            onClick={() => setActiveTab('opportunity')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'opportunity'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Opportunity Leads
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {leads.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {activeTab === 'direct' 
              ? 'No direct leads at the moment. When customers contact you, they will appear here.'
              : 'No opportunity leads available. Check back later for leads that other providers haven\'t responded to.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {lead.customer_name || lead.customer?.full_name || 'Anonymous User'}
                    </h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === 'direct' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activeTab === 'direct' ? 'Direct Lead' : 'Opportunity'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>{formatTimeAgo(lead.created_at)}</span>
                    {lead.service && (
                      <>
                        <span className="mx-2">•</span>
                        <Tag size={14} className="mr-1" />
                        <span>{lead.service.category}</span>
                      </>
                    )}
                    {activeTab === 'opportunity' && (
                      <>
                        <span className="mx-2">•</span>
                        <DollarSign size={14} className="mr-1" />
                        <span>$5 per response</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleContactCustomer(lead)}
                  className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <MessageSquare size={16} className="mr-1" />
                  {activeTab === 'direct' ? 'Respond' : 'Contact Customer'}
                </button>
              </div>

              {lead.service && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    Interested in: {lead.service.title}
                  </p>
                </div>
              )}

              {activeTab === 'direct' && (
                <div className="mt-3 text-sm text-gray-500 flex items-center">
                  <Zap size={14} className="mr-1 text-yellow-500" />
                  <span>Respond within 3 hours to keep this lead exclusive</span>
                </div>
              )}

              {activeTab === 'opportunity' && (
                <div className="mt-3 text-sm text-gray-500">
                  <p>This lead is available to all service providers in your category.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderLeads;