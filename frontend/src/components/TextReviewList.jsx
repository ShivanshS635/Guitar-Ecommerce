import React, { useContext, useEffect, useState } from 'react';
import ReviewCards from '../components/ReviewCards.jsx';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.jsx';

const TextReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const { backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/reviews/textReviews`);
        setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    getReviews();
  }, [backendUrl]);

  return (
    <div className="mt-16 px-4 md:px-12 lg:px-24">
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-100 text-center mb-10 tracking-wide">
        What Our Customers Say
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewCards
              key={index}
              username={review.user?.name || 'Anonymous'}
              description={review.description}
              rating={review.rating}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">No reviews available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TextReviewList;
