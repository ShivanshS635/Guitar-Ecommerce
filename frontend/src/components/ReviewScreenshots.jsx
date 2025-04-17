import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion'; // For Modal animation
import { X } from 'lucide-react'; // Close icon

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
      const scrollAmount = direction === 'next' ? 300 : -300; // adjust the scroll amount as needed
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="pt-12 px-4 sm:px-8 lg:px-16 text-yellow-100">
      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">Customer Review Screenshots</h3>

      {/* Horizontal Scrolling Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('prev')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-black p-2 rounded-full shadow-lg hover:bg-yellow-400"
        >
          &lt;
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('next')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-black p-2 rounded-full shadow-lg hover:bg-yellow-400"
        >
          &gt;
        </button>

        {/* Horizontal Scrollable Images */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 py-4 scroll-smooth"
        >
          {screenshots.map((ss, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg border border-white/10 cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => setSelectedImage(ss.imageUrl)} // Open image in modal on click
            >
              <img
                src={ss.imageUrl}
                alt={`Screenshot ${index}`}
                className="w-48 h-48 object-cover rounded-lg transition-all group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <span className="text-white text-xl font-semibold">View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for selected image */}
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
