import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { ChevronLeft, ChevronRight, PlayCircle, X } from 'lucide-react';

const YouTubeReview = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [canScroll, setCanScroll] = useState(false);
  const { backendUrl } = useContext(ShopContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reviews/all`);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error('Error fetching YouTube reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (el) setCanScroll(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]);

  const scroll = (direction) => {
    const scrollAmount = 400;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-12 mt-12">
      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-yellow-100">
        YouTube Video Reviews
      </h3>

      <div className="relative">
        {canScroll && (
          <>
            <button
              onClick={() => scroll('left')}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full z-10 shadow"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full z-10 shadow"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Scroll Container */}
        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-8">
          <div className="flex gap-6 w-max">
            {reviews.map((review, index) => (
              <div
                key={index}
                onClick={() => setSelectedVideo(review.videoId)}
                className="group relative block rounded-xl overflow-hidden shadow-lg border border-white/10 min-w-[300px] sm:min-w-[340px] md:min-w-[400px] hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={`https://img.youtube.com/vi/${review.videoId}/hqdefault.jpg`}
                  alt={`Review Thumbnail ${index}`}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition">
                  <PlayCircle className="text-white w-12 h-12 mb-2" />
                  <p className="text-white text-center text-sm font-medium px-2">
                    {review.title || 'YouTube Review'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-3xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl shadow-lg"
            ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeReview;
