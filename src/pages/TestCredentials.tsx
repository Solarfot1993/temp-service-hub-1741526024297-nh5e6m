import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleCustomers, sampleProviders, serviceCategories } from '../data/sampleCredentials';
import { useAuth } from '../context/AuthContext';

const TestCredentials: React.FC = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUseAccount = async (email: string, password: string, name: string, isProvider: boolean) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First try to login directly
      const { error: loginError } = await login(email, password);
      
      if (loginError) {
        // If login fails, try to register
        setSuccess(`Login failed. Attempting to register account for ${name}...`);
        
        const { error: registerError } = await register(email, password, name, isProvider);
        
        if (registerError) {
          setError(`Failed to register: ${registerError.message}`);
        } else {
          // If registration succeeds, try to login again
          const { error: secondLoginError } = await login(email, password);
          
          if (secondLoginError) {
            setError(`Account created but couldn't log in: ${secondLoginError.message}`);
          } else {
            setSuccess(`Successfully logged in as ${name}`);
            navigate('/profile');
          }
        }
      } else {
        // Login succeeded
        setSuccess(`Successfully logged in as ${name}`);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Credentials</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Categories</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((category) => (
              <span 
                key={category} 
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Accounts</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleCustomers.map((customer, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.password}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleUseAccount(customer.email, customer.password, customer.name, false)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {loading ? 'Processing...' : 'Use Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Provider Accounts</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleProviders.map((provider, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          {provider.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.password}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleUseAccount(provider.email, provider.password, provider.name, true)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {loading ? 'Processing...' : 'Use Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> These credentials are for testing purposes only. In a real application, you would never include credentials in your code or expose them to users.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use These Credentials</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Choose either a customer or service provider account from the tables above.</li>
          <li>Click the "Use Account" button next to the account you want to use.</li>
          <li>The system will automatically try to log in with those credentials.</li>
          <li>If the account doesn't exist yet, it will be created for you automatically.</li>
          <li>You'll be redirected to your profile page once logged in.</li>
        </ol>
        <p className="mt-4 text-gray-700">
          Customers can browse services, make bookings, and send messages to service providers.
          Service providers can manage their services, respond to bookings, and communicate with customers.
        </p>
      </div>
    </div>
  );
};

export default TestCredentials;