import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { fetchProviderServices } from '../services/serviceService';
import { fetchPortfolioByProviderId } from '../services/portfolioService';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import PortfolioGallery from '../components/PortfolioGallery';
import MessageButton from '../components/MessageButton';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ServiceProviderProfile: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { user } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!providerId) return;
      
      try {
        setLoading(true);
        
        // Fetch provider profile
        const { data: providerData, error: providerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', providerId)
          .single();
        
        if (providerError) {
          throw providerError;
        }
        
        setProvider(providerData);
        
        // Fetch provider services
        const servicesData = await fetchProviderServices(providerId);
        setServices(servicesData);
        
        // Fetch portfolio items
        const portfolioData = await fetchPortfolioByProviderId(providerId);
        setPortfolioItems(portfolioData);
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load provider profile');
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [providerId]);

  // Filter portfolio items by selected service
  const filteredPortfolioItems = selectedService
    ? portfolioItems.filter(item => item.serviceId === selectedService)
    : portfolioItems;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error || 'Provider not found'}
        </div>
        <Link to="/services" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-6 py-16">
          <div className="flex flex-col items-center">
            <img
              src={provider.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.full_name)}&size=128&background=random`}
              alt={provider.full_name}
              className="w-24 h-24 rounded-full border-4 border-white mb-4"
            />
            <h1 className="text-2xl font-bold text-white">{provider.full_name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-300 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(4.7) ? 'fill-current' : ''}
                  />
                ))}
              </div>
              <span className="text-indigo-100">4.7 (83 reviews)</span>
            </div>
            <p className="mt-2 px-3 py-1 bg-indigo-500 rounded-full text-white text-sm">
              Service Provider
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={18} className="mr-2" />
                <span>{provider.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                <span>Provider since {new Date(provider.provider_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            {user && user.id !== providerId && (
              <div className="mt-4 md:mt-0">
                <MessageButton 
                  recipientId={providerId}
                  variant="primary"
                  size="md"
                  showIcon={true}
                  label="Contact Provider"
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700">
              {provider.provider_bio || 'No bio provided.'}
            </p>
            <div className="mt-4 bg-indigo-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="mr-8">
                  <span className="block text-2xl font-bold text-indigo-600">{provider.completed_jobs || 0}</span>
                  <span className="text-sm text-gray-600">Jobs Completed</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-indigo-600">
                    {Math.floor(Math.random() * 24) + 1}
                  </span>
                  <span className="text-sm text-gray-600">Hours Response Time</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'services'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => {
                  setActiveTab('portfolio');
                  setSelectedService(null);
                }}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'portfolio'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'reviews'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>
          
          {activeTab === 'services' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Services Offered</h2>
              {services.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">This provider hasn't added any services yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Portfolio</h2>
                {services.length > 0 && (
                  <div className="flex items-center">
                    <label htmlFor="service-filter" className="mr-2 text-sm text-gray-700">
                      Filter by service:
                    </label>
                    <select
                      id="service-filter"
                      value={selectedService || ''}
                      onChange={(e) => setSelectedService(e.target.value || null)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All items</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <PortfolioGallery items={filteredPortfolioItems} />
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Reviews</h2>
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;