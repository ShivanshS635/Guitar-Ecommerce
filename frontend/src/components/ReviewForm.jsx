import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';  // Import toast

const ReviewForm = () => {
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || rating === 0) {
      toast.error('Please provide a review and rating!');  // Error toast if form is incomplete
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(backendUrl + '/api/reviews/text', { description, rating }, { headers: { Authorization: `Bearer ${token}` } });
      setDescription('');
      setRating(0);
      setSuccess(true);
      toast.success('Thank you for your review!');  // Success toast on successful submission
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Error submitting your review.'+ err.response.data.message);  // Error toast on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-10 p-6 bg-neutral-900 border border-neutral-700 rounded-xl max-w-3xl mx-auto shadow-lg">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Leave a Review</h3>

      {success && (
        <p className="text-green-400 text-center mb-4">Thank you for your review!</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-md p-3 text-sm bg-neutral-800 text-white resize-none"
          placeholder="Write your experience..."
          required
        />

        <div className="flex gap-1 justify-center">
          {[...Array(5)].map((_, i) => {
            const value = i + 1;
            return (
              <label key={value}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  onClick={() => setRating(value)}
                  className="hidden"
                />
                <FaStar
                  size={24}
                  color={value <= (hover || rating) ? '#facc15' : '#444'}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer transition"
                />
              </label>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black py-2 rounded-full hover:bg-yellow-300 transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
