import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const {token , setToken , navigate , backendUrl} = useContext(ShopContext);

  const [name , setName] = useState('');
  const [password , setPassword] = useState('');
  const [email , setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(currentState === 'Sign Up'){
        const res = await axios.post(backendUrl + '/api/user/register' , {name , email , password});
        if(res.data.success){
          setToken(res.data.token);
          localStorage.setItem('token' , res.data.token)
        }
        else{
          toast.error(res.data.message)
        }
      }else{
        const res = await axios.post(backendUrl + '/api/user/login' , {email , password});
        if(res.data.success){
          setToken(res.data.token);
          localStorage.setItem('token' , res.data.token)
        }
        else{
          toast.error(res.data.message)
        }
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if(token){
      navigate('/');
    }
  } , [token])

  return (
    <div className='flex items-center justify-center min-h-screen bg-black px-4'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center justify-center w-full sm:max-w-md bg-[white] p-8 rounded-xl shadow-md gap-4 text-gray-800'
      >
        <div className='inline-flex items-center gap-3 mb-2'>
          <p className='text-3xl font-semibold'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-10 bg-gray-800' />
        </div>

        {currentState === 'Login' ? null : (
          <input
            type='text'
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            required
          />
        )}
        <input
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
        />
        <input
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
        />

        <div className='w-full flex justify-between text-sm text-gray-600 mt-[-6px]'>
          {currentState === 'Login' ? (
            <p
              className='cursor-pointer hover:underline'
              onClick={() => setCurrentState('Sign Up')}
            >
              Create an Account
            </p>
          ) : (
            <p
              className='cursor-pointer hover:underline'
              onClick={() => setCurrentState('Login')}
            >
              Already have an Account
            </p>
          )}
        </div>

        <button
          type='submit'
          className='bg-black text-white px-8 py-2 rounded-full mt-4 hover:bg-gray-900 transition'
        >
          {currentState}
        </button>
      </form>
    </div>
  );
};

export default Login;
