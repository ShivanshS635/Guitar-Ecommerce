import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FiShoppingCart, FiCheck, FiStar, FiChevronLeft, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => setImageLoaded(true);

  // Memoized product finder
  const findProduct = useCallback(() => {
    return products.find((item) => item._id === id);
  }, [products, id]);

  useEffect(() => {
    setLoading(true);
    if (products.length > 0) {
      const foundProduct = findProduct();
      if (foundProduct) {
        setProductData(foundProduct);
        setSelectedImage(foundProduct.img?.[0] || '');
      }
      setLoading(false);
    }
  }, [products, id, findProduct]);

  const handleAddToCart = () => {
    if (!productData) return;

    addToCart(productData._id, quantity);
    setAddedToCart(true);
    
    const timer = setTimeout(() => setAddedToCart(false), 2000);
    return () => clearTimeout(timer);
  };

  const renderStars = useCallback((rating) => {
    return Array(5).fill(0).map((_, i) => {
      const starValue = i + 1;
      return (
        <FiStar
          key={i}
          className={`w-4 h-4 ${
            starValue <= Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : rating >= starValue - 0.5 && rating < starValue
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin w-12 h-12 text-yellow-400" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="border-t-2 pt-6 pb-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        aria-label="Go back"
      >
        <FiChevronLeft className="mr-1" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
        {/* Images Section */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-24 pb-2 sm:pb-0">
            {productData.img?.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 focus:outline-none"
                onClick={() => {
                  setSelectedImage(item);
                  handleImageLoad();
                }}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={item}
                  className={`w-16 h-16 sm:w-full sm:h-20 object-cover rounded border transition-all duration-200 ${
                    selectedImage === item
                      ? 'ring-2 ring-yellow-500 border-yellow-500'
                      : 'border-gray-200 hover:border-yellow-400'
                  }`}
                  alt={`Thumbnail ${index + 1}`}
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full sm:w-[calc(100%-6rem)] aspect-square bg-gray-50 rounded-xl overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiLoader className="animate-spin w-8 h-8 text-yellow-400" />
              </div>
            )}
            <motion.img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onLoad={handleImageLoad}
              loading="eager"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">
              {productData.name}
            </h1>

            <div className="flex items-center mt-3">
              <div className="flex mr-2">{renderStars(productData.rating || 4.5)}</div>
              
            </div>
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-yellow-500">
              {formatPrice(productData.price)}
            </div>
            {productData.originalPrice && (
              <div className="text-lg text-gray-500 line-through">
                {formatPrice(productData.originalPrice)}
                <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  {Math.round(
                    ((productData.originalPrice - productData.price) /
                      productData.originalPrice *
                      100
                  ))}
                  % OFF
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-medium text-lg mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {productData.description}
            </p>
          </motion.div>

          {productData.specifications && (
            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-medium text-lg mb-2">Specifications</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <li key={key} className="flex">
                    <span className="text-gray-500 mr-2">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${
                addedToCart
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              }`}
              aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
            >
              {addedToCart ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </motion.div>

          <motion.div
            className="mt-8 pt-6 border-t border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                {
                  title: 'Authentic Products',
                  description: '100% original products',
                },
                {
                  title: 'Easy Returns',
                  description: '7-day return policy',
                },
                {
                  title: 'Free Shipping',
                  description: 'On all orders',
                },
                {
                  title: 'Secure Payments',
                  description: 'SSL encrypted',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FiCheck className="text-yellow-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts 
          category={productData.category} 
          currentProductId={productData._id} 
        />
      </motion.div>

      {/* Success Notification */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <FiCheck className="w-5 h-5" />
            <span>Added {quantity} item{quantity > 1 ? 's' : ''} to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Product;