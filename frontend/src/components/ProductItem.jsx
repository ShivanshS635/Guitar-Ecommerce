import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const ProductItem = ({ id, img, name, price, listView = false }) => {
  const { currency } = useContext(ShopContext);
    

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className={listView ? 'flex-1' : ''}
    >
      <Link
        to={`/product/${id}`}
        className={`relative bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] 
        hover:from-[#222] hover:via-[#1a1a1a] hover:to-[#111] rounded-xl overflow-hidden 
        text-yellow-100 ${listView ? 'flex gap-4 h-40' : 'w-60'} shadow-md hover:shadow-lg 
        border border-white/5 hover:border-yellow-400/10 transition-all duration-300`}
      >
        {/* Image */}
        <div className={`relative ${listView ? 'w-40 h-full' : 'aspect-[1/1]'}`}>
          <img
            src={img[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />

          {!listView && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-sm text-yellow-300 font-semibold bg-black/60 px-3 py-1 rounded-full">
                View Product
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-3 py-2 flex flex-col justify-center">
          <p className="text-sm text-yellow-200 line-clamp-2 h-[3em] leading-snug">{name}</p>
          <p className="text-sm font-semibold text-yellow-400">{currency}{price}</p>
        </div>
      </Link>
    </motion.div>
  );
};


export default ProductItem;
