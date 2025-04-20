import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck, FiStar, FiChevronLeft } from 'react-icons/fi';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (products.length > 0) {
      const foundProduct = products.find((item) => item._id === id);
      if (foundProduct) {
        setProductData(foundProduct);
        setSelectedImage(foundProduct.img?.[0] || '');
      }
      setLoading(false);
    }
  }, [products, id]);

  const handleAddToCart = () => {
    if (!productData) return;

    // Add multiple quantities if specified
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={`full-${i}`} className="text-yellow-400 fill-current w-4 h-4" />);
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-yellow-400 w-4 h-4" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="text-gray-300 w-4 h-4" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
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
      >
        <FiChevronLeft className="mr-1" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
        {/* Images Section */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-24 pb-2 sm:pb-0">
            {productData.img?.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <img
                  src={item}
                  onClick={() => {
                    setSelectedImage(item);
                    setImageLoading(true);
                  }}
                  className={`w-16 h-16 sm:w-full sm:h-20 object-cover cursor-pointer rounded border transition-all duration-200 ${selectedImage === item
                      ? 'ring-2 ring-yellow-500 border-yellow-500'
                      : 'border-gray-200 hover:border-yellow-400'
                    }`}
                  alt={`Thumbnail ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full sm:w-[calc(100%-6rem)] aspect-square bg-gray-50 rounded-xl overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            )}
            <motion.img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              onLoad={handleImageLoad}
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-yellow-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {productData.name}
          </motion.h1>


          <div className="flex items-center mt-3">
            <div className="flex mr-2">
              {renderStars(4.5)}
            </div>
          </div>

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
              </div>
            )}
          </motion.div>


          <motion.p
            className="mt-6 text-gray-700 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {productData.description}
          </motion.p>

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
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg transition-all duration-300 shadow-sm ${addedToCart
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
            >
              {addedToCart ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart ({quantity})
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
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FiCheck className="text-yellow-600 w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Authentic Products</h4>
                  <p className="text-gray-500">100% original products</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FiCheck className="text-yellow-600 w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-gray-500">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FiCheck className="text-yellow-600 w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-gray-500">On all orders</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FiCheck className="text-yellow-600 w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Secure Payments</h4>
                  <p className="text-gray-500">SSL encrypted</p>
                </div>
              </div>
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
        <RelatedProducts category={productData.category} currentProductId={productData._id} />
      </motion.div>

      {/* Success Notification */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <FiCheck className="w-5 h-5" />
              <span>Added to cart successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Product;