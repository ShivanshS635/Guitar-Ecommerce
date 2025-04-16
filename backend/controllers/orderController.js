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

//Placing Order Using Paypal

const placeOrderPaypal = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const { userId } = req.user;

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

//Placing Order Using GooglePay

const placeOrderGpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const { userId } = req.user;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'gpay',
      payment: true,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: 'Google Pay Order Placed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//Get All Orders For Admin

const allOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({});
    res.json({success : true , allOrders});
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

// Update Order Status From Admin Panel

const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderPaypal,
  placeOrderGpay,
  allOrders,
  userOrders,
  updateStatus,
};
