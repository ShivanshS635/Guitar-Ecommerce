import React, { useState, useEffect, useContext } from 'react';
import Title from '../components/Title';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.jsx';

const categories = ['body', 'neck', 'inlay', 'product'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('body');
  const [allItems, setAllItems] = useState([]);
  const { backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/gallery/list`);
        if (res.data.success) {
          console.log(res.data);
          setAllItems(res.data.galleryItems); // updated to res.data.galleryItems
        }
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
      }
    };
    fetchGalleryItems();
  }, [backendUrl]);

  const filteredItems = allItems.filter(item => item.category === activeCategory);

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
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-yellow-200 hover:bg-white/20'
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="break-inside-avoid overflow-hidden rounded-lg shadow border border-white/5"
          >
            <img
              src={item.image}
              alt={item.category}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
