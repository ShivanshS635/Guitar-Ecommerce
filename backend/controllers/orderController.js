import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
//Placing Order Using COD

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const { userId } = req.user;

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

//Placing Order Using Stripe

const placeOrderStripe = async (req, res) => {};

//Placing Order Using Razorpay

const placeOrderRazorpay = async (req, res) => {};

//Get All Orders For Admin

const allOrders = async (req, res) => {};

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

// Update Order Status From Admin Panel

const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};
