import express from 'express'
import { placeOrder , placeOrderRazorpay , placeOrderStripe , allOrders , updateStatus , userOrders } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'

const orderRouter = express.Router();

//ADMIN FEATURES
orderRouter.post('/list' , adminAuth , allOrders);
orderRouter.post('/status' , adminAuth , updateStatus);

//PAYMENT FEATURES
orderRouter.post('/place' , authUser , placeOrder);
orderRouter.post('/stripe' , authUser , placeOrderStripe);
orderRouter.post('/razorpay' , authUser , placeOrderRazorpay);

//USER FEATURE
orderRouter.post('/userOrders' , authUser , userOrders);

export default orderRouter;