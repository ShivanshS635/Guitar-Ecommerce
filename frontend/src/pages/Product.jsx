import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { motion } from 'framer-motion';

const Product = () => {
  const { id } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const fetchProductData = async () => {
    const found = products.find(item => item._id === id);
    if (found) {
      setProductData(found);
      setImage(found.img[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(productData._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh] animate-pulse'>
        <img src={assets.loader} alt="loading" className='w-12 h-12 opacity-60' />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className='text-center py-20 text-gray-500'>
        Product not found.
      </div>
    );
  }

  return (
    <motion.div
      className='border-t-2 pt-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.img.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer h-auto border rounded-lg p-1 transition-all duration-300 hover:ring-2 hover:ring-yellow-400 ${image === item ? 'ring-2 ring-yellow-500' : ''}`}
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto rounded-xl shadow-sm' />
          </div>
        </div>
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => <img key={i} className='w-3.5' src={assets.star} />)}
            <img className='w-3.5' src={assets.emptyStar} />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 px-8 py-3 text-sm mt-8 rounded-full transition-all duration-300 shadow-md text-white ${
              added
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
            }`}
          >
            <img
              src={added ? assets.checkIcon : assets.cartLogo}
              alt="icon"
              className='w-4 h-4 filter brightness-0 invert'
            />
            {added ? 'Added!' : 'Add to Cart'}
          </button>

          <hr className='mt-8 md:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>✅ 100% Original Product</p>
            <p>🚚 Cash On Delivery Available</p>
            <p>🔄 Easy Return & Exchange Within 7 Days</p>
          </div>
        </div>
      </div>
      <RelatedProducts category={productData.category} />
    </motion.div>
  );
};

export default Product;
