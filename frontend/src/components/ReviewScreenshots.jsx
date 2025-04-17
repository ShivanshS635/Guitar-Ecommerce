import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ReviewScreenshots = () => {
  const [screenshots, setScreenshots] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { backendUrl } = useContext(ShopContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reviews/screenshots`);
        setScreenshots(res.data.screenshots || []);
      } catch (error) {
        console.error('Error fetching review screenshots:', error);
      }
    };
    fetchScreenshots();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'next' ? 300 : -300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="pt-12 px-4 sm:px-8 lg:px-16 text-yellow-100">
      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Customer Review Screenshots
      </h3>

      <div className="relative">
        {/* Left Arrow */}
        <button
              onClick={() => handleScroll('prev')}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full z-10 shadow"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleScroll('next')}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full z-10 shadow"
            >
              <ChevronRight size={24} />
            </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-4 scroll-smooth px-1"
        >
          {screenshots.map((ss, index) => (
            <div
              key={index}
              className="min-w-[90%] sm:min-w-[18rem] md:min-w-[22rem] lg:min-w-[26rem] max-w-full group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedImage(ss.imageUrl)}
            >
              <img
                src={ss.imageUrl}
                alt={`Screenshot ${index}`}
                className="w-full h-64 object-cover rounded-2xl transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-lg font-semibold">View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full max-w-3xl p-4">
            <motion.img
              src={selectedImage}
              alt="Review Screenshot"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
            >
              <X />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReviewScreenshots;
