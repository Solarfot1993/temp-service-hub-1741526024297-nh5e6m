import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPaymentMethods } from '../services/paymentService';
import PaymentMethodForm from '../components/PaymentMethodForm';
import PaymentMethodsList from '../components/PaymentMethodsList';
import { PaymentMethod } from '../types';
import { Plus } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadPaymentMethods();
  }, [user, navigate]);

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const methods = await fetchPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    loadPaymentMethods();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Method
            </button>
          )}
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {showAddForm ? (
                <div className="mb-8">
                  <PaymentMethodForm 
                    userId={user.id} 
                    onSuccess={handleAddSuccess} 
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <PaymentMethodsList 
                  paymentMethods={paymentMethods} 
                  onUpdate={loadPaymentMethods} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;