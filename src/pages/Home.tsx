import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Shield, Search } from 'lucide-react';
import { mockServices } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';
import { serviceCategories } from '../data/sampleCredentials';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Get top rated services (limit to 4)
  const topServices = [...mockServices]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/services?search=${encodeURIComponent(query)}`);
  };
  
  const handleServiceRequest = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate('/services');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Find the perfect professional for your needs
              </h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100">
                Connect with skilled service providers in your area. Book appointments easily and get your tasks done by professionals.
              </p>
              <div className="mb-6">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium text-center hover:bg-gray-100 transition-colors"
                >
                  Find Services
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white border border-indigo-300 px-6 py-3 rounded-md font-medium text-center hover:bg-indigo-500 transition-colors"
                >
                  Become a Provider
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                alt="Service professionals"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through our most popular service categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceCategories.slice(0, 8).map((category) => (
              <Link
                key={category}
                to={`/services?category=${category}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-indigo-600 mb-3 flex justify-center">
                  {/* Different icon based on category */}
                  {category === 'Cleaning' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8.7V18H9.4"/><path d="M8.7 3H18v9.3"/></svg>}
                  {category === 'Plumbing' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1Z"/><path d="M13 5v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5"/><path d="M9 5H1v2a3 3 0 0 0 3 3"/><path d="M14 5h8v2a3 3 0 0 1-3 3"/><path d="M9 10v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V10"/></svg>}
                  {category === 'Electrical' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16.8a7.5 7.5 0 0 0-15 0"/><path d="M2 16h20"/><path d="M5 20h14"/><path d="m12 4 1.5 2.9 3.1.2-2.3 2.2.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.2 3.1-.2z"/></svg>}
                  {category === 'Gardening' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15h.01"/><path d="M11 15h.01"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M3 9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2H3Z"/><path d="M12 19c-2.8 0-5-2.2-5-5v-4h10v4c0 2.8-2.2 5-5 5Z"/></svg>}
                  {category === 'Tutoring' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6"/><path d="m9 13 3-3 3 3"/><path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/></svg>}
                  {category === 'Design' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19.5 4 12l8-7.5 8 7.5-8 7.5z"/><path d="M12 19.5V12"/><path d="M12 12 4 4.5"/><path d="M20 4.5 12 12"/></svg>}
                  {category === 'Technology' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>}
                  {/* Default icon for other categories */}
                  {!['Cleaning', 'Plumbing', 'Electrical', 'Gardening', 'Tutoring', 'Design', 'Technology'].includes(category) && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>}
                </div>
                <h3 className="font-medium text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
            >
              View all categories
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our highest-rated service providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started with ServiceHub is easy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Find a Service</h3>
              <p className="text-gray-600">
                Browse through our wide range of services and find the one that matches your needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Contact Provider</h3>
              <p className="text-gray-600">
                Reach out to service providers directly to discuss your needs and get a quote.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get It Done</h3>
              <p className="text-gray-600">
                The service provider will arrive at the scheduled time and complete the job professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Read testimonials from satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I needed a plumber urgently and found one through ServiceHub within minutes. The service was excellent and the price was reasonable."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Homeowner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The tutoring service I found on ServiceHub helped my son improve his grades significantly. The booking process was simple and the tutor was fantastic."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I've been using ServiceHub to find cleaning services for my office. The quality of providers is consistently high and the platform is very user-friendly."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ServiceHub</h2>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              We're committed to connecting you with the best service providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users size={24} className="mr-3" />
                <h3 className="text-xl font-semibold">Verified Professionals</h3>
              </div>
              <p className="text-indigo-100">
                All service providers on our platform are thoroughly vetted and verified to ensure quality and reliability.
              </p>
            </div>
            
            <div className="bg-indigo-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Shield size={24} className="mr-3" />
                <h3 className="text-xl font-semibold">Secure Bookings</h3>
              </div>
              <p className="text-indigo-100">
                Our booking system is secure and transparent, with clear pricing and no hidden fees.
              </p>
            </div>
            
            <div className="bg-indigo-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star size={24} className="mr-3" />
                <h3 className="text-xl font-semibold">Satisfaction Guaranteed</h3>
              </div>
              <p className="text-indigo-100">
                We stand behind the quality of our service providers and work to ensure your complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-sm">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of satisfied customers who have found the perfect service providers for their needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/services"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Find a Service
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Become a Provider
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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

export default Home;