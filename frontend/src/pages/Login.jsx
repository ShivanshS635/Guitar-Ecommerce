import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [mode, setMode] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'Login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin
        ? `${backendUrl}/api/user/login`
        : `${backendUrl}/api/user/register`;

      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await axios.post(url, payload);

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full sm:max-w-md bg-white p-8 rounded-xl shadow-md gap-4 text-gray-800"
      >
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold">{mode}</h2>
          <p className="text-sm text-gray-600">
            {isLogin ? 'Welcome back!' : 'Join us today'}
          </p>
        </div>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        {isLogin && (
          <div className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
            <p onClick={() => navigate('/forgot-password')}>Forgot Password?</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-2 rounded-full mt-4 hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode}
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          {isLogin ? "Don't have an account?" : 'Already a member?'}{' '}
          <span
            onClick={() => setMode(isLogin ? 'Sign Up' : 'Login')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
