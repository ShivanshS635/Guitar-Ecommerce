import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

// Sample order statuses and progress %
const statuses = [
  { label: 'Order Placed', color: 'text-blue-500', progress: 20 },
  { label: 'Processing', color: 'text-yellow-500', progress: 50 },
  { label: 'Ready to Ship', color: 'text-green-500', progress: 75 },
  { label: 'Shipped', color: 'text-purple-500', progress: 90 },
  { label: 'Delivered', color: 'text-emerald-600', progress: 100 },
];

// Random utility
const getRandomDate = () => {
  const start = new Date(2024, 11, 1);
  const end = new Date();
  const date = new Date(+start + Math.random() * (end - start));
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Orders = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-10'>
        <Title text1={'MY '} text2={'ORDERS'} />
      </div>

      <div className='flex flex-col gap-6'>
        {
          products.slice(0, 4).map((item, index) => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const orderDate = getRandomDate();

            return (
              <div
  key={index}
  className='p-4 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100 shadow-sm hover:shadow-md transition duration-300'
>


                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  {/* Left */}
                  <div className='flex items-start gap-4 text-sm'>
                    <img src={item.img[0]} alt={item.name} className='h-20 w-20 rounded-md object-cover' />
                    <div>
                      <p className='font-medium text-base'>{item.name}</p>
                      <div className='flex items-center gap-4 mt-2 text-sm text-gray-700'>
                        <p className='text-lg font-semibold'>{currency}{item.price}</p>
                        <p>Qty: 1</p>
                      </div>
                      <p className='mt-2 text-xs text-gray-500'>📅 Ordered on {orderDate}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className='flex flex-col gap-2 md:items-end md:text-right w-full md:w-auto'>
                    <p className={`font-medium text-sm ${status.color}`}>{status.label}</p>
                    <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                      <div
                        className='bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-700'
                        style={{ width: `${status.progress}%` }}
                      ></div>
                    </div>
                    <button className='mt-2 border border-gray-800 text-gray-800 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition'>
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        }

        {products.length === 0 && (
          <p className='text-center text-gray-400 mt-10'>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
