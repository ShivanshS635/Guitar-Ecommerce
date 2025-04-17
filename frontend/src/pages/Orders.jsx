import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import jsPDF from 'jspdf';
import { assets } from '../assets/assets';

const Orders = () => {
  const { backendUrl, token, currency , deliveryCharges } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const res = await axios.post(backendUrl + '/api/order/userOrders', {}, { headers: { Authorization: `Bearer ${token}`} });
      setOrderData(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getEstimatedDeliveryDate = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
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
    const doc = new jsPDF();
    const orange = [217, 83, 30];
    const grey = [245, 245, 245];
  
    // Header Bar
    doc.setFillColor(...orange);
    doc.rect(0, 0, 210, 12, 'F');
  
    // Grey Info Background (Sub-header)
    doc.setFillColor(...grey);
    doc.rect(10, 16, 190, 32, 'F');
  
    // Watermark
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.text('3xizGuitars', 105, 150, { align: 'center', angle: 45 });
  
    // Logo
    if (logoUrl) {
      doc.addImage(logoUrl, 'JPEG', 14, 20, 26, 26);
    }
  
    // Seller Info
    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text('3xizGuitars', 45, 24);
    doc.text('Yamuna Nagar', 45, 30);
    doc.text('3xizguitars@gmail.com', 45, 36);
    doc.text('+91 95180 35716', 45, 42);
  
    doc.setFontSize(18);
    doc.setTextColor(50);
    doc.text('RECEIPT', 148, 24, { align: 'center' });
  
    // Receipt Number + Date
    doc.setFontSize(11);
    doc.setTextColor(50);
    const hash = btoa(order._id + order.date).replace(/[^A-Z0-9]/gi, '').slice(0, 6).toUpperCase();
    const datePart = new Date(order.date).toISOString().slice(2, 10).replace(/-/g, '');
    const receiptNo = `3XIZ-${datePart}-${hash}`;
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 135, 36);
    doc.text(`Receipt No: ${receiptNo}`, 135, 42);
  
    // Billing & Shipping
    let y = 60;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('BILL TO', 14, y);
    doc.text('SHIP TO', 110, y);
  
    const addr = order.address;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`${addr.firstName} ${addr.lastName}`, 14, y + 8);
    doc.text(`${addr.street}`, 14, y + 14);
    doc.text(`${addr.city}`, 14, y + 20);
    doc.text(`${addr.email}`, 14, y + 26);
  
    doc.text(`${addr.firstName} ${addr.lastName}`, 110, y + 8);
    doc.text(`${addr.street}`, 110, y + 14);
    doc.text(`${addr.city}`, 110, y + 20);
    doc.text(`${addr.phone || ''}`, 110, y + 26);
  
    // Table Headers
    y += 38;
    doc.setFillColor(...orange);
    doc.setTextColor(255);
    doc.rect(12, y, 182, 10, 'F');
    doc.setFontSize(11);
    doc.text('DESCRIPTION', 16, y + 7);
    doc.text('QTY', 110, y + 7);
    doc.text('UNIT PRICE', 135, y + 7);
    doc.text('TOTAL', 175, y + 7);
  
    // Table Rows
    y += 15;
    doc.setTextColor(0);
    order.items.forEach((item) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      doc.rect(12, y - 5, 182, 10);
      doc.text(item.name, 16, y + 2);
      doc.text(String(item.quantity), 110, y + 2);
      doc.text(`${currency}${item.price.toFixed(2)}`, 135, y + 2);
      doc.text(`${currency}${itemTotal}`, 175, y + 2);
      y += 10;
    });
  
    // Summary
    const summaryX = 130;
    y += 6;
    const discount = order.discount || 0;
    const shipping = order.deliveryCharges || 0;
    const total = order.amount - discount + shipping;
  
    doc.setFontSize(11);
    doc.text('SUBTOTAL:', summaryX, y);
    doc.text(`${currency}${order.amount.toFixed(2)}`, 195, y, null, null, 'right');
  
    y += 7;
    doc.text('DISCOUNT:', summaryX, y);
    doc.text(`${currency}${discount.toFixed(2)}`, 195, y, null, null, 'right');
  
    y += 7;
    doc.text('SHIPPING:', summaryX, y);
    doc.text(`${currency}${shipping.toFixed(2)}`, 195, y, null, null, 'right');
  
    // Total Paid Box
    y += 10;
    doc.setFillColor(220, 240, 220);
    doc.rect(summaryX, y - 6, 70, 12, 'F');
    doc.setFontSize(13);
    doc.setTextColor(0, 100, 0);
    doc.text('TOTAL PAID', summaryX + 2, y + 2);
    doc.text(`${currency}${total.toFixed(2)}`, 195, y + 2, null, null, 'right');
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    y += 30;
    doc.line(10, y, 200, y);
    doc.text('Thank you for trusting 3xizGuitars!', 14, y + 8);
    doc.text('For queries: 3xizguitars@gmail.com', 14, y + 14);
    doc.text('This is a computer-generated receipt and does not require a signature.', 14, y + 20);
  
    // Outer Border
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.rect(8, 14, 194, y + 22);
  
    // Save
    const customerName = `${addr.firstName}_${addr.lastName}`.replace(/\s+/g, '_');
    const receiptDate = new Date(order.date).toISOString().split('T')[0];
    doc.save(`3xizGuitars_Receipt_${customerName}_${receiptDate}.pdf`);
  };
  
  return (
    <div className="border-t pt-16">
      <div className="text-2xl font-semibold mb-10 text-center text-gray-800">
        <Title text1={'MY '} text2={'ORDERS'} />
      </div>

      <div className="flex flex-col gap-6">
        {orderData.map((order, index) => {
          const orderDate = new Date(order.date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          const estimatedDeliveryDate = getEstimatedDeliveryDate(order.date);

          return (
            <div
              key={index}
              className="p-6 rounded-lg bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] text-yellow-100 border border-white/5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                          src={item.img[0]}
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
