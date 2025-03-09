import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  serviceId?: string;
  userId: string;
  createdAt: string;
}

export const fetchPortfolioByProviderId = async (providerId: string): Promise<PortfolioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      serviceId: item.service_id,
      userId: item.user_id,
      createdAt: item.created_at
    })) || [];
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    throw error;
  }
};

export const fetchPortfolioByServiceId = async (serviceId: string): Promise<PortfolioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      serviceId: item.service_id,
      userId: item.user_id,
      createdAt: item.created_at
    })) || [];
  } catch (error) {
    console.error('Error fetching portfolio items by service:', error);
    throw error;
  }
};

export const createPortfolioItem = async (
  userId: string,
  item: {
    title: string;
    description?: string;
    imageFile: File;
    serviceId?: string;
  }
): Promise<PortfolioItem> => {
  try {
    // 1. Upload image to storage
    const fileExt = item.imageFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `portfolio/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, item.imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);

    // 3. Create portfolio item in database
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        title: item.title,
        description: item.description,
        image_url: publicUrl,
        service_id: item.serviceId,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // If database insert fails, try to delete the uploaded file
      await supabase.storage
        .from('service-images')
        .remove([filePath]);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      serviceId: data.service_id,
      userId: data.user_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    throw error;
  }
};

export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  try {
    // 1. Get the item to find the image URL
    const { data: item, error: fetchError } = await supabase
      .from('portfolio_items')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // 2. Delete from storage if there's an image URL
    if (item?.image_url) {
      const imagePath = item.image_url.split('/').slice(-2).join('/'); // Get the path after 'service-images/'
      await supabase.storage
        .from('service-images')
        .remove([`portfolio/${imagePath}`]);
    }

    // 3. Delete from database
    const { error: deleteError } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return true;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
};