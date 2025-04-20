import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import jsPDF from 'jspdf';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiShoppingBag, FiTruck } from 'react-icons/fi';

const Orders = () => {
  const { backendUrl, token, formatPrice, deliveryCharges } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await axios.post(
        backendUrl + '/api/order/userOrders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderData(res.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
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
    });
  };

  const generateReceipt = (order) => {
    const doc = new jsPDF();
    const orange = [217, 83, 30];
    const grey = [245, 245, 245];
    const darkGrey = [40, 40, 40];
  
    // Set document metadata
    doc.setProperties({
      title: `Order Receipt - ${order._id}`,
      subject: 'Purchase Receipt',
      author: '3xizGuitars',
    });
  
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
    doc.addImage(assets.logo, 'JPEG', 14, 20, 26, 26);
  
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
      doc.text(formatPrice(item.price), 135, y + 2);
      doc.text(formatPrice(item.price * item.quantity), 175, y + 2);
      y += 10;
    });
  
    // Summary
    const summaryX = 130;
    y += 6;
    const discount = order.discount || 0;
    const shipping = order.deliveryCharges || deliveryCharges;
    const total = order.amount - discount + shipping;
  
    doc.setFontSize(11);
    doc.text('SUBTOTAL:', summaryX, y);
    doc.text(formatPrice(order.amount), 195, y, null, null, 'right');
  
    y += 7;
    doc.text('DISCOUNT:', summaryX, y);
    doc.text(formatPrice(discount), 195, y, null, null, 'right');
  
    y += 7;
    doc.text('SHIPPING:', summaryX, y);
    doc.text(formatPrice(shipping), 195, y, null, null, 'right');
  
    // Total Paid Box
    y += 10;
    doc.setFillColor(220, 240, 220);
    doc.rect(summaryX, y - 6, 70, 12, 'F');
    doc.setFontSize(13);
    doc.setTextColor(0, 100, 0);
    doc.text('TOTAL PAID', summaryX + 2, y + 2);
    doc.text(formatPrice(total), 195, y + 2, null, null, 'right');
  
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

  const getOrderStatus = (orderDate) => {
    const orderDateTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const daysPassed = Math.floor((currentTime - orderDateTime) / (1000 * 60 * 60 * 24));
    
    if (daysPassed < 1) return { status: 'Processing', color: 'text-blue-400' };
    if (daysPassed < 3) return { status: 'Shipped', color: 'text-yellow-400' };
    if (daysPassed < 5) return { status: 'In Transit', color: 'text-orange-400' };
    return { status: 'Delivered', color: 'text-green-400' };
  };

  return (
    <div className="border-t pt-16 px-4 sm:px-8 pb-12 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0d0d0d] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-2xl font-semibold mb-10 text-center text-yellow-100">
          <Title text1={'MY '} text2={'ORDERS'} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <p>{error}</p>
            <button
              onClick={loadOrderData}
              className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-400 transition duration-200"
            >
              Retry
            </button>
          </div>
        ) : orderData.length > 0 ? (
          <div className="grid gap-6">
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
              const orderStatus = getOrderStatus(order.date);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 rounded-lg bg-[#0f0f0f] text-yellow-100 border border-white/5 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-yellow-100">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            <FiCalendar className="inline mr-2" />
                            Placed on {orderDate}
                          </p>
                        </div>
                        <div className={`text-sm font-medium ${orderStatus.color}`}>
                          <FiShoppingBag className="inline mr-2" />
                          {orderStatus.status}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {order.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center bg-[#181818] p-4 rounded-lg border border-[#2c2c2c]"
                          >
                            <img
                              src={item.img[0]}
                              alt={item.name}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                            <div className="ml-4 flex-1">
                              <p className="font-medium text-sm text-yellow-100">{item.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                              <p className="font-semibold text-sm text-yellow-200 mt-1">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center md:items-end md:text-right w-full md:w-auto">
                      <div className="flex items-center text-sm text-green-400">
                        <FiTruck className="mr-2" />
                        <span>Estimated Delivery: {estimatedDeliveryDate}</span>
                      </div>
                      <div className="text-lg font-semibold mt-2">
                        Total: {formatPrice(order.amount + (order.deliveryCharges || deliveryCharges))}
                      </div>
                      <button
                        className="mt-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-sm transition duration-200 flex items-center"
                        onClick={() => generateReceipt(order)}
                      >
                        <FiDownload className="mr-2" />
                        Download Receipt
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center text-yellow-200">
            <img src={assets.empty_orders} alt="Empty Orders" className="w-40 mb-6 opacity-80" />
            <h2 className="text-xl font-semibold">No orders found</h2>
            <p className="text-sm text-yellow-400 mt-2">Your order history will appear here</p>
            <button
              onClick={() => navigate('/collection')}
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-full text-sm transition"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;