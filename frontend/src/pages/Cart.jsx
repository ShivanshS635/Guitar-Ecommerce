import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, cartItems, currency, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tempData = Object.keys(cartItems).map((item) => ({
      _id: item,
      quantity: cartItems[item],
    }));

    setCartData(tempData);
    setTimeout(() => setLoading(false), 500); // Simulate loading
  }, [cartItems]);

  return (
    <div className="border-t pt-14 px-4 sm:px-8 text-yellow-100 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] min-h-screen">
      <div className="text-2xl mb-14">
        <Title text1="Your " text2="Cart" />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cartData.length === 0 ? (
        // Empty Cart Message
        <div className="flex flex-col items-center justify-center py-32 text-center text-yellow-200">
          <img src={assets.empty_cart} alt="Empty Cart" className="bg-transparent  w-40 mb-6 opacity-80" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-sm text-yellow-400 mt-2">Start adding some products to see them here!</p>
          <button
            onClick={() => navigate('/collection')}
            className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-full text-sm transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cartData.map((item, index) => {
              const product = products.find((product) => product._id === item._id);
              return (
                <div
                  key={index}
                  className="py-4 border border-white/10 rounded-lg px-3 sm:px-6 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_1fr_0.5fr] items-center gap-4 bg-[#0f0f0f]"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <img src={product.img[0]} alt={product.name} className="w-16 sm:w-20 rounded-md" />
                    <div className="flex flex-col gap-1">
                      <h1 className="text-sm sm:text-lg font-semibold">{product.name}</h1>
                      <p className="text-yellow-400 text-sm">{currency}{product.price}</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) =>
                      e.target.value === '0' || e.target.value === ''
                        ? null
                        : updateQuantity(item._id, Number(e.target.value))
                    }
                    className="bg-black border border-white/10 text-yellow-100 text-sm px-2 py-1 rounded w-16 text-center"
                  />
                  <img
                    src={assets.bin}
                    alt="Delete"
                    className="w-4 sm:w-5 cursor-pointer filter brightness-0 invert opacity-70 hover:opacity-100 transition"
                    onClick={() => updateQuantity(item._id, 0)}
                  />
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate('/place-order')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm my-8 px-8 py-3 rounded-full transition"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
