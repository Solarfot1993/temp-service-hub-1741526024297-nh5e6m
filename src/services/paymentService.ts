import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethod } from '../types';

// Initialize Stripe with a fallback empty string to prevent errors
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(stripePublishableKey);

export const createPaymentIntent = async (bookingId: string, amount: number) => {
  try {
    console.log(`Creating payment intent for booking ${bookingId} with amount ${amount}`);
    
    // In a real application, this would be a server-side API call
    // For demo purposes, we're simulating the response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    
    // Update booking with payment intent ID
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_intent_id: `pi_${Math.random().toString(36).substring(2)}`,
        payment_status: 'pending'
      })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error("Error updating booking with payment intent:", error);
      throw error;
    }
    
    console.log("Booking updated with payment intent:", data);
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (bookingId: string) => {
  try {
    // In a real application, this would be handled by Stripe webhooks
    // For demo purposes, we're simulating a successful payment
    console.log("Confirming payment for booking:", bookingId);
    
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        status: 'Confirmed'  // Update the booking status to Confirmed after payment
      })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error("Error updating booking after payment:", error);
      throw error;
    }
    
    console.log("Booking updated after payment:", data);
    return true;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getStripe = () => stripePromise;

// Payment Methods Management
export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      type: item.type,
      isDefault: item.is_default,
      createdAt: item.created_at,
      ...item.data
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

export const savePaymentMethod = async (userId: string, paymentData: any): Promise<PaymentMethod> => {
  try {
    // Prepare the data for storage
    const { type, ...data } = paymentData;
    
    const { data: result, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        type,
        data,
        is_default: false // New payment methods are not default by default
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: result.id,
      userId: result.user_id,
      type: result.type,
      isDefault: result.is_default,
      createdAt: result.created_at,
      ...result.data
    };
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};