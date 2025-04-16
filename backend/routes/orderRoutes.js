import express from 'express'
import { placeOrder , placeOrderPaypal,placeOrderGpay , allOrders , updateStatus , userOrders } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'

const orderRouter = express.Router();

//ADMIN FEATURES
orderRouter.post('/list' , adminAuth , allOrders);
orderRouter.post('/status' , adminAuth , updateStatus);

//PAYMENT FEATURES
orderRouter.post('/place' , authUser , placeOrder);
orderRouter.post('/paypal' , authUser , placeOrderPaypal);
orderRouter.post('/gpay' , authUser , placeOrderGpay);

//USER FEATURE
orderRouter.post('/userOrders' , authUser , userOrders);

export default orderRouter;