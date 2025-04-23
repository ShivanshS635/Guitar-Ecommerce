import express from 'express'
import { placeOrder,placeOrderPhonePe , placeOrderPaypal, allOrders  , userOrders } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'

const orderRouter = express.Router();

//ADMIN FEATURES
orderRouter.post('/list' , adminAuth , allOrders);

//PAYMENT FEATURES
orderRouter.post('/place' , authUser , placeOrder);
orderRouter.post('/phonepe' , authUser , placeOrderPhonePe);
orderRouter.post('/paypal' , authUser , placeOrderPaypal);

//USER FEATURE
orderRouter.post('/userOrders' , authUser , userOrders);

export default orderRouter;