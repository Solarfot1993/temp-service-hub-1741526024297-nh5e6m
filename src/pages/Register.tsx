import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sampleCustomers, sampleProviders } from '../data/sampleCredentials';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error: registerError } = await register(email, password, name, isProvider);
      
      if (registerError) {
        setError(registerError.message || 'Failed to create an account. Please try again.');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseTestAccount = async (email: string, password: string, name: string, isProvider: boolean) => {
    setIsSubmitting(true);
    
    try {
      const { error: registerError } = await register(email, password, name, isProvider);
      
      if (registerError) {
        // If registration fails, try to log in directly
        const { login } = useAuth();
        const { error: loginError } = await login(email, password);
        
        if (loginError) {
          setError(loginError.message || 'Failed to log in with test account.');
        } else {
          navigate('/profile');
        }
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError('Failed to use test account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join ServiceHub today</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isProvider}
                onChange={(e) => setIsProvider(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
              />
              <span className="text-gray-700">I want to register as a service provider</span>
            </label>
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Privacy Policy
            </a>
            .
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign in
            </Link>
          </p>
          
          <div className="mt-6">
            <p className="text-gray-600 mb-2">
              Want to try out the platform?{' '}
              <Link to="/test-credentials" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Use test credentials
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;