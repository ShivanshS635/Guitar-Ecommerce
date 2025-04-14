import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import OrderSuccessOverlay from '../components/OrderSuccessOverlay';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';

const PlaceOrder = () => {
  const inputStyle =
    'w-full py-2 px-4 rounded-md bg-white/80 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm';

  const cardStyle =
    'p-6 rounded-xl shadow-md border border-white/5 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100';

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, deliveryCharges, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [method, setMethod] = useState('cod');
  const [showOverlay, setShowOverlay] = useState(false);
  const paypalRef = useRef();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        const quantity = cartItems[itemId];
        const product = products.find((product) => product._id === itemId);
        if (product && quantity > 0) {
          const itemInfo = structuredClone(product);
          itemInfo.quantity = quantity;
          orderItems.push(itemInfo);
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliveryCharges,
        date: Date.now(),
      };

      if (method === 'cod') {
        const res = await axios.post(`${backendUrl}/api/order/place`, orderData, {
          headers: { token },
        });

        if (res.data.success) {
          setCartItems({});
          setShowOverlay(true);
          setTimeout(() => {
            setShowOverlay(false);
            navigate('/orders');
          }, 5000);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (method === 'paypal' && window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: (getCartAmount() + deliveryCharges).toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const paymentResult = await actions.order.capture();

          try {
            let orderItems = [];

            for (const itemId in cartItems) {
              const quantity = cartItems[itemId];
              const product = products.find((product) => product._id === itemId);
              if (product && quantity > 0) {
                const itemInfo = structuredClone(product);
                itemInfo.quantity = quantity;
                orderItems.push(itemInfo);
              }
            }

            const orderData = {
              address: formData,
              items: orderItems,
              amount: getCartAmount() + deliveryCharges,
              date: Date.now(),
              paymentResult,
            };

            const res = await axios.post(`${backendUrl}/api/order/paypal`, orderData, {
              headers: { token },
            });

            if (res.data.success) {
              setCartItems({});
              setShowOverlay(true);
              setTimeout(() => {
                setShowOverlay(false);
                navigate('/orders');
              }, 5000);
            } else {
              toast.error(res.data.message);
            }
          } catch (error) {
            toast.error('Payment failed');
            console.log(error);
          }
        },
        onError: (err) => {
          toast.error('PayPal error');
          console.log(err);
        },
      }).render(paypalRef.current);
    }
  }, [method]);

  return (
    <>
      {showOverlay && <OrderSuccessOverlay />}
      <form
        onSubmit={submitHandler}
        className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8 lg:px-16 pb-10 bg-[#121212]"
      >
        {/* Delivery Info */}
        <div className={`flex flex-col gap-4 w-full sm:max-w-[480px] ${cardStyle}`}>
          <div className="text-xl sm:text-2xl mb-1">
            <Title text1={'DELIVERY '} text2={'INFORMATION'} />
          </div>
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} type="text" placeholder="First Name" className={inputStyle} />
            <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" placeholder="Last Name" className={inputStyle} />
          </div>
          <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" placeholder="Email Address" className={inputStyle} />
          <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" placeholder="Street Address" className={inputStyle} />
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" placeholder="City" className={inputStyle} />
            <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" placeholder="State" className={inputStyle} />
          </div>
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} type="number" placeholder="Zipcode" className={inputStyle} />
            <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" placeholder="Country" className={inputStyle} />
          </div>
          <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" placeholder="Phone" className={inputStyle} />
        </div>

        {/* Cart & Payment */}
        <div className="flex flex-col w-full sm:max-w-[450px]">
          <CartTotal />

          <div className={`mt-12 ${cardStyle}`}>
            <Title text1={'PAYMENT '} text2={'METHOD'} />
            <div className="flex flex-col gap-4 mt-4">
              {[
                { key: 'stripe', logo: assets.stripe },
                { key: 'paypal', logo: assets.paypal },
                { key: 'razorpay', logo: assets.razorpay },
                { key: 'cod', label: 'CASH ON DELIVERY' }
              ].map((option) => (
                <div
                  key={option.key}
                  onClick={() => setMethod(option.key)}
                  className={`flex items-center gap-3 border p-3 rounded-md cursor-pointer transition duration-200 ${
                    method === option.key ? 'border-green-400 bg-green-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className={`min-w-4 h-4 border rounded-full ${method === option.key ? 'bg-green-500' : ''}`}></p>
                  {option.logo ? (
                    <img src={option.logo} className="h-10 mx-4" alt={option.key} />
                  ) : (
                    <p className="text-gray-600 text-sm font-medium mx-4">{option.label}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full text-end mt-8">
              {method === 'paypal' ? (
                <div ref={paypalRef} />
              ) : (
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-16 py-3 text-sm rounded-full hover:opacity-90 active:scale-95 transition-transform"
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;