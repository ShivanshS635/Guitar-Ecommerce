// src/pages/ForgotPassword.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black px-4'>
      <form
        onSubmit={handleForgot}
        className='flex flex-col items-center justify-center w-full sm:max-w-md bg-white p-8 rounded-xl shadow-md gap-4 text-gray-800'
      >
        <h2 className='text-2xl font-semibold'>Forgot Password</h2>
        <input
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your registered email'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
        />
        <button
          type='submit'
          className='bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition'
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
