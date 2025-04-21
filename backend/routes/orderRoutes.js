import express from 'express'
import { placeOrder,placeOrderPhonePe , placeOrderPaypal,placeOrderGpay , allOrders , updateStatus , userOrders } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'

const orderRouter = express.Router();

//ADMIN FEATURES
orderRouter.post('/list' , adminAuth , allOrders);
orderRouter.post('/status' , adminAuth , updateStatus);

//PAYMENT FEATURES
orderRouter.post('/place' , authUser , placeOrder);
orderRouter.post('/phonepe' , authUser , placeOrderPhonePe);
orderRouter.post('/paypal' , authUser , placeOrderPaypal);
orderRouter.post('/gpay' , authUser , placeOrderGpay);

//USER FEATURE
orderRouter.post('/userOrders' , authUser , userOrders);

export default orderRouter;