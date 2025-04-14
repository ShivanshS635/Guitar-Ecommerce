import User from '../models/userModel.js';

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    const cartData = { ...(userData.cartData || {}) };

    cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : 1;

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Cart Quantity
const updateCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    const cartData = { ...(userData.cartData || {}) };

    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get User Cart Data
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };