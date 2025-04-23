import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(ShopContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black px-4'>
      <form onSubmit={handleSubmit} className='flex flex-col bg-white p-6 rounded-lg gap-4 w-full sm:max-w-md text-gray-800 shadow-md'>
        <h2 className='text-2xl font-bold text-center'>Reset Password</h2>
        <input
          type='password'
          placeholder='New Password'
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
        />
        <input
          type='password'
          placeholder='Confirm Password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
        />
        <button
          type='submit'
          className='bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition'
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
