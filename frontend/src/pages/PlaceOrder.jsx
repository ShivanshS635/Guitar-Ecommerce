import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets.js';
import { ShopContext } from '../context/ShopContext.jsx';

const inputStyle =
  'w-full py-2 px-4 rounded-md bg-white/80 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm';

const cardStyle =
  'p-6 rounded-xl shadow-md border border-white/5 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate } = useContext(ShopContext);

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8 lg:px-16 pb-10 bg-[#121212]'>
      
      {/* Left Section - Delivery Info */}
      <div className={`flex flex-col gap-4 w-full sm:max-w-[480px] ${cardStyle}`}>
        <div className='text-xl sm:text-2xl mb-1'>
          <Title text1={'DELIVERY '} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input type='text' placeholder='First Name' className={inputStyle} />
          <input type='text' placeholder='Last Name' className={inputStyle} />
        </div>
        <input type='email' placeholder='Email Address' className={inputStyle} />
        <input type='text' placeholder='Street Address' className={inputStyle} />
        <div className='flex gap-3'>
          <input type='text' placeholder='City' className={inputStyle} />
          <input type='text' placeholder='State' className={inputStyle} />
        </div>
        <div className='flex gap-3'>
          <input type='number' placeholder='Zipcode' className={inputStyle} />
          <input type='text' placeholder='Country' className={inputStyle} />
        </div>
        <input type='number' placeholder='Phone' className={inputStyle} />
      </div>

      {/* Right Section - Cart + Payment */}
      <div className='flex flex-col w-full sm:max-w-[450px]'>
          <CartTotal />

        <div className={`mt-12 ${cardStyle}`}>
          <Title text1={'PAYMENT '} text2={'METHOD'} />
          <div className='flex flex-col gap-4 mt-4'>
            {[
              { key: 'stripe', logo: assets.stripe },
              { key: 'paypal', logo: assets.paypal },
              { key: 'razorpay', logo: assets.razorpay },
              { key: 'cod', label: 'CASH ON DELIVERY' },
            ].map((option) => (
              <div
                key={option.key}
                onClick={() => setMethod(option.key)}
                className={`flex items-center gap-3 border p-3 rounded-md cursor-pointer transition duration-200 ${
                  method === option.key ? 'border-green-400 bg-green-50' : 'hover:bg-gray-100'
                }`}
              >
                <p
                  className={`min-w-4 h-4 border rounded-full ${
                    method === option.key ? 'bg-green-500' : ''
                  }`}
                ></p>
                {option.logo ? (
                  <img src={option.logo} className='h-10 mx-4' alt={option.key} />
                ) : (
                  <p className='text-gray-600 text-sm font-medium mx-4'>{option.label}</p>
                )}
              </div>
            ))}
          </div>

          <div className='w-full text-end mt-8'>
            <button
              onClick={() => navigate('/orders')}
              className='bg-gradient-to-r from-black to-gray-800 text-white px-16 py-3 text-sm rounded-full hover:opacity-90 active:scale-95 transition-transform'
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
