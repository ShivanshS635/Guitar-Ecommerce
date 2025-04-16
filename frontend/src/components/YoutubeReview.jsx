import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext.jsx';

const YouTubeReviews = () => {
  const { token } = useContext(ShopContext);
  const [link, setLink] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/reviews/all');
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractYouTubeId(link);
    if (!videoId) return toast.error('Invalid YouTube link.');

    try {
      const res = await axios.post(
        'http://localhost:4000/api/reviews/submit',
        { videoUrl: link },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Review submitted!');
        setLink('');
        fetchReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };

  const openModal = (url) => {
    setVideoUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const scroll = (direction) => {
    const container = document.getElementById('review-container');
    const scrollAmount = direction === 'next' ? 400 : -400;
    container.scrollLeft += scrollAmount;
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-[80vh] border-t pt-10 px-4 sm:px-8 lg:px-16 bg-[#121212] text-yellow-100">
      <div className="text-2xl sm:text-3xl mb-6 text-center">
        <Title text1="YOUTUBE " text2="REVIEWS" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10"
      >
        <input
          type="url"
          required
          placeholder="Enter YouTube video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md text-black bg-white placeholder-gray-500 shadow"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Submit
        </button>
      </form>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('prev')}
          className="hidden sm:flex absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-yellow-400 text-2xl rounded-full p-2"
        >
          ‹
        </button>

        <div
          id="review-container"
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2"
        >
          {reviews.map((review, i) => {
            const videoId = extractYouTubeId(review.videoUrl);
            return (
              <div
                key={i}
                className="snap-start flex-none w-[220px] sm:w-[240px] md:w-[260px]"
              >
                <div
                  className="bg-[#1b1b1b] rounded-lg overflow-hidden border border-white/10 shadow hover:shadow-yellow-500/30 transition cursor-pointer"
                  onClick={() => openModal(review.videoUrl)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="YouTube Thumbnail"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-3 text-sm text-yellow-200">
                    Review by: {review.userName || 'Anonymous'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll('next')}
          className="hidden sm:flex absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-yellow-400 text-2xl rounded-full p-2"
        >
          ›
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
          <div className="relative w-full max-w-3xl bg-[#121212] rounded-lg overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-white text-2xl font-bold z-10"
            >
              ×
            </button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-b-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeReviews;
