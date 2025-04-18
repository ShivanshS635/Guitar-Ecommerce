import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext.jsx';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaStar, FaChevronDown, FaChevronUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import Title from '../Title.jsx';

const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6F91'];
const generateInitials = (name = 'Anonymous') => name.split(' ').map((n) => n[0]).join('').toUpperCase();
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
    className="w-72 sm:w-80 md:w-96 bg-white/10 backdrop-blur-xl rounded-xl border border-yellow-300/20 shadow-lg p-6 flex flex-col gap-4 hover:shadow-yellow-400/20 transition-all duration-500 h-full"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    >
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

      <div className="flex gap-1 text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < review.rating ? '' : 'opacity-30'} />
        ))}
      </div>

      <div className="relative">
        <p
          ref={descriptionRef}
          className={`text-yellow-100 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-[120px]'
            }`}
        >
          "{review.description}"
        </p>
        {needsReadMore && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-yellow-400 text-xs font-semibold mt-2 flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            {isExpanded ? <>Read Less <FaChevronUp size={12} /></> : <>Read More <FaChevronDown size={12} /></>}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const { backendUrl } = useContext(ShopContext);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const animationFrameId = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/reviews/textReviews`);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [backendUrl]);

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      setItemsPerPage(
        width >= 1024 ? 3 :
        width >= 768 ? 2 : 1
      );
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Smooth scroll animation
  useEffect(() => {
    if (!containerRef.current || !contentRef.current || reviews.length === 0) return;

    const container = containerRef.current;
    const content = contentRef.current;
    const contentWidth = content.scrollWidth / 2; // Since we duplicate content
    let animationStartTime = null;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame (adjust for speed)

    const animate = (timestamp) => {
      if (!animationStartTime) animationStartTime = timestamp;
      
      if (!isHovered) {
        scrollPosition = (scrollPosition + scrollSpeed) % contentWidth;
        container.scrollLeft = scrollPosition;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [reviews.length, itemsPerPage, isHovered]);

  // Duplicate reviews for seamless looping
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="bg-[#121212] text-yellow-100 py-20 px-4 sm:px-10 lg:px-24">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          text1="What Our"
          text2=" Customers Say"
          subtitle="Real experiences from real musicians"
          useTypewriter
        />
      </motion.div>

      <div 
        ref={containerRef}
        className="overflow-x-hidden py-4 hide-scrollbar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          ref={contentRef}
          className="flex gap-8 w-max"
        >
          {duplicatedReviews.map((review, idx) => (
            <div 
              key={`${review._id || idx}-${idx}`}
              className="flex-shrink-0"
              style={{ width: `calc(${85/itemsPerPage}vw - ${itemsPerPage === 1 ? '10px' : itemsPerPage === 2 ? '60px' : '40px'})` }}
            >
              <Tilt glareEnable glareMaxOpacity={0.2} glareColor="#ffffff" glarePosition="all">
                <ReviewCard review={review} />
              </Tilt>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;