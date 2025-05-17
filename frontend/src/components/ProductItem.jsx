import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ProductItem = ({ id, img, name, price, listView = false }) => {
  const { formatPrice } = useContext(ShopContext);

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative group ${listView ? 'flex w-full' : 'w-full'} bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]
        rounded-2xl overflow-hidden border border-white/10 shadow-md hover:shadow-yellow-500/10 transition-all duration-300`}
    >
      <Link to={`/product/${id}`} className={`flex ${listView ? 'flex-row' : 'flex-col'} w-full h-full`}>
        {/* Product Image */}
        <div
          className={`relative overflow-hidden ${listView ? 'w-48 h-48' : 'w-full aspect-square'} bg-black`}
        >
          <img
            src={img[0]}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-yellow-400 bg-black/70 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              View Product <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div
          className={`flex flex-col justify-center px-4 py-3 gap-1 
            ${listView ? 'w-full' : 'text-center items-center'}`}
        >
          <h3 className="text-yellow-100 text-sm font-medium line-clamp-2">{name}</h3>
          <p className="text-yellow-400 text-base font-bold">{formatPrice(price)}</p>
        </div>
      </Link>

      {/* Optional glow border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-yellow-400/30 transition-all duration-300" />
    </motion.div>
  );
};

export default ProductItem;
