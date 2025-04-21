import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if(response.data.success) {
        setToken(response.data.token);
      }
      else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later." + error.message);
    }
  };
  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2 px-15 py-10 bg-white shadow-md rounded-[25px] transition-transform duration-300 hover:scale-105 hover:border hover:border-gray-400">
      <p id="heading" className="text-center mt-8 mb-8 text-gray-700 text-[1.2em]">Login</p>

      <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-gray-200 shadow-inner shadow-gray-400">
        <svg className="h-[1.3em] w-[1.3em] fill-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
        </svg>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-gray-600"
        />
      </div>

      <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-gray-200 shadow-inner shadow-gray-400">
        <svg className="h-[1.3em] w-[1.3em] fill-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
        </svg>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-gray-600"
        />
      </div>

      <div className="flex justify-center flex-row mt-10">
        <button
          type="submit"
          className="px-6 py-2 rounded bg-gray-300 text-gray-700 transition duration-300 hover:bg-gray-400 mr-2"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;