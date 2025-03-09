import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const fetchReviewsByServiceId = async (serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Review type
    const reviews: Review[] = data.map(item => ({
      id: item.id,
      serviceId: item.service_id,
      userId: item.user_id,
      userName: item.user.full_name,
      userAvatar: item.user.avatar_url || undefined,
      rating: item.rating,
      comment: item.comment,
      date: new Date(item.created_at).toISOString().split('T')[0]
    }));
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const createReview = async (reviewData: Omit<Review, 'id' | 'userName' | 'userAvatar' | 'date'>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        service_id: reviewData.serviceId,
        user_id: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update the service rating and review count
    await updateServiceRating(reviewData.serviceId);
    
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update the service rating
    const review = await supabase
      .from('reviews')
      .select('service_id')
      .eq('id', id)
      .single();
    
    if (review.data) {
      await updateServiceRating(review.data.service_id);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string) => {
  try {
    // Get the service_id before deleting
    const review = await supabase
      .from('reviews')
      .select('service_id')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    // Update the service rating
    if (review.data) {
      await updateServiceRating(review.data.service_id);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Helper function to update service rating and review count
const updateServiceRating = async (serviceId: string) => {
  try {
    // Get all reviews for the service
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('service_id', serviceId);
    
    if (error) {
      throw error;
    }
    
    if (!reviews || reviews.length === 0) {
      // No reviews, reset rating to 0
      await supabase
        .from('services')
        .update({
          rating: 0,
          review_count: 0
        })
        .eq('id', serviceId);
      return;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update the service
    await supabase
      .from('services')
      .update({
        rating: averageRating,
        review_count: reviews.length
      })
      .eq('id', serviceId);
  } catch (error) {
    console.error('Error updating service rating:', error);
  }
};