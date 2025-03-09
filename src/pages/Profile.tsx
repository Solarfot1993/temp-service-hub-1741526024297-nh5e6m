import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Calendar, MessageSquare, Upload, Plus, Trash2, Edit, DollarSign, Zap } from 'lucide-react';
import { fetchProviderServices } from '../services/serviceService';
import { fetchDirectLeads, fetchOpportunityLeads } from '../services/leadService';
import ServiceCard from '../components/ServiceCard';
import PortfolioGallery from '../components/PortfolioGallery';
import PortfolioUploader from '../components/PortfolioUploader';
import BookingRequestsList from '../components/BookingRequestsList';
import LeadsList from '../components/LeadsList';
import { Service, Lead } from '../types';
import { fetchProviderBookings, fetchUserBookings } from '../services/bookingService';
import MessageButton from '../components/MessageButton';
import PaymentMethodForm from '../components/PaymentMethodForm';
import PaymentMethodsList from '../components/PaymentMethodsList';

const Profile: React.FC = () => {
  const { profile, user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [providerBookings, setProviderBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [providerBookingsLoading, setProviderBookingsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [directLeads, setDirectLeads] = useState<Lead[]>([]);
  const [opportunityLeads, setOpportunityLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [activeLeadsTab, setActiveLeadsTab] = useState<'direct' | 'opportunity'>('direct');
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    provider_bio: profile?.provider_bio || '',
    weekly_budget: profile?.weekly_budget || 100,
    max_lead_price: profile?.max_lead_price || 10
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<{id: string, title: string, description: string, imageUrl: string, serviceId?: string}[]>([]);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        provider_bio: profile.provider_bio || '',
        weekly_budget: profile?.weekly_budget || 100,
        max_lead_price: profile?.max_lead_price || 10
      });
    }
  }, [profile]);

  const loadUserBookings = async () => {
    if (!user) return;
    
    setBookingsLoading(true);
    try {
      const bookingsData = await fetchUserBookings(user.id);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadBookingRequests = async () => {
    if (!user) return;
    
    setProviderBookingsLoading(true);
    try {
      const bookingsData = await fetchProviderBookings(user.id);
      setProviderBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    } finally {
      setProviderBookingsLoading(false);
    }
  };

  const loadServices = async () => {
    if (!user) return;
    
    setServicesLoading(true);
    try {
      const servicesData = await fetchProviderServices(user.id);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  const loadLeads = async () => {
    if (!user) return;
    
    setLeadsLoading(true);
    try {
      if (activeLeadsTab === 'direct') {
        const directLeadsData = await fetchDirectLeads(user.id);
        setDirectLeads(directLeadsData);
      } else {
        const opportunityLeadsData = await fetchOpportunityLeads(user.id);
        setOpportunityLeads(opportunityLeadsData);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'bookings') {
      loadUserBookings();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'requests') {
      loadBookingRequests();
    }
  }, [user, profile, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'services') {
      loadServices();
    }
  }, [user, profile, activeTab]);

  useEffect(() => {
    if (user && profile?.is_provider && activeTab === 'leads') {
      loadLeads();
    }
  }, [user, profile, activeTab, activeLeadsTab]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError('');
    
    if (!user) return;
    
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        provider_bio: formData.provider_bio,
        phone: formData.phone,
        location: formData.location,
        weekly_budget: parseFloat(formData.weekly_budget.toString()),
        max_lead_price: parseFloat(formData.max_lead_price.toString())
      });
      
      if (error) {
        setUpdateError(error.message || 'Failed to update profile');
      } else {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
    }
  };

  const handlePaymentMethodSuccess = () => {
    // Implementation needed
  };

  const handlePaymentMethodsUpdate = () => {
    // Implementation needed
  };

  const handleAddPortfolioItem = () => {
    // Implementation needed
  };

  const handleDeletePortfolioItem = () => {
    // Implementation needed
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-6 py-16">
          <div className="flex flex-col items-center">
            <img
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || '')}&background=random`}
              alt={profile?.full_name}
              className="w-24 h-24 rounded-full border-4 border-white mb-4"
            />
            <h1 className="text-2xl font-bold text-white">{profile?.full_name}</h1>
            <p className="text-indigo-100">{profile?.email}</p>
            <p className="mt-2 px-3 py-1 bg-indigo-500 rounded-full text-white text-sm">
              {profile?.is_provider ? 'Service Provider' : 'Customer'}
            </p>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Bookings
            </button>
            
            {profile?.is_provider && (
              <>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'requests'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Booking Requests
                </button>
                
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'leads'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Zap size={16} className="mr-1" />
                    Leads
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'services'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Services
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('payment-methods')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'payment-methods'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Methods
            </button>

            {profile?.is_provider && (
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Portfolio
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">My Bookings</h2>
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                  <Link
                    to="/services"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      {/* Booking details */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'requests' && profile?.is_provider && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking Requests</h2>
              {providerBookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <BookingRequestsList 
                  bookings={providerBookings} 
                  onStatusChange={loadBookingRequests}
                />
              )}
            </div>
          )}
          
          {activeTab === 'leads' && profile?.is_provider && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveLeadsTab('direct')}
                    className={`px-4 py-2 rounded-md ${
                      activeLeadsTab === 'direct'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Direct Leads
                  </button>
                  <button
                    onClick={() => setActiveLeadsTab('opportunity')}
                    className={`px-4 py-2 rounded-md ${
                      activeLeadsTab === 'opportunity'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Opportunity Leads
                  </button>
                </div>
              </div>

              {leadsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <LeadsList
                  leads={activeLeadsTab === 'direct' ? directLeads : opportunityLeads}
                  type={activeLeadsTab}
                  onRefresh={loadLeads}
                />
              )}
            </div>
          )}
          
          {activeTab === 'services' && profile?.is_provider && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Services</h2>
                <Link
                  to="/create-service"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add New Service
                </Link>
              </div>
              
              {servicesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">You haven't added any services yet.</p>
                  <Link
                    to="/create-service"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Create Your First Service
                  </Link>
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

          {activeTab === 'payment-methods' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
                <button
                  onClick={() => setShowAddPaymentForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Payment Method
                </button>
              </div>
              
              {paymentMethodsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : showAddPaymentForm ? (
                <div className="mb-8">
                  <PaymentMethodForm 
                    userId={user!.id} 
                    onSuccess={handlePaymentMethodSuccess} 
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAddPaymentForm(false)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <PaymentMethodsList 
                  paymentMethods={paymentMethods} 
                  onUpdate={handlePaymentMethodsUpdate} 
                />
              )}
            </div>
          )}
          
          {activeTab === 'portfolio' && profile?.is_provider && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Portfolio</h2>
                <button
                  onClick={() => setShowPortfolioForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Portfolio Item
                </button>
              </div>
              
              {showPortfolioForm ? (
                <div className="mb-8">
                  <PortfolioUploader 
                    userId={user!.id} 
                    onSuccess={handleAddPortfolioItem} 
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowPortfolioForm(false)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <PortfolioGallery 
                  items={portfolioItems} 
                  onDelete={handleDeletePortfolioItem}
                  isEditable={true}
                />
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              
              {updateSuccess && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Profile updated successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {updateError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{updateError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                {profile?.is_provider && (
                  <>
                    <div>
                      <label htmlFor="provider_bio" className="block text-sm font-medium text-gray-700">
                        Professional Bio
                      </label>
                      <textarea
                        id="provider_bio"
                        value={formData.provider_bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, provider_bio: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="weekly_budget" className="block text-sm font-medium text-gray-700">
                        Weekly Lead Budget ($)
                      </label>
                      <input
                        type="number"
                        id="weekly_budget"
                        value={formData.weekly_budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, weekly_budget: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        step="10"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="max_lead_price" className="block text-sm font-medium text-gray-700">
                        Maximum Lead Price ($)
                      </label>
                      <input
                        type="number"
                        id="max_lead_price"
                        value={formData.max_lead_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_lead_price: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        step="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;