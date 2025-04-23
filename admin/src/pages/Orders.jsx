import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import assets from '../assets/assets';
import jsPDF from 'jspdf';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    unpaidOrders: 0
  });
const generateAvatar = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
      <div className={`${randomColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
        {initials}
      </div>
    );
};

const generateReceipt = (order) => {
    const doc = new jsPDF();
    
    // Color Palette
    const colors = {
        primary: [217, 83, 30], // Brand orange
        secondary: [40, 40, 40], // Dark grey
        lightBg: [245, 245, 245], // Light grey background
        success: [46, 125, 50], // Green for success
        textDark: [30, 30, 30], // Dark text
        textLight: [100, 100, 100] // Light text
    };

    // Document Setup
    doc.setProperties({
        title: `Order Receipt - ${order._id}`,
        subject: 'Purchase Receipt',
        author: '3xizGuitars',
        creator: '3xizGuitars E-Commerce System'
    });

    doc.setFont("helvetica", "normal");
    doc.setLineHeightFactor(1.2);

    // =================== HEADER SECTION ===================
    // Brand Header Bar
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 15, 'F');
    
    // Add logo (centered)
    const logoWidth = 15;
    const logoHeight = 15;
    doc.addImage(
        assets.logo, 
        'JPEG', 
        (210 - logoWidth) / 2, 
        15, 
        logoWidth, 
        logoHeight
    );

    // =================== RECEIPT INFO SECTION ===================
    // Grey Info Background
    doc.setFillColor(...colors.lightBg);
    doc.rect(10, 40, 190, 30, 'F');
    
    // Receipt Title
    doc.setFontSize(18);
    doc.setTextColor(...colors.textDark);
    doc.text('ORDER RECEIPT', 105, 35, { align: 'center' });

    // Receipt Metadata
    doc.setFontSize(10);
    doc.setTextColor(...colors.textLight);
    
    // Generate a more readable receipt number
    const datePart = new Date(order.date).toISOString().slice(2, 10).replace(/-/g, '');
    const orderNum = order._id.toString().slice(-4).toUpperCase();
    const receiptNo = `3XG-${datePart}-${orderNum}`;
    
    doc.text(`Receipt #: ${receiptNo}`, 15, 45);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 15, 50);
    doc.text(`Order Status: ${order.status}`, 150, 45);
    doc.text(`Payment: ${order.payment ? 'Paid' : 'Pending'} (${order.paymentMethod})`, 150, 50);

    // =================== CUSTOMER INFORMATION ===================
    let yPos = 60;
    doc.setFontSize(11);
    doc.setTextColor(...colors.textDark);
    
    // Section Header
    doc.setFillColor(...colors.primary);
    doc.rect(10, yPos, 190, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('CUSTOMER INFORMATION', 15, yPos + 6);
    
    yPos += 12;
    
    // Customer Details
    const addr = order.address;
    doc.setTextColor(...colors.textDark);
    
    // Billing Info
    doc.text('Billing Address:', 15, yPos);
    doc.text(`${addr.firstName} ${addr.lastName}`, 15, yPos + 7);
    doc.text(addr.street, 15, yPos + 14);
    doc.text(`${addr.city}, ${addr.state} ${addr.zipcode}`, 15, yPos + 21);
    doc.text(addr.country, 15, yPos + 28);
    doc.text(`Phone: ${addr.phone}`, 15, yPos + 35);
    doc.text(`Email: ${addr.email}`, 15, yPos + 42);

    // Shipping Info (if different)
    doc.text('Shipping Address:', 110, yPos);
    doc.text(`${addr.firstName} ${addr.lastName}`, 110, yPos + 7);
    doc.text(addr.street, 110, yPos + 14);
    doc.text(`${addr.city}, ${addr.state} ${addr.zipcode}`, 110, yPos + 21);
    doc.text(addr.country, 110, yPos + 28);
    
    yPos += 50;

    // =================== ORDER ITEMS TABLE ===================
    // Table Header
    doc.setFillColor(...colors.primary);
    doc.rect(10, yPos, 190, 8, 'F');
    doc.setTextColor(255, 255, 255);
    
    doc.text('Description', 15, yPos + 6);
    doc.text('Qty', 120, yPos + 6);
    doc.text('Unit Price', 140, yPos + 6);
    doc.text('Total', 180, yPos + 6, { align: 'right' });
    
    yPos += 10;
    
    // Table Rows
    doc.setTextColor(...colors.textDark);
    let subtotal = 0;
    
    order.items.forEach((item, index) => {
        // Alternate row colors for better readability
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
        } else {
            doc.setFillColor(...colors.lightBg);
        }
        
        doc.rect(10, yPos, 190, 10, 'F');
        
        // Item name (with word wrapping)
        const itemNameLines = doc.splitTextToSize(item.name, 80);
        doc.text(itemNameLines, 15, yPos + 7);
        
        // Other columns
        doc.text(String(item.quantity), 120, yPos + 7);
        doc.text(formatPrice(item.price), 140, yPos + 7);
        doc.text(formatPrice(item.price * item.quantity), 190, yPos + 7, { align: 'right' });
        
        subtotal += item.price * item.quantity;
        yPos += 10;
        
        // Handle multi-line item names
        if (itemNameLines.length > 1) {
            yPos += (itemNameLines.length - 1) * 7;
        }
    });

    // =================== ORDER SUMMARY ===================
    yPos += 10;
    
    // Horizontal line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(10, yPos, 200, yPos);
    
    yPos += 5;
    
    // Summary calculations
    const discount = order.discount || 0;
    const shipping = order.deliveryCharges || 0;
    const tax = order.tax || 0;
    const total = subtotal - discount + shipping + tax;
    
    // Summary table
    doc.setFontSize(11);
    
    // Subtotal
    doc.text('Subtotal:', 140, yPos);
    doc.text(formatPrice(subtotal), 180, yPos, { align: 'right' });
    yPos += 7;
    
    // Discount
    if (discount > 0) {
        doc.setTextColor(0, 150, 0);
        doc.text('Discount:', 140, yPos);
        doc.text(`-${formatPrice(discount)}`, 180, yPos, { align: 'right' });
        yPos += 7;
        doc.setTextColor(...colors.textDark);
    }
    
    // Shipping
    doc.text('Shipping:', 140, yPos);
    doc.text(formatPrice(shipping), 180, yPos, { align: 'right' });
    yPos += 7;
    
    // Tax
    if (tax > 0) {
        doc.text('Tax:', 140, yPos);
        doc.text(formatPrice(tax), 180, yPos, { align: 'right' });
        yPos += 7;
    }
    
    // Total
    yPos += 3;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 140, yPos);
    doc.text(formatPrice(total), 180, yPos, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Payment status
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(...colors.textLight);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 15, yPos);
    doc.text(`Payment Status: ${order.payment ? 'PAID' : 'PENDING'}`, 15, yPos + 7);
    
    // =================== FOOTER SECTION ===================
    yPos += 20;
    
    // Thank you message
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.text('Thank you for your order!', 105, yPos, { align: 'center' });
    
    // Contact information
    doc.setFontSize(10);
    doc.setTextColor(...colors.textLight);
    doc.text('For any questions about your order, please contact:', 105, yPos + 10, { align: 'center' });
    doc.text('Email: 3xizguitars@gmail.com | Phone: +91 95180 35716', 105, yPos + 17, { align: 'center' });
    
    // Terms and conditions
    doc.setFontSize(8);
    doc.text('This is an electronically generated receipt and does not require a signature.', 105, yPos + 25, { align: 'center' });

    // =================== SAVE PDF ===================
    const customerName = `${addr.firstName}_${addr.lastName}`.replace(/\s+/g, '_');
    const receiptDate = new Date(order.date).toISOString().split('T')[0];
    doc.save(`3xizGuitars_Receipt_${receiptNo}_${customerName}.pdf`);
};
const formatPrice = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
};

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const allOrders = res.data.allOrders || [];
        setOrders(allOrders);
        
        // Calculate statistics
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.payment ? order.amount : 0), 0);
        const totalOrders = allOrders.length;
        const paidOrders = allOrders.filter(order => order.payment).length;
        
        setStats({
          totalRevenue,
          totalOrders,
          paidOrders,
          unpaidOrders: totalOrders - paidOrders
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.user?.name?.toLowerCase().includes(searchLower)) ||
      (order.user?.email?.toLowerCase().includes(searchLower)) ||
      order._id.toLowerCase().includes(searchLower)
    );
  });

  const groupByUser = filteredOrders.reduce((acc, order) => {
    const key = `${order.userId}__${order.user?.name || 'Unknown'}__${order.user?.email || ''}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div className="p-4 text-gray-800">

      {/* 🔍 Search Input Field */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email or order ID..."
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.entries(groupByUser).map(([key, userOrders]) => {
        const [userId, name, email] = key.split('__');
        const totalSpent = userOrders.reduce((sum, order) => sum + order.amount, 0);
        
        return (
          <div key={userId} className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
            {/* 👤 User Info Card with Avatar */}
            <div className="bg-gray-50 p-4 flex items-start gap-4">
              {generateAvatar(name)}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {name}
                </h3>
                <p className="text-sm text-gray-600">{email}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Total spent:</span> {currency}{totalSpent.toFixed(2)} • 
                  <span className="font-medium ml-2">Orders:</span> {userOrders.length}
                </p>
              </div>
            </div>

            {userOrders.map((order, idx) => (
              <div
                key={order._id}
                className="p-4 border-t border-gray-200 space-y-3 bg-white"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Order #{idx + 1}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {order._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleString()}
                    </span>
                    {/* 🧾 Receipt Button */}
                    <button 
                      onClick={() => generateReceipt(order)}
                      className="text-sm bg-white border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Receipt
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Payment:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      order.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.payment ? 'Paid' : 'Unpaid'} ({order.paymentMethod})
                    </span>
                  </p>
                  <p><span className="font-medium">Amount:</span> {currency}{order.amount.toFixed(2)}</p>
                  <p><span className="font-medium">Address:</span> {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}</p>
                </div>

                {/* 📱 Responsive Items List */}
                <div className="pt-2">
                  <p className="font-medium">Items:</p>
                  <div className="overflow-x-auto">
                    <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm bg-gray-50 px-3 py-2 rounded flex-shrink-0">
                          {item.name} × {item.quantity} — {currency}{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {filteredOrders.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No orders found matching your search
        </div>
      )}
    </div>
  );
};

export default Orders;