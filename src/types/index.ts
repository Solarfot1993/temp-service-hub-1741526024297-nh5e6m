export interface Service {
  id: string;
  title: string;
  description: string;
  projectType: 'hourly' | 'daily' | 'project';
  minimumCharge: number;
  dailyRate?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  duration?: string;
  availability: string;
  includes: string[];
  additionalInfo?: string;
  providerName: string;
  providerImage?: string;
  providerSince: string;
  providerBio: string;
  completedJobs: number;
}

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  userId: string;
  userFullName?: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: 'Upcoming' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Declined';
  location: string;
  notes?: string;
  reviewed: boolean;
  paymentIntentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName?: string;
  recipientAvatar?: string;
  content: string;
  read: boolean;
  isLead?: boolean;
  leadStatus?: 'direct' | 'opportunity' | 'responded' | null;
  serviceId?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  isLead?: boolean;
  leadStatus?: 'direct' | 'opportunity' | 'responded' | null;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank' | 'mobile';
  isDefault: boolean;
  createdAt: string;
  country?: string;
  
  // Card details
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  
  // Bank details
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  routingNumber?: string;
  
  // Mobile Money details
  phoneNumber?: string;
  provider?: string;
}

export interface Lead {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  serviceId?: string;
  serviceName?: string;
  serviceCategory?: string;
  content: string;
  status: 'direct' | 'opportunity' | 'responded';
  createdAt: string;
  respondedAt?: string;
  price?: number;
}