import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { MessageSquare, FileText } from 'lucide-react';
import ContactProviderForm from './ContactProviderForm';

interface BookingFormProps {
  service: Service;
}

type RequestType = 'message' | 'quote' | null;

const BookingForm: React.FC<BookingFormProps> = ({ service }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [projectDetails, setProjectDetails] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const providerId = service.providerName === 'CleanPro Services' ? '00000000-0000-0000-0000-000000000011' :
                        service.providerName === 'Quick Fix Plumbing' ? '00000000-0000-0000-0000-000000000012' :
                        service.providerName === 'Dr. Michael Chen' ? '00000000-0000-0000-0000-000000000013' :
                        service.providerName === 'Elena Rodriguez Photography' ? '00000000-0000-0000-0000-000000000014' :
                        service.providerName === 'Green Thumb Landscaping' ? '00000000-0000-0000-0000-000000000015' :
                        service.providerName === 'Bright Spark Electric' ? '00000000-0000-0000-0000-000000000016' :
                        service.providerName === 'Pristine Auto Detailing' ? '00000000-0000-0000-0000-000000000017' :
                        service.providerName === 'Digital Craft Studios' ? '00000000-0000-0000-0000-000000000018' :
                        service.providerName === 'Fitness With Sarah' ? '00000000-0000-0000-0000-000000000019' :
                        service.providerName === 'Tech Support Wizards' ? '00000000-0000-0000-0000-000000000020' :
                        '00000000-0000-0000-0000-000000000011';

      const message = requestType === 'message' ?
        `Hi, I'm interested in your ${service.title} service.\n\nProject Details: ${projectDetails}\nLocation: ${location}` :
        `I'd like to request a quote for ${service.title}.\n\nProject Details: ${projectDetails}\nDesired Timeline: ${timeline}\nBudget Range: ${budget}\nLocation: ${location}`;

      navigate(`/messages/${providerId}`, {
        state: {
          initialMessage: message
        }
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show the contact form
  if (!user) {
    return (
      <ContactProviderForm
        serviceId={service.id}
        providerId={getProviderId(service.providerName)}
        providerName={service.providerName}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Details</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 font-medium">Minimum Charge</p>
          <p className="text-2xl font-bold text-indigo-600">${service.minimumCharge}</p>
        </div>
      </div>

      {!requestType ? (
        <div className="space-y-4">
          <button
            onClick={() => setRequestType('message')}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <MessageSquare className="mr-2" size={20} />
            Message Pro
          </button>
          <button
            onClick={() => setRequestType('quote')}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <FileText className="mr-2" size={20} />
            Request Quote
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Details*
            </label>
            <textarea
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Please describe your project needs in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Where will this service be needed?"
              required
            />
          </div>

          {requestType === 'quote' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desired Timeline*
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="When do you need this service?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range*
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What's your budget for this project?"
                  required
                />
              </div>
            </>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setRequestType(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Sending...' : requestType === 'message' ? 'Send Message' : 'Request Quote'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Helper function to get provider ID
const getProviderId = (providerName: string): string => {
  const providerMap: Record<string, string> = {
    'CleanPro Services': '00000000-0000-0000-0000-000000000011',
    'Quick Fix Plumbing': '00000000-0000-0000-0000-000000000012',
    'Dr. Michael Chen': '00000000-0000-0000-0000-000000000013',
    'Elena Rodriguez Photography': '00000000-0000-0000-0000-000000000014',
    'Green Thumb Landscaping': '00000000-0000-0000-0000-000000000015',
    'Bright Spark Electric': '00000000-0000-0000-0000-000000000016',
    'Pristine Auto Detailing': '00000000-0000-0000-0000-000000000017',
    'Digital Craft Studios': '00000000-0000-0000-0000-000000000018',
    'Fitness With Sarah': '00000000-0000-0000-0000-000000000019',
    'Tech Support Wizards': '00000000-0000-0000-0000-000000000020'
  };
  
  return providerMap[providerName] || '00000000-0000-0000-0000-000000000011';
};

export default BookingForm;