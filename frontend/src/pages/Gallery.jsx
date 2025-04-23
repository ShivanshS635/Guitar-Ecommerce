import React, { useState, useEffect, useContext } from 'react';
import Title from '../components/Title';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.jsx';

const categories = ['body', 'neck', 'inlay', 'product'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('body');
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/gallery/list`);
        if (res.data.success) {
          // Updated to match your response structure
          setAllItems(res.data.galleryImages || []);
        } else {
          setError('Failed to load gallery items');
        }
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, [backendUrl]);

  const filteredItems = allItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#121212]">
        <div className="text-yellow-500 text-lg">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#121212]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 sm:px-8 lg:px-16 py-10 bg-[#121212] text-yellow-100">
      <div className="text-center mb-8">
        <Title text1="PRODUCT " text2="GALLERY" />
        <div className="flex justify-center mt-6 gap-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`capitalize px-4 py-2 rounded-full border ${
                activeCategory === cat
                  ? 'bg-yellow-500 text-black font-medium'
                  : 'bg-white/10 text-yellow-200 hover:bg-white/20'
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-yellow-200 py-10">
          No images found in this category
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="break-inside-avoid overflow-hidden rounded-lg shadow-lg border border-white/5 hover:border-yellow-500/30 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={`${item.category} gallery item`}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;