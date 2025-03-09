import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start">
            <img
              src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`}
              alt={review.userName}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">{review.userName}</h4>
                <span className="text-sm text-gray-500">
                  {format(new Date(review.date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;