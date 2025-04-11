import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const CartTotal = () => {
  const { currency, getCartAmount, deliveryCharges } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + deliveryCharges;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100 p-6 rounded-xl shadow-md border border-white/5">
      <div className="text-2xl mb-4">
        <Title text1="CART " text2="TOTAL" />
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currency}{subtotal}.00</span>
        </div>

        <hr className="border-yellow-900" />

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>{currency}{deliveryCharges}.00</span>
        </div>

        <hr className="border-yellow-900" />

        <div className="flex justify-between font-semibold text-yellow-300 text-base">
          <span>Total</span>
          <span>{currency}{total}.00</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
