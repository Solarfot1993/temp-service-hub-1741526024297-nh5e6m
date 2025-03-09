import React, { useState } from 'react';
import { CreditCard, Landmark, Phone } from 'lucide-react';
import { savePaymentMethod } from '../services/paymentService';

interface PaymentMethodFormProps {
  userId: string;
  onSuccess: () => void;
  defaultCountry?: string;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ 
  userId, 
  onSuccess,
  defaultCountry = 'US'
}) => {
  const [paymentType, setPaymentType] = useState<'card' | 'bank' | 'mobile'>('card');
  const [country, setCountry] = useState(defaultCountry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Card details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Bank details
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  
  // Mobile Money details
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      let paymentData;
      
      if (paymentType === 'card') {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
          throw new Error('Please fill in all card details');
        }
        
        paymentData = {
          type: 'card',
          cardName,
          cardNumber,
          expiryDate,
          cvv
        };
      } else if (paymentType === 'bank') {
        if (!accountName || !accountNumber || !bankName) {
          throw new Error('Please fill in all bank details');
        }
        
        paymentData = {
          type: 'bank',
          accountName,
          accountNumber,
          bankName,
          routingNumber
        };
      } else if (paymentType === 'mobile') {
        if (!phoneNumber || !provider) {
          throw new Error('Please fill in all mobile money details');
        }
        
        paymentData = {
          type: 'mobile',
          phoneNumber,
          provider
        };
      }
      
      await savePaymentMethod(userId, {
        ...paymentData,
        country
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save payment method');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    } else {
      return digits;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Payment Method</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="US">United States</option>
          <option value="GH">Ghana</option>
          <option value="NG">Nigeria</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentType('card')}
            className={`flex items-center justify-center p-4 border rounded-md ${
              paymentType === 'card'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="mr-2" size={20} />
            <span>Credit Card</span>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentType('bank')}
            className={`flex items-center justify-center p-4 border rounded-md ${
              paymentType === 'bank'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Landmark className="mr-2" size={20} />
            <span>Bank Account</span>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentType('mobile')}
            className={`flex items-center justify-center p-4 border rounded-md ${
              paymentType === 'mobile'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Phone className="mr-2" size={20} />
            <span>Mobile Money</span>
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {paymentType === 'card' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}
        
        {paymentType === 'bank' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name
              </label>
              <input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                id="bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Bank of America"
              />
            </div>
            
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="123456789"
              />
            </div>
            
            {(country === 'US' || country === 'CA') && (
              <div>
                <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number
                </label>
                <input
                  id="routingNumber"
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123456789"
                />
              </div>
            )}
          </div>
        )}
        
        {paymentType === 'mobile' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={country === 'GH' ? '0201234567' : '08012345678'}
              />
            </div>
            
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Provider</option>
                {country === 'GH' && (
                  <>
                    <option value="MTN">MTN Mobile Money</option>
                    <option value="Vodafone">Vodafone Cash</option>
                    <option value="AirtelTigo">AirtelTigo Money</option>
                  </>
                )}
                {country === 'NG' && (
                  <>
                    <option value="MTN">MTN Mobile Money</option>
                    <option value="Airtel">Airtel Money</option>
                    <option value="Glo">Glo Mobile Money</option>
                    <option value="9Mobile">9Mobile Payment</option>
                  </>
                )}
                {country !== 'GH' && country !== 'NG' && (
                  <option value="Other">Other</option>
                )}
              </select>
            </div>
          </div>
        )}
        
        <div className="mt-6">
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
                Processing...
              </span>
            ) : (
              'Save Payment Method'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;