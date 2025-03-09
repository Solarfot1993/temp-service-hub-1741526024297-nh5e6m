{/* Full updated file content will be provided */}
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, User, Shield } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import ReviewList from '../components/ReviewList';
import MessageButton from '../components/MessageButton';
import PortfolioGallery from '../components/PortfolioGallery';
import { Service, Review } from '../types';
import { fetchServiceById } from '../services/serviceService';
import { fetchReviewsByServiceId } from '../services/reviewService';
import { fetchPortfolioByServiceId } from '../services/portfolioService';
import { useAuth } from '../context/AuthContext';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch service details
        const serviceData = await fetchServiceById(id);
        setService(serviceData);
        
        // Fetch reviews for this service
        const reviewsData = await fetchReviewsByServiceId(id);
        setReviews(reviewsData);
        
        // Fetch portfolio items for this service
        const portfolioData = await fetchPortfolioByServiceId(id);
        setPortfolioItems(portfolioData);
      } catch (err: any) {
        setError(err.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleContactProvider = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else if (service) {
      // Navigate to messages with this provider
      navigate(`/messages/${getProviderId(service.providerName)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
        <Link to="/services" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
          Browse All Services
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
          Browse All Services
        </Link>
      </div>
    );
  }

  // Map provider name to provider ID
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

  const providerId = getProviderId(service.providerName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/services" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
          Back to Services
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={service.imageUrl} 
              alt={service.title} 
              className="w-full h-80 object-cover"
            />
            
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < Math.floor(service.rating) ? 'fill-current' : ''}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700">{service.rating} ({service.reviewCount} reviews)</span>
                  </div>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={18} className="mr-1" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-1" />
                  <span>Available {service.availability}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'description'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'portfolio'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab('provider')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'provider'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Provider
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'reviews'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>
                
                <div className="py-6">
                  {activeTab === 'description' && (
                    <div>
                      <p className="text-gray-700 mb-4">{service.description}</p>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Included</h3>
                      <ul className="list-disc pl-5 text-gray-700 mb-4">
                        {service.includes.map((item, index) => (
                          <li key={index} className="mb-1">{item}</li>
                        ))}
                      </ul>
                      {service.additionalInfo && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
                          <p className="text-gray-700">{service.additionalInfo}</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'portfolio' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio</h3>
                      {portfolioItems.length > 0 ? (
                        <PortfolioGallery items={portfolioItems} />
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No portfolio items available for this service.</p>
                        </div>
                      )}
                      <div className="mt-6 text-center">
                        <Link 
                          to={`/provider/${providerId}`} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View all provider's work
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'provider' && (
                    <div>
                      <div className="flex items-start">
                        <img
                          src={service.providerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName)}&background=random`}
                          alt={service.providerName}
                          className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{service.providerName}</h3>
                          <p className="text-gray-600 mb-2">Service Provider since {service.providerSince}</p>
                          <div className="flex items-center text-gray-700">
                            <User size={16} className="mr-1" />
                            <span>{service.completedJobs} jobs completed</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-2">About the Provider</h4>
                        <p className="text-gray-700">{service.providerBio}</p>
                      </div>
                      <div className="mt-6">
                        {user && user.id !== providerId ? (
                          <MessageButton 
                            recipientId={providerId}
                            variant="primary"
                            size="md"
                            showIcon={true}
                            label="Contact Provider"
                            serviceId={service.id}
                          />
                        ) : !user ? (
                          <button 
                            onClick={() => setShowLoginPrompt(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Contact Provider
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <Link 
                          to={`/provider/${providerId}`} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View provider profile
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'reviews' && (
                    <div>
                      <ReviewList reviews={reviews} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <BookingForm service={service} />
            
            <div className="bg-indigo-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Guarantee</h3>
              <p className="text-gray-700 mb-4">
                We stand behind the quality of our service providers. If you're not satisfied, we'll work to make it right.
              </p>
              <div className="flex items-center text-indigo-600">
                <Shield size={18} className="mr-2" />
                <span className="font-medium">100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create an Account</h3>
            <p className="text-gray-600 mb-6">
              You need to create an account or log in to contact service providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors text-center"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Create Account
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-gray-500 hover:text-gray-700 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;