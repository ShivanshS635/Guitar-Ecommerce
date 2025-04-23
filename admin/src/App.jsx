import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
import Login from './components/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import Edit from './pages/Edit.jsx'
import AdminUpload from './pages/AdminUpload.jsx'
import UploadGallery from './pages/UploadGallery.jsx'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';


const App = () => {
  const [token , setToken] = useState(localStorage.getItem('token') || '');
  useEffect(() => {
    localStorage.setItem('token', token);
  }
  , [token]);
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === '' ? <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Login setToken={setToken}/>
      </div>
      :
      <>
        <Navbar setToken={setToken}/>
        <hr />
        <div className='flex w-full'>
          <Sidebar/>
          <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
            <Routes>
              <Route path='/' element={<Add/>}/>
              <Route path='/add' element={<Add token = {token}/>}/>
              <Route path='/edit/:id' element={<Edit token = {token}/>}/>
              <Route path='/list' element={<List token = {token}/>}/>
              <Route path='/orders' element={<Orders token = {token}/>}/>
              <Route path='/upload' element={<AdminUpload token={token}/>}/>
              <Route path='/gallery' element={<UploadGallery/>}/>
            </Routes>
          </div>
        </div>
      </>
      }
    </div>
  )
}

export default App