import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from 'crypto'
import axios from 'axios'
import nodemailer from 'nodemailer';

const sendOrderConfirmationMail = async (userEmail, userName, orderDetails, shippingAddress) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_APP_PASSWORD,
    },
  });

  const itemList = orderDetails.items
    .map(item =>
      `<li><strong>${item.name}</strong> (Qty: ${item.quantity}) - ₹${item.price}</li>`
    )
    .join("");

  const addressBlock = `
    ${shippingAddress.firstName} ${shippingAddress.lastName}<br/>
    ${shippingAddress.street}, ${shippingAddress.city}<br/>
    ${shippingAddress.state} - ${shippingAddress.zipcode}<br/>
    ${shippingAddress.country}<br/>
    📞 ${shippingAddress.phone}<br/>
    ✉️ ${shippingAddress.email}
  `;

  const customerMailOptions = {
    from: `"3xizguitars" <${process.env.ADMIN_EMAIL}>`,
    to: userEmail,
    subject: "🎸 Your Order is Confirmed - 3XIZ Guitars",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #111;">Hi ${userName},</h2>
        <p>Your order with <strong>3XIZ Guitars</strong> is <span style="color:green;">confirmed!</span> 🎉</p>

        <h3 style="color:#444;">📦 Order Summary</h3>
        <ul style="padding-left: 20px;">
          ${itemList}
        </ul>

        <p><strong>Total:</strong> ₹${orderDetails.totalAmount}</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

        <h3 style="color:#444;">🚚 Shipping Address</h3>
        <p style="line-height:1.6;">${addressBlock}</p>

        <hr />
        <p style="font-size:14px;">We’ll start preparing your order and you’ll receive updates From Our Admin In A While. Feel free to reply to this email or message us on WhatsApp for any queries.</p>
        <br/>
        <p style="color:#555;">Keep rockin’ 🎶</p>
        <p style="font-weight:bold;">– Team 3XIZ Guitars</p>
      </div>
    `,
  };

  const adminMailOptions = {
    from: `"3XIZ Order Bot" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order from ${userName}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #fffbe6; padding: 20px; border-left: 6px solid #ffbb00;">
        <h2 style="color: #222;">📬 New Order Received</h2>
        <p><strong>Customer:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

        <h3 style="color:#444;">📦 Items Ordered:</h3>
        <ul style="padding-left: 20px;">
          ${itemList}
        </ul>

        <h3 style="color:#444;">🚚 Shipping Info:</h3>
        <p style="line-height:1.6;">${addressBlock}</p>

        <hr />
        <p style="font-size:13px;">Login to the admin dashboard to view and manage this order.</p>
        <p style="font-weight:bold; color:#333;">– 3XIZ System Bot 🤖</p>
      </div>
    `,
  };

  try {
    const infoUser = await transporter.sendMail(customerMailOptions);
    console.log("📧 Order confirmation email sent to user:", infoUser.response);

    const infoAdmin = await transporter.sendMail(adminMailOptions);
    console.log("📧 New order notification email sent to admin:", infoAdmin.response);
  } catch (err) {
    console.error("❌ Failed to send order emails:", err);
  }
};

export default sendOrderConfirmationMail;


// Placing Order Using COD

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user?.userId;
    
    const user = await User.findById(userId);

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    await sendOrderConfirmationMail(
      user.email,
      user.name,
      {
        items,
        totalAmount: amount,
        orderId: newOrder._id,
      },
      address
    );

    res.json({ success: true, message: "Order placed and confirmation mail sent!"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing Order Using PayPal
const placeOrderPaypal = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user?.userId;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "paypal",
      payment: true,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "PayPal Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing Order Using PhonePe
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const placeOrderPhonePe = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const transactionId = "TXN_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      const payload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId: transactionId,
        merchantUserId: "USER_" + Date.now(),
        amount: Math.round(amount * 100), // amount in paise
        redirectUrl: "http://localhost:5174/success",
        redirectMode: "REDIRECT",
        callbackUrl: "http://localhost:4000/payment-status",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const payloadString = JSON.stringify(payload);
      const base64Payload = Buffer.from(payloadString).toString("base64");

      const apiEndpoint = "/pg/v1/pay";
      const checksum =
        crypto
          .createHash("sha256")
          .update(base64Payload + apiEndpoint + process.env.PHONEPE_SALT_KEY)
          .digest("hex") +
        "###" +
        process.env.PHONEPE_SAL_INDEX;

      try {
        const response = await axios.post(
          `${process.env.PHONEPE_BASE_URL}${apiEndpoint}`,
          { request: base64Payload },
          {
            headers: {
              "Content-Type": "application/json",
              "X-VERIFY": checksum,
            },
          }
        );

        if (response.data.success) {
          const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
          return res.json({ checkoutPageUrl: redirectUrl });
        } else {
          console.error("PhonePe Payment Error:", response.data);
          return res
            .status(400)
            .json({ error: response.data.message || "Payment failed" });
        }
      } catch (err) {
        const status = err.response?.status;

        if (status === 429) {
          console.warn(`⚠️ Rate limited. Retrying in 1s... (Attempt ${attempt + 1})`);
          attempt++;
          await sleep(1000);
        } else {
          console.error("Payment Exception:", err.response?.data || err.message);
          return res.status(500).json({ error: "Payment initiation failed" });
        }
      }
    }

    res.status(429).json({ error: "Too many requests. Please try again later." });
  } catch (error) {
    console.error("Payment Exception:", error.message || error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

// Get All Orders For Admin
const allOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).lean();

    // Collect unique userIds
    const userIds = [...new Set(allOrders.map(order => order.userId))];
    
    // Fetch user info for those IDs
    const users = await User.find({ _id: { $in: userIds } })
      .select('name email _id')
      .lean();

    // Map userId to user data
    const userMap = {};
    users.forEach(user => {
      userMap[user._id] = { name: user.name, email: user.email };
    });

    // Attach user info to each order
    const enrichedOrders = allOrders.map(order => ({
      ...order,
      user: userMap[order.userId] || { name: 'Unknown', email: 'N/A' },
    }));

    res.json({ success: true, allOrders: enrichedOrders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    // const orders = await Order.findById({ userId });
    const orders = await Order.find({ userId }).sort({ date: -1 }).lean();

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderPaypal,
  placeOrderPhonePe,
  allOrders,
  userOrders,
};
