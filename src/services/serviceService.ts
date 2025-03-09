import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const fetchServices = async (category?: string, searchQuery?: string) => {
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        provider:provider_id (
          full_name,
          avatar_url,
          provider_since,
          provider_bio,
          completed_jobs
        )
      `);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Service type
    const services: Service[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      projectType: item.project_type,
      minimumCharge: item.minimum_charge,
      dailyRate: item.daily_rate,
      category: item.category,
      imageUrl: item.image_url,
      rating: item.rating,
      reviewCount: item.review_count,
      location: item.location,
      duration: item.duration,
      availability: item.availability,
      includes: item.includes,
      additionalInfo: item.additional_info || undefined,
      providerName: item.provider.full_name,
      providerImage: item.provider.avatar_url || undefined,
      providerSince: item.provider.provider_since || 'Unknown',
      providerBio: item.provider.provider_bio || '',
      completedJobs: item.provider.completed_jobs || 0
    }));
    
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchProviderServices = async (providerId: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:provider_id (
          full_name,
          avatar_url,
          provider_since,
          provider_bio,
          completed_jobs
        )
      `)
      .eq('provider_id', providerId);
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Service type
    const services: Service[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      projectType: item.project_type,
      minimumCharge: item.minimum_charge,
      dailyRate: item.daily_rate,
      category: item.category,
      imageUrl: item.image_url,
      rating: item.rating,
      reviewCount: item.review_count,
      location: item.location,
      duration: item.duration,
      availability: item.availability,
      includes: item.includes,
      additionalInfo: item.additional_info || undefined,
      providerName: item.provider.full_name,
      providerImage: item.provider.avatar_url || undefined,
      providerSince: item.provider.provider_since || 'Unknown',
      providerBio: item.provider.provider_bio || '',
      completedJobs: item.provider.completed_jobs || 0
    }));
    
    return services;
  } catch (error) {
    console.error('Error fetching provider services:', error);
    throw error;
  }
};

export const fetchServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:provider_id (
          full_name,
          avatar_url,
          provider_since,
          provider_bio,
          completed_jobs
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform the data to match the Service type
    const service: Service = {
      id: data.id,
      title: data.title,
      description: data.description,
      projectType: data.project_type,
      minimumCharge: data.minimum_charge,
      dailyRate: data.daily_rate,
      category: data.category,
      imageUrl: data.image_url,
      rating: data.rating,
      reviewCount: data.review_count,
      location: data.location,
      duration: data.duration,
      availability: data.availability,
      includes: data.includes,
      additionalInfo: data.additional_info || undefined,
      providerName: data.provider.full_name,
      providerImage: data.provider.avatar_url || undefined,
      providerSince: data.provider.provider_since || 'Unknown',
      providerBio: data.provider.provider_bio || '',
      completedJobs: data.provider.completed_jobs || 0
    };
    
    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const createService = async (serviceData: Omit<Service, 'id' | 'rating' | 'reviewCount' | 'providerName' | 'providerImage' | 'providerSince' | 'providerBio' | 'completedJobs'>, providerId: string) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({
        title: serviceData.title,
        description: serviceData.description,
        project_type: serviceData.projectType,
        minimum_charge: serviceData.minimumCharge,
        daily_rate: serviceData.dailyRate,
        category: serviceData.category,
        image_url: serviceData.imageUrl,
        location: serviceData.location,
        duration: serviceData.duration,
        availability: serviceData.availability,
        includes: serviceData.includes,
        additional_info: serviceData.additionalInfo,
        provider_id: providerId,
        rating: 0,
        review_count: 0
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id: string, updates: Partial<Omit<Service, 'id' | 'rating' | 'reviewCount' | 'providerName' | 'providerImage' | 'providerSince' | 'providerBio' | 'completedJobs'>>) => {
  try {
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.projectType) dbUpdates.project_type = updates.projectType;
    if (updates.minimumCharge) dbUpdates.minimum_charge = updates.minimumCharge;
    if (updates.dailyRate) dbUpdates.daily_rate = updates.dailyRate;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.duration) dbUpdates.duration = updates.duration;
    if (updates.availability) dbUpdates.availability = updates.availability;
    if (updates.includes) dbUpdates.includes = updates.includes;
    if ('additionalInfo' in updates) dbUpdates.additional_info = updates.additionalInfo;
    
    const { data, error } = await supabase
      .from('services')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};