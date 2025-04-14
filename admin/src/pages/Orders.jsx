import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Orders = ({token}) => {

  const [orders , setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      if(!token) return null;

      const res = await axios.post(backendUrl + '/api/order/list' , {} , {headers : {token}});
      if(res.data.success){
        setOrders(res.data.allOrders);
      }else{
        toast.error()
      }
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchAllOrders();
  } , [token])

  return (
    <div>Orders</div>
  )
}

export default Orders