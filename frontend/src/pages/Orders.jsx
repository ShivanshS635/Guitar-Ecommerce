import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import jsPDF from 'jspdf'; // Add jsPDF library to generate PDFs
import { assets } from '../assets/assets';

const Orders = () => {
  const { backendUrl, token, currency , deliveryCharges } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const res = await axios.post(backendUrl + '/api/order/userOrders', {}, { headers: { token } });
      setOrderData(res.data.orders); // Update order data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Function to calculate estimated delivery date (5 days from order date)
  const getEstimatedDeliveryDate = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days to the order date
    return deliveryDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const generateReceipt = (order, currency, logoUrl) => {
    if (!order || !order.items || !order._id || !order.date || !order.address) {
      console.error('Order data is incomplete or missing.');
      return;
    }
  
    const doc = new jsPDF();
    
    // Set Font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
  
    // Logo (ensure it’s available)
    if (logoUrl) {
      doc.addImage(logoUrl, 'JPEG', 14, 10, 30, 30); // Adjust logo size and positioning
    } else {
      console.error("Logo URL is missing or incorrect.");
    }
  
    // Seller's Details
    doc.setTextColor(33, 33, 33); // White text color
    doc.text('Seller:', 60, 20);
    doc.text('Your Company Name', 60, 30);
    doc.text('Your Company Address', 60, 40);
    doc.text('Phone: +123 456 7890', 60, 50);
    doc.text('Email: contact@yourcompany.com', 60, 60);
  
    // Receipt Information
    doc.setFontSize(14);
    doc.text('RECEIPT', 170, 20);
    doc.setFontSize(12);
    doc.text(`Receipt Number: ${order._id}`, 170, 30);
    doc.text(`Receipt Date: ${new Date(order.date).toLocaleString()}`, 170, 40);
  
    // Client's Details
    doc.text('Client:', 14, 70);
    doc.text(`Name: ${order.address.firstName} ${order.address.lastName}`, 14, 80);
    doc.text(`Email: ${order.address.email}`, 14, 90);
    doc.text(`Address: ${order.address.street}, ${order.address.city}`, 14, 100);
  
    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 255, 255);
    doc.line(14, 110, 195, 110);  // Horizontal line
    
    // Order Summary
    doc.setFontSize(14);
    doc.text('Order Summary', 14, 120);
    doc.setFontSize(12);
    doc.text('Item', 14, 130);
    doc.text('Quantity', 140, 130);
    doc.text('Price', 180, 130);
  
    let yOffset = 140;
    order.items.forEach((item) => {
      // Ensure item.price is a valid number before using toFixed()
      const price = typeof item.price === 'number' ? item.price : 0; // Default to 0 if not a number
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1; // Default to 1 if not a number
  
      doc.text(item.name, 14, yOffset);
      doc.text(String(quantity), 140, yOffset); // Ensure quantity is a string
      doc.text(`${currency}${price.toFixed(2)}`, 180, yOffset); // Ensure price is a string
      yOffset += 10;
    });
  
    // Divider
    doc.line(14, yOffset + 10, 195, yOffset + 10);
  
    // Invoice Summary
    doc.setFontSize(14);
    doc.text('Invoice Summary', 14, yOffset + 20);
    doc.setFontSize(12);
    doc.text(`Subtotal: ${currency}${order.amount.toFixed(2)}`, 14, yOffset + 30);
    doc.text(`Delivery Charges: ${currency}${deliveryCharges.toFixed(2)}`, 14, yOffset + 40);
    doc.text(`Total: ${currency}${(order.amount + deliveryCharges).toFixed(2)}`, 14, yOffset + 50);
  
    // Footer - Terms & Thanks
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', 14, yOffset + 80);
    doc.text('www.yourwebsite.com', 14, yOffset + 90);
  
    // Save PDF
    doc.save(`Receipt_${order._id}.pdf`);
  };
  
  
  
  
  
  


  return (
    <div className="border-t pt-16">
      <div className="text-2xl font-semibold mb-10 text-center text-gray-800">
        <Title text1={'MY '} text2={'ORDERS'} />
      </div>

      <div className="flex flex-col gap-6">
        {orderData.map((order, index) => {
          // Format order date
          const orderDate = new Date(order.date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          // Get estimated delivery date
          const estimatedDeliveryDate = getEstimatedDeliveryDate(order.date);

          return (
            <div
              key={index}
              className="p-6 rounded-lg bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100 border border-white/5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left */}
                <div className="flex flex-col gap-6">
                  <div className="text-lg font-medium text-yellow-100">
                    Order placed on {orderDate}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center bg-[#181818] p-4 rounded-lg border border-[#2c2c2c] shadow-sm hover:shadow-md transition duration-200"
                      >
                        <img
                          src={item.img[0]} // Display the image of the item
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-sm text-yellow-100">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                          <p className="font-semibold text-sm text-yellow-200">{currency}{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-4 items-center md:items-end md:text-right w-full md:w-auto">
                  <div className="text-sm text-green-600 font-semibold">Order Placed</div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">📅 Estimated Delivery: {estimatedDeliveryDate}</p>
                  </div>
                  <button
                    className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-400 transition duration-200"
                    onClick={() => generateReceipt(order , currency , assets.logo)}
                  >
                    Generate Receipt
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {orderData.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
