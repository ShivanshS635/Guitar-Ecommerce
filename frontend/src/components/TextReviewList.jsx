import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.jsx';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaStar, FaChevronDown, FaChevronUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import Title from './Title.jsx';

const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6F91'];

const generateInitials = (name = 'Anonymous') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase();
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(getComputedStyle(descriptionRef.current).lineHeight);
      const maxHeight = lineHeight * 5;
      setNeedsReadMore(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [review.description]);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-yellow-300/20 shadow-lg p-6 flex flex-col gap-4 hover:shadow-yellow-400/20 transition-all duration-500 h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-black shadow-inner"
          style={{ backgroundColor: randomColor() }}
        >
          {generateInitials(review.user?.name)}
        </div>
        <p className="text-yellow-100 font-semibold">
          {review.user?.name || 'Anonymous'}
        </p>
      </div>

      {/* Stars */}
      <div className="flex gap-1 text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < review.rating ? '' : 'opacity-30'} />
        ))}
      </div>

      {/* Description */}
      <div className="relative">
        <p
          ref={descriptionRef}
          className={`text-yellow-100 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-none' : 'max-h-[120px]'
          }`}
        >
          "{review.description}"
        </p>
        {needsReadMore && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-yellow-400 text-xs font-semibold mt-2 flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Read Less</span>
                <FaChevronUp size={12} />
              </>
            ) : (
              <>
                <span>Read More</span>
                <FaChevronDown size={12} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const TextReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const { backendUrl } = useContext(ShopContext);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = window.innerWidth < 640;

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

  // Group reviews into 4 per page for desktop
  const groupedReviews = [];
  for (let i = 0; i < reviews.length; i += 4) {
    groupedReviews.push(reviews.slice(i, i + 4));
  }

  const goToIndex = (index) => {
    const container = scrollRef.current;
    if (container) {
      const width = container.offsetWidth;
      container.scrollTo({
        left: index * width,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  // Autoplay for mobile
  useEffect(() => {
    if (!isMobile || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % reviews.length;
        scrollRef.current?.scrollTo({
          left: next * scrollRef.current.offsetWidth,
          behavior: 'smooth',
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews, isMobile]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < reviews.length - 1) goToIndex(currentIndex + 1);
    },
    onSwipedRight: () => {
      if (currentIndex > 0) goToIndex(currentIndex - 1);
    },
    trackMouse: true,
  });

  return (
    <div className="bg-[#121212] text-yellow-100 min-h-[80vh] py-16 px-4 sm:px-8 lg:px-24">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title
          text1="What Our Customers Say"
          subtitle="Real experiences from real musicians"
          useTypewriter={true}
        />
      </motion.div>

      {/* Desktop View */}
      {!isMobile ? (
        <>
          <div className="relative flex items-center">
            <button
              onClick={() => goToIndex(Math.max(currentIndex - 1, 0))}
              className="hidden lg:flex absolute left-0 z-10 bg-yellow-400/30 hover:bg-yellow-400/60 p-2 rounded-full"
            >
              <FaArrowLeft />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 w-full"
            >
              {groupedReviews.map((group, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full px-4"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {group.map((review, i) => (
                      <Tilt key={`${review._id}-${i}`} glareEnable glareMaxOpacity={0.15}>
                        <ReviewCard review={review} />
                      </Tilt>
                    ))}
                    {group.length < 4 &&
                      Array.from({ length: 4 - group.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="hidden sm:block" />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => goToIndex(Math.min(currentIndex + 1, groupedReviews.length - 1))}
              className="hidden lg:flex absolute right-0 z-10 bg-yellow-400/30 hover:bg-yellow-400/60 p-2 rounded-full"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Dots */}
          {groupedReviews.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {groupedReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === i ? 'bg-yellow-400' : 'bg-yellow-400/30'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        // Mobile View
        <div
          {...swipeHandlers}
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory space-x-4 px-2"
        >
          {reviews.map((review, i) => (
            <div
              key={review._id}
              className="flex-shrink-0 w-full snap-center px-2"
              style={{ scrollSnapAlign: 'center' }}
            >
              <Tilt glareEnable glareMaxOpacity={0.15}>
                <ReviewCard review={review} />
              </Tilt>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextReviewList;