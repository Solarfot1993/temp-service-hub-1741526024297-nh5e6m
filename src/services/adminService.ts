import { supabase } from '../lib/supabase';

// User Management
export const fetchUsers = async () => {
  try {
    // In a real application, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    return [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        is_provider: false,
        country: 'US',
        createdAt: '2023-03-15T10:30:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        is_provider: true,
        country: 'GH',
        createdAt: '2023-04-20T14:45:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
      },
      {
        id: '3',
        full_name: 'Michael Johnson',
        email: 'michael.johnson@example.com',
        is_provider: false,
        country: 'NG',
        createdAt: '2023-05-10T09:15:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
      },
      {
        id: '4',
        full_name: 'Emily Davis',
        email: 'emily.davis@example.com',
        is_provider: true,
        country: 'US',
        createdAt: '2023-06-05T16:20:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
      },
      {
        id: '5',
        full_name: 'David Wilson',
        email: 'david.wilson@example.com',
        is_provider: false,
        country: 'GB',
        createdAt: '2023-05-12T11:30:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      {
        id: '6',
        full_name: 'Sarah Brown',
        email: 'sarah.brown@example.com',
        is_provider: true,
        country: 'GH',
        createdAt: '2023-06-18T13:45:00Z',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
      }
    ];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Service Management
export const fetchServices = async () => {
  try {
    // In a real application, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    return [
      {
        id: '1',
        title: 'Professional House Cleaning',
        provider_name: 'CleanPro Services',
        category: 'Cleaning',
        price: 35,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        createdAt: '2023-03-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Emergency Plumbing Repair',
        provider_name: 'Quick Fix Plumbing',
        category: 'Plumbing',
        price: 75,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1606274741559-d3a3b4857be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        createdAt: '2023-04-20T14:45:00Z'
      },
      {
        id: '3',
        title: 'Math Tutoring for High School Students',
        provider_name: 'Dr. Michael Chen',
        category: 'Tutoring',
        price: 45,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        createdAt: '2023-05-10T09:15:00Z'
      },
      {
        id: '4',
        title: 'Professional Portrait Photography',
        provider_name: 'Elena Rodriguez Photography',
        category: 'Photography',
        price: 120,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        createdAt: '2023-06-05T16:20:00Z'
      },
      {
        id: '5',
        title: 'Lawn Mowing and Garden Maintenance',
        provider_name: 'Green Thumb Landscaping',
        category: 'Gardening',
        price: 50,
        status: 'inactive',
        image_url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        createdAt: '2023-07-12T11:30:00Z'
      },
      {
        id: '6',
        title: 'Electrical Wiring and Repairs',
        provider_name: 'Bright Spark Electric',
        category: 'Electrical',
        price: 85,
        status: 'pending',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
        createdAt: '2023-08-18T13:45:00Z'
      }
    ];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Booking Management
export const fetchBookings = async () => {
  try {
    // In a real application, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    return [
      {
        id: '1',
        serviceName: 'Professional House Cleaning',
        userFullName: 'John Doe',
        providerName: 'CleanPro Services',
        date: '2023-09-15',
        time: '10:00 AM',
        duration: '3 hours',
        price: 105,
        status: 'Completed',
        createdAt: '2023-09-10T10:30:00Z'
      },
      {
        id: '2',
        serviceName: 'Emergency Plumbing Repair',
        userFullName: 'Jane Smith',
        providerName: 'Quick Fix Plumbing',
        date: '2023-09-20',
        time: '2:30 PM',
        duration: '2 hours',
        price: 150,
        status: 'Completed',
        createdAt: '2023-09-19T14:45:00Z'
      },
      {
        id: '3',
        serviceName: 'Math Tutoring for High School Students',
        userFullName: 'Michael Johnson',
        providerName: 'Dr. Michael Chen',
        date: '2023-09-25',
        time: '4:00 PM',
        duration: '1 hour',
        price: 45,
        status: 'Upcoming',
        createdAt: '2023-09-20T09:15:00Z'
      },
      {
        id: '4',
        serviceName: 'Professional Portrait Photography',
        userFullName: 'Emily Davis',
        providerName: 'Elena Rodriguez Photography',
        date: '2023-09-30',
        time: '11:00 AM',
        duration: '2 hours',
        price: 240,
        status: 'Confirmed',
        createdAt: '2023-09-25T16:20:00Z'
      },
      {
        id: '5',
        serviceName: 'Lawn Mowing and Garden Maintenance',
        userFullName: 'David Wilson',
        providerName: 'Green Thumb Landscaping',
        date: '2023-10-05',
        time: '9:00 AM',
        duration: '3 hours',
        price: 150,
        status: 'Upcoming',
        createdAt: '2023-09-28T11:30:00Z'
      },
      {
        id: '6',
        serviceName: 'Electrical Wiring and Repairs',
        userFullName: 'Sarah Brown',
        providerName: 'Bright Spark Electric',
        date: '2023-09-22',
        time: '1:00 PM',
        duration: '4 hours',
        price: 340,
        status: 'Cancelled',
        createdAt: '2023-09-15T13:45:00Z'
      }
    ];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Payment Methods Management
export const fetchPaymentMethods = async () => {
  try {
    // In a real application, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    return [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        type: 'card',
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        country: 'US',
        isDefault: true,
        createdAt: '2023-08-15T10:30:00Z'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        type: 'mobile',
        phoneNumber: '0201234567',
        provider: 'MTN Mobile Money',
        country: 'GH',
        isDefault: true,
        createdAt: '2023-08-20T14:45:00Z'
      },
      {
        id: '3',
        userId: '3',
        userName: 'Michael Johnson',
        userEmail: 'michael.johnson@example.com',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        type: 'bank',
        accountName: 'Michael Johnson',
        accountNumber: '1234567890',
        bankName: 'First Bank of Nigeria',
        country: 'NG',
        isDefault: true,
        createdAt: '2023-08-25T09:15:00Z'
      },
      {
        id: '4',
        userId: '4',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@example.com',
        userAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        type: 'card',
        cardNumber: '5555555555554444',
        expiryDate: '10/24',
        cvv: '321',
        country: 'US',
        isDefault: true,
        createdAt: '2023-08-30T16:20:00Z'
      },
      {
        id: '5',
        userId: '2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        type: 'bank',
        accountName: 'Jane Smith',
        accountNumber: '9876543210',
        bankName: 'Ghana Commercial Bank',
        country: 'GH',
        isDefault: false,
        createdAt: '2023-09-05T11:30:00Z'
      }
    ];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};