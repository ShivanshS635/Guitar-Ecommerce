import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from 'crypto'
import axios from 'axios'
// Placing Order Using COD

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user?.userId;

    console.log(userId);

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

    res.json({ success: true, message: "Order Placed" });
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
