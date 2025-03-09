import React from 'react';
import { CreditCard, Landmark, Phone, Trash2, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../types';
import { deletePaymentMethod, setDefaultPaymentMethod } from '../services/paymentService';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onUpdate: () => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ paymentMethods, onUpdate }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      onUpdate();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No payment methods added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div 
          key={method.id} 
          className={`border rounded-lg p-4 ${method.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {method.type === 'card' && <CreditCard className="mr-3 text-indigo-600" size={24} />}
              {method.type === 'bank' && <Landmark className="mr-3 text-indigo-600" size={24} />}
              {method.type === 'mobile' && <Phone className="mr-3 text-indigo-600" size={24} />}
              
              <div>
                {method.type === 'card' && (
                  <>
                    <p className="font-medium text-gray-800">
                      •••• •••• •••• {method.cardNumber.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.cardName} • Expires {method.expiryDate}
                    </p>
                  </>
                )}
                
                {method.type === 'bank' && (
                  <>
                    <p className="font-medium text-gray-800">
                      {method.bankName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.accountName} • •••• {method.accountNumber.slice(-4)}
                    </p>
                  </>
                )}
                
                {method.type === 'mobile' && (
                  <>
                    <p className="font-medium text-gray-800">
                      {method.provider}
                    </p>
                    <p className="text-sm text-gray-600">
                      •••• {method.phoneNumber.slice(-4)}
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {method.isDefault ? (
                <span className="flex items-center text-sm text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  Default
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Set as default
                </button>
              )}
              
              <button
                onClick={() => handleDelete(method.id)}
                className="p-1 text-red-600 hover:text-red-800"
                aria-label="Delete payment method"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsList;