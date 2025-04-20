import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CurrencyConverter = () => {
  const { selectedCurrency, handleCurrencyChange } = useContext(ShopContext);

  return (
    <div className="currency-selector">
      <select
        value={selectedCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className="bg-transparent text-yellow-400 border border-yellow-400 rounded px-2 py-1 text-sm focus:outline-none"
      >
        <option value="INR">₹ INR</option>
        <option value="USD">$ USD</option>
        <option value="EUR">€ EUR</option>
        <option value="GBP">£ GBP</option>
      </select>
    </div>
  );
};

export default CurrencyConverter;