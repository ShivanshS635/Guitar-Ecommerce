import React from 'react';
import { Star } from 'lucide-react';

const ReviewCards = ({ username, description, rating }) => {
  return (
    <div className="relative w-full sm:w-[400px] p-4 rounded-2xl bg-gradient-to-r from-[#2D2D2D] to-[#1F1F1F] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="bg-black/80 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-yellow-100">{username}</h3>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`transition-transform ${i < rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-500'}`}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ReviewCards;
