import React, { useEffect, useState } from 'react'
import { backendUrl , currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({token}) => {
  const navigate = useNavigate();
  const[list , setList] = useState([]);

  const fetchList = async () => {
    try {      
      const response = await axios.get(backendUrl + '/api/product/list');
      
      if(response.data.success){
        setList(response.data.products);
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove' , {id} , {headers : {token : token}});
      if(response.data.success){
        toast.success('Product removed successfully');
        fetchList();
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <>
      <p className='mb-2'>All Products</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center bg-gray-100 text-sm border py-1 px-2'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {
          list.map((item , index) => (
            <div key={index} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border py-2 px-2'>
              <img src={item.img[0]} alt={item.name} className='w-16 h-16 object-center' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='flex gap-2 justify-center'>
                <button onClick={() => navigate(`/edit/${item._id}`)} className='bg-blue-500 text-white px-2 py-1 rounded'>Edit</button>
                <button onClick={() => removeProduct(item._id)} className='bg-red-500 text-white px-2 py-1 rounded'>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List