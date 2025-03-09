import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../services/paymentService';
import PaymentForm from './PaymentForm';

interface PaymentWrapperProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = (props) => {
  return (
    <Elements stripe={getStripe()}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentWrapper;