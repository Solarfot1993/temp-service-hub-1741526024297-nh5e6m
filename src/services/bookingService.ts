import { supabase } from '../lib/supabase';
import { Booking } from '../types';

export const createBooking = async (bookingData: {
  serviceId: string;
  userId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes?: string;
}) => {
  try {
    // Ensure we're using the full UUID, not just a part of it
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        service_id: bookingData.serviceId,
        user_id: bookingData.userId,
        provider_id: bookingData.providerId,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        price: bookingData.price,
        notes: bookingData.notes,
        status: 'Upcoming'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
    
    console.log("Booking created successfully:", data);
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const fetchUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services:service_id (
          title,
          image_url
        ),
        provider:provider_id (
          full_name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Booking type
    const bookings = data.map(item => ({
      id: item.id,
      serviceId: item.service_id,
      serviceName: item.services?.title || 'Service',
      providerId: item.provider_id,
      providerName: item.provider?.full_name || 'Provider',
      userId: item.user_id,
      date: item.date,
      time: item.time,
      duration: `${item.duration} hour${item.duration > 1 ? 's' : ''}`,
      price: item.price,
      status: item.status,
      location: 'Your location',
      notes: item.notes,
      reviewed: false
    }));
    
    return bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const fetchProviderBookings = async (providerId: string) => {
  try {
    console.log("Fetching bookings for provider:", providerId);
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services:service_id (
          title,
          image_url
        ),
        user:user_id (
          full_name
        )
      `)
      .eq('provider_id', providerId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error in Supabase query:", error);
      throw error;
    }
    
    console.log("Provider bookings data:", data);
    
    // Transform the data to match the Booking type
    const bookings = data.map(item => ({
      id: item.id,
      serviceId: item.service_id,
      serviceName: item.services?.title || 'Service',
      providerId: item.provider_id,
      providerName: 'You',
      userId: item.user_id,
      userFullName: item.user?.full_name || 'Customer',
      date: item.date,
      time: item.time,
      duration: `${item.duration} hour${item.duration > 1 ? 's' : ''}`,
      price: item.price,
      status: item.status,
      location: 'Client location',
      notes: item.notes,
      reviewed: false
    }));
    
    return bookings;
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    console.log(`Updating booking ${bookingId} status to ${status}`);
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
    
    console.log("Booking status updated:", data);
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'Cancelled');
};

export const completeBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'Completed');
};