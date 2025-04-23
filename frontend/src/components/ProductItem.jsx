import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaCartPlus } from 'react-icons/fa';

const ProductItem = ({ id, img, name, price, listView = false }) => {
  const { formatPrice, addToCart } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id);
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100 
        rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-white/5 
        hover:border-yellow-400/20 transition-all duration-300 
        ${listView ? 'flex gap-4 p-4 h-40 w-full' : 'p-4 w-full max-w-xs'}`}
    >
      {/* Image */}
      <div className={`${listView ? 'w-40 h-full flex-shrink-0' : 'aspect-square w-full mb-4'}`}>
        <img
          src={img[0]}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className={`${listView ? 'flex flex-col justify-between flex-1' : ''}`}>
        <div className={`${listView ? '' : 'mb-3'}`}>
          <h3 className="text-sm font-medium text-yellow-200 mb-1 line-clamp-2">{name}</h3>
          <p className="text-base font-semibold text-yellow-400">
            {formatPrice(price.current)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className={`bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded-lg 
            flex items-center justify-center gap-2 transition-colors 
            ${listView ? 'w-fit text-sm' : 'w-full'}`}
        >
          <FaCartPlus size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
