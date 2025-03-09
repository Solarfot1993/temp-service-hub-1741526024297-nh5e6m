import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, MessageSquare, Check, X } from 'lucide-react';
import { Booking } from '../types';
import { updateBookingStatus } from '../services/bookingService';
import MessageButton from './MessageButton';

interface BookingRequestsListProps {
  bookings: Booking[];
  onStatusChange: () => void;
}

const BookingRequestsList: React.FC<BookingRequestsListProps> = ({ bookings, onStatusChange }) => {
  useEffect(() => {
    console.log("BookingRequestsList rendered with bookings:", bookings);
  }, [bookings]);

  const handleAccept = async (bookingId: string) => {
    try {
      console.log("Accepting booking:", bookingId);
      await updateBookingStatus(bookingId, 'Confirmed');
      onStatusChange();
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      console.log("Declining booking:", bookingId);
      await updateBookingStatus(bookingId, 'Declined');
      onStatusChange();
    } catch (error) {
      console.error('Error declining booking:', error);
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      console.log("Completing booking:", bookingId);
      await updateBookingStatus(bookingId, 'Completed');
      onStatusChange();
    } catch (error) {
      console.error('Error completing booking:', error);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No booking requests to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{booking.serviceName}</h3>
              <p className="text-gray-600">Requested by: {booking.userFullName || 'Customer'}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'Declined' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2" />
              <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-2" />
              <span>{booking.time} ({booking.duration})</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-2" />
              <span>{booking.location || 'Not specified'}</span>
            </div>
          </div>
          
          {booking.notes && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes: </span>
                {booking.notes}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">${booking.price.toFixed(2)}</span>
            <div className="flex space-x-2">
              {booking.status === 'Upcoming' && (
                <>
                  <button 
                    onClick={() => handleAccept(booking.id)}
                    className="flex items-center px-3 py-1 bg-green-600 rounded-md text-sm text-white hover:bg-green-700"
                  >
                    <Check size={16} className="mr-1" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleDecline(booking.id)}
                    className="flex items-center px-3 py-1 bg-red-600 rounded-md text-sm text-white hover:bg-red-700"
                  >
                    <X size={16} className="mr-1" />
                    Decline
                  </button>
                </>
              )}
              {booking.status === 'Confirmed' && (
                <button 
                  onClick={() => handleComplete(booking.id)}
                  className="flex items-center px-3 py-1 bg-green-600 rounded-md text-sm text-white hover:bg-green-700"
                >
                  <Check size={16} className="mr-1" />
                  Mark as Completed
                </button>
              )}
              <MessageButton 
                recipientId={booking.userId}
                variant="outline"
                size="sm"
                label="Message Client"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingRequestsList;